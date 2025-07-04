import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import api from '../api';

import {
  User, Footprints, Lock, Award, Trophy, Star, Zap, Flame, CheckCircle, Shield, Target, Sword, AlertTriangle, Dumbbell, BatteryFull, Crown, Medal, Users, ShieldCheck, Book, BadgeCheck, ClipboardList, Flag, Globe, CloudSun, Infinity, Sun, Sparkles, Rocket, Mountain, Swords, Ghost, Plane, PlaneTakeoff, Wind, Compass, Navigation, Search, Map, Castle
} from 'lucide-react';

// Lista de todos los logros posibles (puedes expandirla)
const MISSION_AWARDS = [
  { name: 'Recluta', description: 'Completa 1 misión', required: 1, icon: <Shield className="h-8 w-8" /> },
  { name: 'Cadete Novato', description: 'Completa 3 misiones', required: 3, icon: <User className="h-8 w-8" /> },
  { name: 'Soldado en Práctica', description: 'Completa 5 misiones', required: 5, icon: <Footprints className="h-8 w-8" /> },
  { name: 'Soldado Activo', description: 'Completa 7 misiones en menos de 10 días', required: 7, icon: <Book className="h-8 w-8" /> },
  { name: 'Guardia en Formación', description: 'Completa 10 misiones', required: 10, icon: <CheckCircle className="h-8 w-8" /> },

  { name: 'Oficial Raso', description: 'Completa 15 misiones sin fallar ninguna', required: 15, icon: <BadgeCheck className="h-8 w-8" /> },
  { name: 'Sargento de Misión', description: 'Completa 20 misiones', required: 20, icon: <Star className="h-8 w-8" /> },
  { name: 'Teniente', description: 'Completa 25 misiones en 20 días', required: 25, icon: <Target className="h-8 w-8" /> },
  { name: 'Capitán en Acción', description: 'Completa 30 misiones', required: 30, icon: <ClipboardList className="h-8 w-8" /> },
  { name: 'Comandante de Escuadra', description: 'Completa 35 misiones sin saltarte 3 días seguidos', required: 35, icon: <Trophy className="h-8 w-8" /> },

  { name: 'Mayor del Terreno', description: 'Completa 40 misiones', required: 40, icon: <Flame className="h-8 w-8" /> },
  { name: 'Coronel de Nivel', description: 'Completa 45 misiones en total', required: 45, icon: <ShieldCheck className="h-8 w-8" /> },
  { name: 'General de Misiones', description: 'Completa 50 misiones', required: 50, icon: <Flag className="h-8 w-8" /> },
  { name: 'Veterano Persistente', description: 'Completa 55 misiones sin dejar de entrenar más de 2 días seguidos', required: 55, icon: <Medal className="h-8 w-8" /> },
  { name: 'Comandante Supremo', description: 'Completa 60 misiones', required: 60, icon: <Zap className="h-8 w-8" /> },

  { name: 'Piloto Novato', description: 'Completa 70 misiones', required: 70, icon: <Plane className="h-8 w-8" /> },
  { name: 'Capitán del Aire', description: 'Completa 80 misiones', required: 80, icon: <PlaneTakeoff className="h-8 w-8" /> },
  { name: 'Piloto de Guerra', description: 'Completa 90 misiones sin fallar 2 días seguidos', required: 90, icon: <Wind className="h-8 w-8" /> },
  { name: 'As del Cielo', description: 'Completa 100 misiones', required: 100, icon: <Compass className="h-8 w-8" /> },
  { name: 'Águila del Amanecer', description: 'Completa 110 misiones antes de las 8am', required: 110, icon: <Navigation className="h-8 w-8" /> },

  { name: 'Leyenda de Hierro', description: 'Completa 120 misiones', required: 120, icon: <Search className="h-8 w-8" /> },
  { name: 'Dominador de Campo', description: 'Completa 130 misiones', required: 130, icon: <Map className="h-8 w-8" /> },
  { name: 'Mente Imparable', description: 'Completa 140 misiones sin pausas mayores a 2 días', required: 140, icon: <Globe className="h-8 w-8" /> },
  { name: 'Guardián del Ritmo', description: 'Completa 150 misiones', required: 150, icon: <CloudSun className="h-8 w-8" /> },
  { name: 'General Invicto', description: 'Completa 160 misiones', required: 160, icon: <Award className="h-8 w-8" /> },

  { name: 'Dios de la Disciplina', description: 'Completa 175 misiones', required: 175, icon: <Sword className="h-8 w-8" /> },
  { name: 'Fuerza Inmortal', description: 'Completa 190 misiones sin pausas mayores a 3 días', required: 190, icon: <Crown className="h-8 w-8" /> },
  { name: 'Fénix de Hierro', description: 'Completa 200 misiones', required: 200, icon: <Rocket className="h-8 w-8" /> },
  { name: 'Leyenda Legendaria', description: 'Completa 225 misiones', required: 225, icon: <Mountain className="h-8 w-8" /> },
  { name: 'Maestro Supremo', description: 'Completa 250 misiones', required: 250, icon: <Trophy className="h-8 w-8" /> },

  { name: 'El Indestructible', description: 'Completa 275 misiones', required: 275, icon: <Flame className="h-8 w-8" /> },
  { name: 'Comandante del Universo', description: 'Completa 300 misiones', required: 300, icon: <ShieldCheck className="h-8 w-8" /> },
  { name: 'El Inquebrantable', description: 'Completa 325 misiones', required: 325, icon: <Castle className="h-8 w-8" /> },
  { name: 'Dominador del Sistema', description: 'Completa 350 misiones', required: 350, icon: <Swords className="h-8 w-8" /> },
  { name: 'Sombra Imparable', description: 'Completa 375 misiones', required: 375, icon: <Ghost className="h-8 w-8" /> },

  { name: 'Ícono de LevelUp', description: 'Completa 400 misiones', required: 400, icon: <Star className="h-8 w-8" /> },
  { name: 'Campeón del Pueblo', description: 'Completa 425 misiones', required: 425, icon: <Sparkles className="h-8 w-8" /> },
  { name: 'General Planetario', description: 'Completa 450 misiones', required: 450, icon: <Sun className="h-8 w-8" /> },
  { name: 'Héroe del Tiempo', description: 'Completa 475 misiones', required: 475, icon: <Flame className="h-8 w-8" /> },
  { name: 'Leyenda del Mundo Real', description: 'Completa 500 misiones', required: 500, icon: <Infinity className="h-8 w-8" /> },
];


const RewardPage = () => {
  const [userAwards, setUserAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/api/awards/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Asegurarse de que estamos usando la estructura correcta
      const awards = response.data.awards || response.data || [];
      setUserAwards(awards);
      
      // Si hay premios recién desbloqueados, mostrar notificación
      if (response.data.newlyUnlocked && response.data.newlyUnlocked.length > 0) {
        console.log('Nuevos premios desbloqueados:', response.data.newlyUnlocked);
      }
    } catch (e) {
      console.error('Error fetching awards:', e);
      setUserAwards([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#3a0ca3] to-[#f72585] flex">
      <Nav />
      <div className="flex-1 p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-cyan-300 mb-8 text-center">LOGROS</h1>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {MISSION_AWARDS.map((award, idx) => {
                // Buscar el premio en la lista del usuario
                const userAward = userAwards.find(a => a.Name === award.name);
                const unlocked = userAward && userAward.status == 'desbloqueado';
                return (
                  <div
                    key={award.name}
                    className={`relative flex flex-col items-center justify-center p-6 rounded-2xl shadow-xl border-2 transition-all duration-300 bg-white/10 backdrop-blur-md ${
                      unlocked
                        ? 'border-green-400/60 bg-gradient-to-br from-green-500/10 to-cyan-500/10'
                        : 'border-gray-500/30 grayscale opacity-60 bg-gradient-to-br from-gray-700/30 to-gray-900/30'
                    }`}
                  >
                    <div className="mb-3">
                      {award.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-center">
                      {award.name}
                    </h3>
                    <p className="text-sm text-center mb-3">
                      {award.description}
                    </p>
                    {unlocked ? (
                      <div className="flex items-center gap-1 text-green-400 font-semibold mt-2">
                        <CheckCircle className="h-5 w-5" /> Desbloqueado
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400 font-semibold mt-2">
                        <Lock className="h-5 w-5" /> Bloqueado
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardPage;