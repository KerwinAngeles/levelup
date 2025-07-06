import Swal from "sweetalert2";
export const showAlert = (xpNotification) => {
  const hasBonus = xpNotification.bonus > 0;
  const hasNewAwards = xpNotification.awards.length > 0;
  let awardsHtml = '';
  if (hasNewAwards) {
    awardsHtml = `
              <div class="mt-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <div class="text-2xl mb-2">🏆</div>
                <div class="font-bold text-white mb-1">¡Nuevos premios desbloqueados!</div>
                <div class="text-sm text-purple-100">
                  ${xpNotification.awards.join(', ')}
                </div>
              </div>
            `;
  }

  Swal.fire({
    title: '¡Misión completada!',
    html: `
              <div class="text-center">
                <div class="text-4xl mb-4">🎉</div>
                <p class="mb-2">¡Felicidades! Has completado tu misión.</p>
                ${xpNotification.hasNewRank ? `
              <div class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold text-lg mb-2">
                Rank-${xpNotification.rank} Desbloqueado
              </div>
            ` : ''}
                <div class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold text-lg mb-2">
                  +${xpNotification.xp} XP
                </div>
                ${hasBonus ? `
                  <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded text-sm mb-2">
                    +${xpNotification.base} base + ${xpNotification.bonus} bonus
                  </div>
                  <div class="text-xs text-green-300 mb-2">
                    ¡${xpNotification.consecutiveDays} días consecutivos! +${xpNotification.bonus} XP extra
                  </div>
                ` : ''}
                <p class="text-sm">Nivel ${xpNotification.level} • ${xpNotification.totalXP} XP total</p>
                ${awardsHtml}
              </div>
            `,
    icon: 'success',
    timer: hasNewAwards ? 6000 : 4000,
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