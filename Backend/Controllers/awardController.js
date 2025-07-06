const Award = require('../Models/Award');
const Mission = require('../Models/Mission');
const { Op } = require('sequelize');

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
        throw error;
    }
};

exports.getAllAwards = async (req, res) => {
    const userId = req.user.id;
    try {
        
        // Verificar y desbloquear premios
        const { newlyUnlocked, totalCompleted } = await checkAndUnlockAwards(userId);
        
        // Obtener todos los premios del usuario
        const awards = await Award.findAll({
            where: { userId },
            order: [['createdAt', 'ASC']]
        });
        
        res.json({
            awards,
            totalCompleted,
            newlyUnlocked
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching awards', error: error.message });
    }
};


exports.getAllAwardsCount = async (req, res) => {
    const userId = req.user.id;
    try {
        const awards = await Award.findAndCountAll({
            where: { userId },
            order: [['createdAt', 'ASC']]
        });
        res.json({
            awards,
            totalCount: awards.count,
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching awards', error: error.message });
    }
};


exports.initializeAwards = async (req, res) => {
    const userId = req.user.id;
    try {
        await initializeUserAwards(userId);
        res.json({ msg: 'Awards initialized successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error initializing awards', error: error.message });
    }
};

exports.checkAwards = async (req, res) => {
    const userId = req.user.id;
    try {
        const { newlyUnlocked, totalCompleted } = await checkAndUnlockAwards(userId);
        res.json({
            newlyUnlocked,
            totalCompleted,
            message: newlyUnlocked.length > 0 ? `¡Desbloqueaste ${newlyUnlocked.length} premio(s)!` : 'No hay nuevos premios desbloqueados'
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error checking awards', error: error.message });
    }
};
