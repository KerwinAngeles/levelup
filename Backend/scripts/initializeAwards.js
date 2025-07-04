const sequelize = require('../config/db');
const User = require('../Models/User');
const Award = require('../Models/Award');

// Función para inicializar premios para un usuario
const initializeUserAwards = async (userId) => {
    try {
        const existingAwards = await Award.findAll({
            where: { userId }
        });

        if (existingAwards.length === 0) {
            // Crear todos los premios como bloqueados inicialmente
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

            for (const award of availableAwards) {
                await Award.create({
                    userId,
                    Name: award.name,
                    description: award.description,
                    status: 'bloqueado'
                });
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error initializing user awards:', error);
        throw error;
    }
};

// Función principal para ejecutar el script
const main = async () => {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        console.log('🔍 Buscando usuarios sin premios...');
        const users = await User.findAll();
        console.log(`📊 Encontrados ${users.length} usuarios`);

        let initializedCount = 0;
        let skippedCount = 0;

        for (const user of users) {
            try {
                const wasInitialized = await initializeUserAwards(user.id);
                if (wasInitialized) {
                    console.log(`✅ Premios inicializados para usuario ${user.id} (${user.username})`);
                    initializedCount++;
                } else {
                    console.log(`⏭️  Usuario ${user.id} (${user.username}) ya tiene premios`);
                    skippedCount++;
                }
            } catch (error) {
                console.error(`❌ Error inicializando premios para usuario ${user.id}:`, error.message);
            }
        }

        console.log('\n📈 Resumen:');
        console.log(`✅ Usuarios con premios inicializados: ${initializedCount}`);
        console.log(`⏭️  Usuarios que ya tenían premios: ${skippedCount}`);
        console.log(`📊 Total de usuarios procesados: ${users.length}`);

        console.log('\n🎉 ¡Script completado exitosamente!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error ejecutando el script:', error);
        process.exit(1);
    }
};

// Ejecutar el script si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { initializeUserAwards }; 