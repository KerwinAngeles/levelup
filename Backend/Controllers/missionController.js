const Mission = require('../Models/Mission');
const User = require('../Models/User');
const Rank = require('../Models/Rank');
const Award = require('../Models/Award');
const { Op } = require('sequelize');
const { availableAwards } = require('../utils/const');
const { calcularRango } = require('../utils/progress');

// Function to calculate XP based on mission type
const calculateMissionXP = (statTarget) => {
    const xpValues = {
        'Push_Ups': 25,
        'Sit_Ups': 20,
        'Pull_Ups': 30,
        'Plank': 15,
        'Squats': 18,
        'Running': 35,
        'Jogging': 22
    };

    return xpValues[statTarget] || 10;
};

const calculateBonusXP = async (userId, statTarget) => {
    try {
        // Get recent completed missions of the same type (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentMissions = await Mission.findAll({
            where: {
                userId,
                statTarget,
                status: 'completada',
                createdAt: {
                    [require('sequelize').Op.gte]: sevenDaysAgo
                }
            },
            order: [['createdAt', 'DESC']]
        });

        // Bonus for consecutive days (max 5 days = 50% bonus)
        const consecutiveDays = recentMissions.length;
        const bonusPercentage = Math.min(consecutiveDays * 10, 50); // 10% per day, max 50%

        return {
            consecutiveDays,
            bonusPercentage,
            bonusXP: Math.floor(calculateMissionXP(statTarget) * (bonusPercentage / 100))
        };
    } catch (error) {
        return { consecutiveDays: 0, bonusPercentage: 0, bonusXP: 0 };
    }
};

// Function to update user XP and level
const updateUserXP = async (userId, xpToAdd) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const currentXP = user.xp || 0;
        const newXP = currentXP + xpToAdd;

        const newLevel = Math.floor(newXP / 100) + 1;
        const newRankName = calcularRango(newLevel);

        await user.update({
            xp: newXP,
            level: newLevel
        });

        const [rank, created] = await Rank.findOrCreate({
            where: { userId },
            defaults: { name: newRankName }
        });

        if (!created && rank.name !== newRankName) {
            await rank.update({ name: newRankName });
        }

        return {
            newXP,
            newLevel,
            newRankName
        };
    } catch (error) {
        throw error;
    }
};

// Función para verificar y desbloquear premios basados en misiones completadas
const checkAndUnlockAwards = async (userId) => {
    try {
        // Obtener todas las misiones completadas del usuario
        const completedMissions = await Mission.findAll({
            where: {
                userId,
                status: 'completada'
            },
            order: [['updatedAt', 'ASC']]
        });

        const totalCompleted = completedMissions.length;

        // Verificar premios especiales que requieren condiciones adicionales
        const specialAwards = [];

        // Premio por completar 7 misiones en menos de 10 días
        if (totalCompleted >= 7) {
            const tenDaysAgo = new Date();
            tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
            const recentMissions = completedMissions.filter(m =>
                new Date(m.updatedAt) >= tenDaysAgo
            );
            if (recentMissions.length >= 7) {
                specialAwards.push('Soldado Activo');
            }
        }

        // Premio por completar 25 misiones en 20 días
        if (totalCompleted >= 25) {
            const twentyDaysAgo = new Date();
            twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
            const recentMissions = completedMissions.filter(m =>
                new Date(m.updatedAt) >= twentyDaysAgo
            );
            if (recentMissions.length >= 25) {
                specialAwards.push('Teniente');
            }
        }

        // Premio por completar 110 misiones antes de las 8am
        if (totalCompleted >= 110) {
            const earlyMissions = completedMissions.filter(m => {
                const completionTime = new Date(m.updatedAt);
                return completionTime.getHours() < 8;
            });
            if (earlyMissions.length >= 110) {
                specialAwards.push('Águila del Amanecer');
            }
        }

        // Obtener premios existentes del usuario
        const existingAwards = await Award.findAll({
            where: { userId }
        });

        const existingAwardNames = existingAwards.map(a => a.Name);
        const newlyUnlocked = [];

        // Verificar premios básicos (solo por cantidad)
        for (const award of availableAwards) {
            if (totalCompleted >= award.required && !existingAwardNames.includes(award.name)) {
                // Verificar si es un premio especial que ya fue verificado
                if (specialAwards.includes(award.name)) {
                    continue; // Ya se verificó arriba
                }

                // Crear el premio
                await Award.create({
                    userId,
                    Name: award.name,
                    description: award.description,
                    status: 'desbloqueado'
                });
                newlyUnlocked.push(award.name);
            }
        }

        // Crear premios especiales verificados
        for (const specialAward of specialAwards) {
            if (!existingAwardNames.includes(specialAward)) {
                const awardInfo = availableAwards.find(a => a.name === specialAward);
                await Award.create({
                    userId,
                    Name: specialAward,
                    description: awardInfo.description,
                    status: 'desbloqueado'
                });
                newlyUnlocked.push(specialAward);
            }
        }

        return { newlyUnlocked, totalCompleted };
    } catch (error) {
        throw error;
    }
};

exports.createMission = async (req, res) => {
    const { title, description, statTarget, dueDate } = req.body;
    const userId = req.user.id;

    console.log('Creating mission with data:', { title, description, statTarget, dueDate, userId }); // Debug log

    try {
        const mission = await Mission.create({
            userId,
            title,
            description,
            statTarget,
            dueDate
        });

        console.log('Mission created:', mission.toJSON()); // Debug log
        res.status(201).json({ msg: 'Mission created successfully', mission });
    } catch (e) {
        console.error('Error creating mission:', e); // Debug log
        res.status(500).json({ msg: 'Failed to create mission', e: e.message });
    }
}

exports.updateMission = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    try {
        const mission = await Mission.findOne({ where: { id, userId } });
        if (!mission) return res.status(404).json({ msg: 'Mission not found' });

        const previousStatus = mission.status;
        await mission.update(req.body);

        // If mission was completed (status changed to 'completada'), add XP to user and check awards
        if (status === 'completada' && previousStatus !== 'completada') {
            const baseXP = calculateMissionXP(mission.statTarget);
            const bonus = await calculateBonusXP(userId, mission.statTarget);
            const totalXP = baseXP + bonus.bonusXP;

            const { newXP, newLevel, newRankName } = await updateUserXP(userId, totalXP);

            // Check and unlock awards
            const { newlyUnlocked, totalCompleted } = await checkAndUnlockAwards(userId);

            res.json({
                msg: 'Mission updated and XP awarded',
                mission,
                xpGained: totalXP,
                baseXP: baseXP,
                bonusXP: bonus.bonusXP,
                consecutiveDays: bonus.consecutiveDays,
                newUserXP: newXP,
                newUserLevel: newLevel,
                newUserRank: newRankName,
                newlyUnlockedAwards: newlyUnlocked,
                totalMissionsCompleted: totalCompleted
            });
        } else {
            res.json({ msg: 'Mission updated', mission });
        }
    } catch (e) {
        res.status(500).json({ msg: 'Failed to update mission', e: e.message });
    }
}

exports.deleteMission = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const mission = await Mission.findOne({ where: { id, userId } });
        if (!mission) return res.status(404).json({ msg: 'Mission not found' });
        await mission.destroy();
        res.json({ msg: 'Mission deleted successfully' });
    } catch (e) {
        res.status(500).json({ msg: 'Failed to delete mission', e: e.message });
    }
}

exports.getAllMissions = async (req, res) => {
    const userId = req.user.id;
    try {
        const missions = await Mission.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
        res.json(missions)
    } catch (e) {
        res.status(500).json({ msg: 'Error fetching missions', e: e.message });
    }
}

exports.getUserXPStats = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Get XP statistics by mission type
        const missions = await Mission.findAll({
            where: { userId, status: 'completada' }
        });

        const xpByType = {};
        const statTargets = ['Push_Ups', 'Sit_Ups', 'Pull_Ups', 'Plank', 'Squats', 'Running', 'Jogging'];

        statTargets.forEach(target => {
            const missionsOfType = missions.filter(m => m.statTarget === target);
            const totalXP = missionsOfType.reduce((sum, m) => sum + calculateMissionXP(m.statTarget), 0);
            xpByType[target] = {
                missionsCompleted: missionsOfType.length,
                totalXP: totalXP
            };
        });

        res.json({
            currentXP: user.xp,
            currentLevel: user.level,
            totalMissionsCompleted: missions.length,
            xpByType
        });
    } catch (e) {
        res.status(500).json({ msg: 'Error fetching user XP stats', e: e.message });
    }
}