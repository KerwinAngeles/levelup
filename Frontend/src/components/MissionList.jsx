import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Calendar,
  Zap,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { typeColors, typeEmojis, getStatusColor, getDaysRemaining, formatDate } from '../utils/const';


const MissionList = ({ onMissionUpdate, onMissionDelete, onEditMission }) => {
  const navigate = useNavigate();
  const { user, fetchUser, setXpNotification } = useContext(UserContext);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('api/missions/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMissions(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las misiones');
      console.error('Error fetching missions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (missionId, newStatus) => {
    const mission = missions.find(m => m.id === missionId);
    const statusText = newStatus === 'completada' ? 'completar' : 'marcar como fallida';
    const result = await Swal.fire({
      title: `¿${newStatus === 'completada' ? 'Completar' : 'Marcar como fallida'} misión?`,
      text: `¿Estás seguro de que quieres ${statusText} "${mission?.title}"?`,
      icon: newStatus === 'completada' ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'completada' ? '#10b981' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: newStatus === 'completada' ? 'Sí, completar' : 'Sí, marcar como fallida',
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'bg-gray-800 border border-gray-700',
        title: 'text-white',
        htmlContainer: 'text-gray-300',
        confirmButton: newStatus === 'completada' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600',
        cancelButton: 'bg-gray-500 hover:bg-gray-600'
      }
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await api.put(`api/missions/edit/${missionId}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const prevRank = user?.rank?.name;
        const newRank = response.data.newUserRank;
        const hasNewRank = prevRank !== newRank;
        console.log(response)
        if (response.status === 200) {
          setMissions(prevMissions =>
            prevMissions.map(mission =>
              mission.id === missionId
                ? { ...mission, status: newStatus }
                : mission
            )
          );
        }

        if (onMissionUpdate) onMissionUpdate();
        if (newStatus === 'completada') {
          await fetchUser();
        }

        if (newStatus === 'completada' && response.data.xpGained) {
          setXpNotification({
            xp: response.data.xpGained,
            base: response.data.baseXP,
            bonus: response.data.bonusXP,
            level: response.data.newUserLevel,
            totalXP: response.data.newUserXP,
            rank: newRank,
            awards: response.data.newlyUnlockedAwards || [],
            consecutiveDays: response.data.consecutiveDays,
            hasNewRank
          });
          await fetchUser();
          navigate('/home');
        }

        if (newStatus === 'completada' && response.data.xpGained) {
          const hasBonus = response.data.bonusXP > 0;
          const hasNewAwards = response.data.newlyUnlockedAwards && response.data.newlyUnlockedAwards.length > 0;

          let awardsHtml = '';
          if (hasNewAwards) {
            awardsHtml = `
              <div class="mt-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <div class="text-2xl mb-2">🏆</div>
                <div class="font-bold text-white mb-1">¡Nuevos premios desbloqueados!</div>
                <div class="text-sm text-purple-100">
                  ${response.data.newlyUnlockedAwards.join(', ')}
                </div>
              </div>
            `;
          }
        } else {
          Swal.fire({
            title: newStatus === 'completada' ? '¡Misión completada!' : 'Misión marcada como fallida',
            text: newStatus === 'completada'
              ? '¡Felicidades! Has completado tu misión.'
              : 'La misión ha sido marcada como fallida.',
            icon: newStatus === 'completada' ? 'success' : 'info',
            timer: 2000,
            showConfirmButton: false,
            background: '#1f2937',
            color: '#ffffff',
            customClass: {
              popup: 'bg-gray-800 border border-gray-700',
              title: 'text-white',
              htmlContainer: 'text-gray-300'
            }
          });
        }
      } catch (err) {
        console.error('Error updating mission status:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el estado de la misión. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#1f2937',
          color: '#ffffff',
          customClass: {
            popup: 'bg-gray-800 border border-gray-700',
            title: 'text-white',
            htmlContainer: 'text-gray-300'
          }
        });
      }
    }
  };

  const handleDelete = async (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    const result = await Swal.fire({
      title: '¿Eliminar misión?',
      text: `¿Estás seguro de que quieres eliminar "${mission?.title}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'bg-gray-800 border border-gray-700',
        title: 'text-white',
        htmlContainer: 'text-gray-300',
        confirmButton: 'bg-red-500 hover:bg-red-600',
        cancelButton: 'bg-gray-500 hover:bg-gray-600'
      }
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`api/missions/delete/${missionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMissions(prevMissions => prevMissions.filter(mission => mission.id !== missionId));
        if (onMissionDelete) onMissionDelete();
        Swal.fire({
          title: '¡Misión eliminada!',
          text: 'La misión ha sido eliminada correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#ffffff',
          customClass: {
            popup: 'bg-gray-800 border border-gray-700',
            title: 'text-white',
            htmlContainer: 'text-gray-300'
          }
        });
      } catch (err) {
        console.error('Error deleting mission:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la misión. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#1f2937',
          color: '#ffffff',
          customClass: {
            popup: 'bg-gray-800 border border-gray-700',
            title: 'text-white',
            htmlContainer: 'text-gray-300'
          }
        });
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completada':
        return <CheckCircle className="h-4 w-4" />;
      case 'fallida':
        return <XCircle className="h-4 w-4" />;
      case 'pendiente':
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  const getStatTargetIcon = (statTarget) => typeEmojis[statTarget] || '🎯';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-purple-200">Cargando misiones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300">{error}</p>
          <button
            onClick={fetchMissions}
            className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
          <Target className="h-16 w-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No hay misiones</h3>
          <p className="text-purple-200 mb-6">
            Crea tu primera misión para comenzar tu aventura de fitness
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {missions.map((mission) => {
          const daysRemaining = getDaysRemaining(mission.dueDate);
          const isOverdue = daysRemaining !== null && daysRemaining < 0;
          const typeColor = typeColors[mission.statTarget] || 'from-gray-700 to-gray-900';
          return (
            <div
              key={mission.id}
              className={`relative group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isOverdue ? 'border-red-500/50' : ''}`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 z-0 bg-gradient-to-br ${typeColor} opacity-30 group-hover:opacity-50 transition-all duration-300 rounded-3xl`}></div>
              {/* Top bar status */}
              <div className={`absolute top-0 left-0 w-full h-2 rounded-t-3xl ${mission.status === 'completada'
                ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                : mission.status === 'fallida'
                  ? 'bg-gradient-to-r from-red-400 to-pink-400'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-400'
                }`}></div>
              {/* Overdue pulse */}
              {isOverdue && (
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}
              {/* Header */}
              <div className="flex items-center gap-4 mb-4 z-10 relative">
                <div className="text-4xl drop-shadow-lg">
                  {getStatTargetIcon(mission.statTarget)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                    {mission.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-semibold">
                      {mission.statTarget.replace('_', ' ')}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(mission.status)} flex items-center gap-1`}>
                      {getStatusIcon(mission.status)}
                      <span className="capitalize">{mission.status}</span>
                    </span>
                  </div>
                </div>
              </div>
              {/* Description */}
              <p className="text-purple-100 text-sm mb-4 line-clamp-3 z-10 relative">
                {mission.description}
              </p>
              {/* Stats Row */}
              <div className="flex items-center justify-between mb-4 z-10 relative">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span className="text-base font-bold text-yellow-200">{mission.xp_reward} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-300" />
                  <span className={`text-xs ${isOverdue ? 'text-red-300' : 'text-purple-200'}`}>{formatDate(mission.dueDate)}</span>
                </div>
              </div>
              {/* Progress bar for pending */}
              {mission.status === 'pendiente' && (
                <div className="mb-4 z-10 relative">
                  <div className="flex justify-between text-xs text-purple-200 mb-1">
                    <span>Progreso</span>
                    <span>0%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-0 transition-all duration-300"></div>
                  </div>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2 mt-2 z-10 relative w-full flex-wrap">
                {mission.status === 'pendiente' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(mission.id, 'completada')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm text-sm font-medium transition-all duration-150"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Completar</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(mission.id, 'fallida')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm text-sm font-medium transition-all duration-150"
                    >
                      <XCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Fallar</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => onEditMission && onEditMission(mission)}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-sm transition-all duration-150"
                  title="Editar"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(mission.id)}
                  className="p-2 bg-gray-400 hover:bg-red-500 text-white rounded-full shadow-sm transition-all duration-150"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MissionList;
