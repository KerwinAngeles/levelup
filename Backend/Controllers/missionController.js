const Mission = require('../Models/Mission');
const User = require('../Models/User');
const Award = require('../Models/Award');
const { Op } = require('sequelize');

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
        console.error('Error calculating bonus XP:', error);
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
        
        // Calculate new level (every 100 XP = 1 level)
        const newLevel = Math.floor(newXP / 100) + 1;
        
        await user.update({
            xp: newXP,
            level: newLevel
        });

        return { newXP, newLevel };
    } catch (error) {
        console.error('Error updating user XP:', error);
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

        // Definir los premios disponibles con sus requisitos
        const availableAwards = [
            { name: 'Recluta', description: 'Completa 1 misión', required: 1 },
            { name: 'Cadete Novato', description: 'Completa 3 misiones', required: 3 },
            { name: 'Soldado en Práctica', description: 'Completa 5 misiones', required: 5 },
            { name: 'Soldado Activo', description: 'Completa 7 misiones en menos de 10 días', required: 7 },
            { name: 'Guardia en Formación', description: 'Completa 10 misiones', required: 10 },
            { name: 'Oficial Raso', description: 'Completa 15 misiones sin fallar ninguna', required: 15 },
            { name: 'Sargento de Misión', description: 'Completa 20 misiones', required: 20 },
            { name: 'Teniente', description: 'Completa 25 misiones en 20 días', required: 25 },
            { name: 'Capitán en Acción', description: 'Completa 30 misiones', required: 30 },
            { name: 'Comandante de Escuadra', description: 'Completa 35 misiones sin saltarte 3 días seguidos', required: 35 },
            { name: 'Mayor del Terreno', description: 'Completa 40 misiones', required: 40 },
            { name: 'Coronel de Nivel', description: 'Completa 45 misiones en total', required: 45 },
            { name: 'General de Misiones', description: 'Completa 50 misiones', required: 50 },
            { name: 'Veterano Persistente', description: 'Completa 55 misiones sin dejar de entrenar más de 2 días seguidos', required: 55 },
            { name: 'Comandante Supremo', description: 'Completa 60 misiones', required: 60 },
            { name: 'Piloto Novato', description: 'Completa 70 misiones', required: 70 },
            { name: 'Capitán del Aire', description: 'Completa 80 misiones', required: 80 },
            { name: 'Piloto de Guerra', description: 'Completa 90 misiones sin fallar 2 días seguidos', required: 90 },
            { name: 'As del Cielo', description: 'Completa 100 misiones', required: 100 },
            { name: 'Águila del Amanecer', description: 'Completa 110 misiones antes de las 8am', required: 110 },
            { name: 'Leyenda de Hierro', description: 'Completa 120 misiones', required: 120 },
            { name: 'Dominador de Campo', description: 'Completa 130 misiones', required: 130 },
            { name: 'Mente Imparable', description: 'Completa 140 misiones sin pausas mayores a 2 días', required: 140 },
            { name: 'Guardián del Ritmo', description: 'Completa 150 misiones', required: 150 },
            { name: 'General Invicto', description: 'Completa 160 misiones', required: 160 },
            { name: 'Dios de la Disciplina', description: 'Completa 175 misiones', required: 175 },
            { name: 'Fuerza Inmortal', description: 'Completa 190 misiones sin pausas mayores a 3 días', required: 190 },
            { name: 'Fénix de Hierro', description: 'Completa 200 misiones', required: 200 },
            { name: 'Leyenda Legendaria', description: 'Completa 225 misiones', required: 225 },
            { name: 'Maestro Supremo', description: 'Completa 250 misiones', required: 250 },
            { name: 'El Indestructible', description: 'Completa 275 misiones', required: 275 },
            { name: 'Comandante del Universo', description: 'Completa 300 misiones', required: 300 },
            { name: 'El Inquebrantable', description: 'Completa 325 misiones', required: 325 },
            { name: 'Dominador del Sistema', description: 'Completa 350 misiones', required: 350 },
            { name: 'Sombra Imparable', description: 'Completa 375 misiones', required: 375 },
            { name: 'Ícono de LevelUp', description: 'Completa 400 misiones', required: 400 },
            { name: 'Campeón del Pueblo', description: 'Completa 425 misiones', required: 425 },
            { name: 'General Planetario', description: 'Completa 450 misiones', required: 450 },
            { name: 'Héroe del Tiempo', description: 'Completa 475 misiones', required: 475 },
            { name: 'Leyenda del Mundo Real', description: 'Completa 500 misiones', required: 500 }
        ];

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
        console.error('Error checking and unlocking awards:', error);
        throw error;
    }
};

exports.createMission = async (req, res) => {
    const {title, description, statTarget, dueDate} = req.body;
    const userId = req.user.id;

    console.log('Creating mission with data:', { title, description, statTarget, dueDate, userId }); // Debug log

    try{
        const mission = await Mission.create({
            userId,
            title,
            description,
            statTarget,
            dueDate
        });

        console.log('Mission created:', mission.toJSON()); // Debug log
        res.status(201).json({msg: 'Mission created successfully', mission});
    } catch(e){
        console.error('Error creating mission:', e); // Debug log
        res.status(500).json({msg: 'Failed to create mission', e: e.message });
    }
}

exports.updateMission = async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    console.log('Updating mission:', { id, userId, status, body: req.body }); // Debug log

    try{
        const mission = await Mission.findOne({where: {id, userId}});
        if(!mission) return res.status(404).json({msg: 'Mission not found'});
        
        console.log('Found mission:', mission.toJSON()); // Debug log
        
        const previousStatus = mission.status;
        console.log('Previous status:', previousStatus, 'New status:', status); // Debug log
        
        await mission.update(req.body);
        
        // If mission was completed (status changed to 'completada'), add XP to user and check awards
        if (status === 'completada' && previousStatus !== 'completada') {
            const baseXP = calculateMissionXP(mission.statTarget);
            const bonus = await calculateBonusXP(userId, mission.statTarget);
            const totalXP = baseXP + bonus.bonusXP;
            
            const { newXP, newLevel } = await updateUserXP(userId, totalXP);
            
            // Check and unlock awards
            const { newlyUnlocked, totalCompleted } = await checkAndUnlockAwards(userId);
            
            console.log(`Mission completed! User ${userId} gained ${baseXP} base XP + ${bonus.bonusXP} bonus XP = ${totalXP} total XP. New total: ${newXP}, New level: ${newLevel}`);
            if (newlyUnlocked.length > 0) {
                console.log(`New awards unlocked: ${newlyUnlocked.join(', ')}`);
            }
            
            res.json({
                msg: 'Mission updated and XP awarded', 
                mission,
                xpGained: totalXP,
                baseXP: baseXP,
                bonusXP: bonus.bonusXP,
                consecutiveDays: bonus.consecutiveDays,
                newUserXP: newXP,
                newUserLevel: newLevel,
                newlyUnlockedAwards: newlyUnlocked,
                totalMissionsCompleted: totalCompleted
            });
        } else {
            res.json({msg: 'Mission updated', mission});
        }
    }catch(e){
        console.error('Error updating mission:', e);
        res.status(500).json({msg: 'Failed to update mission', e: e.message});
    }
}

exports.deleteMission = async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;

    try{
        const mission = await Mission.findOne({where: {id, userId}});
        if(!mission) return res.status(404).json({msg: 'Mission not found'});
        await mission.destroy();
        res.json({msg: 'Mission deleted successfully'});
    } catch(e){
        res.status(500).json({msg: 'Failed to delete mission', e: e.message});
    }
}

exports.getAllMissions = async (req, res) => {
    const userId = req.user.id;
    try{
        const missions = await Mission.findAll({where: {userId}});
        console.log('Fetched missions for user:', userId, missions.map(m => ({ id: m.id, title: m.title, statTarget: m.statTarget, status: m.status }))); // Debug log
        res.json(missions)
    }catch(e){
        console.error('Error fetching missions:', e); // Debug log
        res.status(500).json({msg: 'Error fetching missions', e: e.message});
    }
}

exports.getUserXPStats = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({msg: 'User not found'});
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
    } catch(e) {
        console.error('Error fetching user XP stats:', e);
        res.status(500).json({msg: 'Error fetching user XP stats', e: e.message});
    }
}