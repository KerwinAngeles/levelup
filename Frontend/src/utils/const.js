export const getStatTargetColor = (statTarget) => {
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

export const getStatTargetIcon = (statTarget) => {
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


export const getStatTargetLabel = (statTarget) => {
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


export const getStatusColor = (status) => {
    switch (status) {
        case 'completada':
            return 'bg-gradient-to-r from-green-500 to-emerald-500 text-green-100 border-green-500/30';
        case 'fallida':
            return 'bg-gradient-to-r from-red-500 to-pink-500 text-red-100 border-red-500/30';
        case 'pendiente':
        default:
            return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-yellow-100 border-yellow-500/30';
    }
};

export const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha límite';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
        return 'Vencida';
    } else if (diffDays === 0) {
        return 'Vence hoy';
    } else if (diffDays === 1) {
        return 'Vence mañana';
    } else {
        return `${diffDays} días restantes`;
    }
};

export const getDaysRemaining = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};


export const typeColors = {
    Push_Ups: 'from-pink-500 to-red-500',
    Sit_Ups: 'from-blue-500 to-cyan-500',
    Pull_Ups: 'from-green-500 to-emerald-500',
    Plank: 'from-purple-500 to-fuchsia-500',
    Squats: 'from-yellow-500 to-orange-500',
    Running: 'from-cyan-500 to-blue-500',
    Jogging: 'from-emerald-500 to-lime-500',
};


export const typeEmojis = {
    Push_Ups: '💪',
    Sit_Ups: '🧘',
    Pull_Ups: '🏋️',
    Plank: '🧘‍♂️',
    Squats: '🦵',
    Running: '🏃‍♂️',
    Jogging: '🏃',
};