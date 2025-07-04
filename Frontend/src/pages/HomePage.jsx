import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext';
import Nav from '../components/Nav'
import { 
  Heart, 
  Zap, 
  Battery, 
  Sword, 
  Shield, 
  Eye, 
  Brain, 
  Sparkles, 
  Trophy, 
  Star, 
  Crown,
  Users,
  Target,
  Flame,
  TrendingUp,
  Activity,
  Timer,
  CheckCircle,
  XCircle,
  Award,
  Medal,
} from 'lucide-react';
import api from '../api';

const HomePage = () => {
  const {user} = useContext(UserContext);
  const [missionStats, setMissionStats] = useState({
    totalMissions: 0,
    completedMissions: 0,
    pendingMissions: 0,
    failedMissions: 0,
    totalXP: 0,
    statsByType: {}
  });
  const [recentAwards, setRecentAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMissionStats();
      fetchRecentAwards();
    }
  }, [user]);

  const fetchMissionStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('api/missions/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const missions = response.data;
      console.log('Raw missions data from API:', missions); // Debug log
      
      // Log each mission's statTarget field specifically
      missions.forEach((mission, index) => {
        console.log(`Mission ${index + 1}:`, {
          id: mission.id,
          title: mission.title,
          statTarget: mission.statTarget,
          statTargetType: typeof mission.statTarget,
          status: mission.status
        });
      });
      
      calculateStats(missions);
    } catch (error) {
      console.error('Error fetching mission stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAwards = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/awards/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const awards = response.data.awards || response.data || [];
      console.log('Raw awards data from API:', awards); // Debug log
      const unlockedAwards = awards
        .filter(award => award.status === 'desbloqueado')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);
      
      setRecentAwards(unlockedAwards);
    } catch (error) {
      console.error('Error fetching recent awards:', error);
      setRecentAwards([]);
    }
  };

  const calculateStats = (missions) => {
    console.log('Missions received:', missions); // Debug log
    
    const stats = {
      totalMissions: missions.length,
      completedMissions: missions.filter(m => m.status === 'completada').length,
      pendingMissions: missions.filter(m => m.status === 'pendiente').length,
      failedMissions: missions.filter(m => m.status === 'fallida').length,
      totalXP: missions.reduce((sum, m) => sum + (m.xp_reward || 0), 0),
      statsByType: {}
    };

    // Calculate stats by statTarget type
    const statTargets = ['Push_Ups', 'Sit_Ups', 'Pull_Ups', 'Plank', 'Squats', 'Running', 'Jogging'];
    
    statTargets.forEach(target => {
      const missionsOfType = missions.filter(m => m.statTarget === target);
      console.log(`Missions for ${target}:`, missionsOfType); // Debug log
      
      const completedOfType = missionsOfType.filter(m => m.status === 'completada');
      
      stats.statsByType[target] = {
        total: missionsOfType.length,
        completed: completedOfType.length,
        pending: missionsOfType.filter(m => m.status === 'pendiente').length,
        failed: missionsOfType.filter(m => m.status === 'fallida').length,
        xp: missionsOfType.reduce((sum, m) => sum + (m.xp_reward || 0), 0)
      };
    });

    console.log('Calculated stats:', stats); // Debug log
    setMissionStats(stats);
  };

  const getStatTargetIcon = (statTarget) => {
    switch (statTarget) {
      case 'Push_Ups':
        return '💪';
      case 'Sit_Ups':
        return '🏃';
      case 'Pull_Ups':
        return '💪';
      case 'Plank':
        return '🧘';
      case 'Squats':
        return '🦵';
      case 'Running':
        return '🏃';
      case 'Jogging':
        return '🏃';
      default:
        return '🎯';
    }
  };

  const getStatTargetColor = (statTarget) => {
    switch (statTarget) {
      case 'Push_Ups':
        return { color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' };
      case 'Sit_Ups':
        return { color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' };
      case 'Pull_Ups':
        return { color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' };
      case 'Plank':
        return { color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30' };
      case 'Squats':
        return { color: 'text-pink-400', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/30' };
      case 'Running':
        return { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' };
      case 'Jogging':
        return { color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/30' };
      default:
        return { color: 'text-gray-400', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-500/30' };
    }
  };

  const getStatTargetLabel = (statTarget) => {
    switch (statTarget) {
      case 'Push_Ups':
        return 'PUSH-UPS';
      case 'Sit_Ups':
        return 'SIT-UPS';
      case 'Pull_Ups':
        return 'PULL-UPS';
      case 'Plank':
        return 'PLANK';
      case 'Squats':
        return 'SQUATS';
      case 'Running':
        return 'RUNNING';
      case 'Jogging':
        return 'JOGGING';
      default:
        return statTarget;
    }
  };

  // Create stats array from mission data
  const stats = Object.entries(missionStats.statsByType)
    .filter(([_, data]) => data.total > 0) // Only show types with missions
    .map(([statTarget, data]) => {
      const colors = getStatTargetColor(statTarget);
      return {
        icon: Activity,
        label: getStatTargetLabel(statTarget),
        value: data.total,
        completed: data.completed,
        pending: data.pending,
        failed: data.failed,
        xp: data.xp,
        emoji: getStatTargetIcon(statTarget),
        ...colors
      };
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#3a0ca3] to-[#f72585] flex">
      <Nav />
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">
        {/* Header Profile Section */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-cyan-500/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  {user && user.profileImage ? (
                    <img
                      src={`http://localhost:5000/uploads/${user.profileImage}`}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-slate-800"></div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">{user ? user.firstname + ' ' + user.lastname : '...'}</h1>
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
                {user && (
                  <div className="text-white text-sm py-2">
                     <span className="bg-purple-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"> {user.username}</span>
                  </div>
                )}
              </div>
            </div>
            
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{user ? user.level : '...'}</div>
              <div className="text-xs sm:text-sm text-gray-400">NIVEL</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-400">
                {loading ? '...' : missionStats.totalMissions}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">MISIONES</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                {loading ? '...' : missionStats.completedMissions}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">COMPLETADAS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                {loading ? '...' : user.xp}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">XP TOTAL</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Mission Type Stats */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-cyan-500/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <h2 className="text-lg sm:text-xl font-bold text-cyan-300 mb-4 sm:mb-6 flex items-center gap-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                ESTADÍSTICAS POR TIPO DE EJERCICIO
              </h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-cyan-200">Cargando estadísticas...</p>
                  </div>
                </div>
              ) : stats.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-3 sm:p-4 hover:bg-opacity-30 transition-all duration-200`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-2xl">{stat.emoji}</span>
                          <span className={`font-bold ${stat.color} text-sm sm:text-base`}>{stat.label}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
                          <div className="text-xs sm:text-sm text-green-400">{stat.xp} XP</div>
                        </div>
                      </div>
                      
                      {/* Progress bars for each status */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-300">Completadas</span>
                          <span className="text-white">{stat.completed}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1">
                          <div 
                            className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                            style={{width: `${(stat.completed / stat.value) * 100}%`}}
                          ></div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-yellow-300">Pendientes</span>
                          <span className="text-white">{stat.pending}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1">
                          <div 
                            className="bg-yellow-500 h-1 rounded-full transition-all duration-300" 
                            style={{width: `${(stat.pending / stat.value) * 100}%`}}
                          ></div>
                        </div>
                        
                        {stat.failed > 0 && (
                          <>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-red-300">Fallidas</span>
                              <span className="text-white">{stat.failed}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-1">
                              <div 
                                className="bg-red-500 h-1 rounded-full transition-all duration-300" 
                                style={{width: `${(stat.failed / stat.value) * 100}%`}}
                              ></div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-16 w-16 text-cyan-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No hay misiones</h3>
                  <p className="text-cyan-200">
                    Crea tu primera misión para ver estadísticas aquí
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Recent Awards */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-purple-500/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <h3 className="text-base sm:text-lg font-bold text-purple-300 mb-3 sm:mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                ÚLTIMOS PREMIOS DESBLOQUEADOS
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {recentAwards.length > 0 ? (
                  recentAwards.map((award, index) => (
                    <div key={award.id || index} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-2 sm:p-3 hover:bg-purple-500/30 transition-all duration-200">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-yellow-300 text-sm sm:text-base">{award.Name}</div>
                          <div className="text-xs sm:text-sm text-gray-300 mb-1">{award.description}</div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-green-400">Desbloqueado</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Award className="h-8 w-8 text-purple-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Aún no has desbloqueado premios</p>
                    <p className="text-xs text-gray-500">¡Completa misiones para desbloquear logros!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mission Summary */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-cyan-500/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <h3 className="text-base sm:text-lg font-bold text-orange-300 mb-3 sm:mb-4 flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                RESUMEN DE MISIONES
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Completadas</span>
                  </div>
                  <span className="text-white font-bold">{missionStats.completedMissions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Pendientes</span>
                  </div>
                  <span className="text-white font-bold">{missionStats.pendingMissions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-gray-300">Fallidas</span>
                  </div>
                  <span className="text-white font-bold">{missionStats.failedMissions}</span>
                </div>
                <div className="border-t border-gray-600 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Tasa de éxito</span>
                    <span className="text-white font-bold">
                      {missionStats.totalMissions > 0 
                        ? `${Math.round((missionStats.completedMissions / missionStats.totalMissions) * 100)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;