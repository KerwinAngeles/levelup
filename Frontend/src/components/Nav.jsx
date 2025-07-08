import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import SweetAlert from 'sweetalert2';
import Swal from 'sweetalert2';
import {
  User,
  Target,
  Sword,
  Gift,
  ChevronRight,
  Circle,
} from 'lucide-react';

const Nav = () => {
  const navigate = useNavigate();
  const {user} = useContext(UserContext);

  const handleLogout = () => {
   Swal.fire({
    title: '¿Estás seguro?',
    text: "Tu sesión se cerrará",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('token');
      navigate('/');
    }
  });
  };
  const menuItems = [
    { icon: Target, label: 'HOME', route: '/home', active: false },
    { icon: Sword, label: 'MISSIONS', route: '/mission', active: false },
    { icon: Gift, label: 'REWARDS', route: '/reward', active: false },
    { icon: User, label: 'PROFILE', route: '/profile', active: false },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-cyan-400 p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/5 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-cyan-300 tracking-wider mb-2">
            LEVEL UP
          </h1>
          <div className="border-b border-cyan-600/30 mb-4"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-cyan-200 font-medium">Nivel {user ? user.level : '...'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 fill-green-400 text-green-400" />
            <span className="text-green-400 text-sm font-medium">ONLINE</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-3 mb-8">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className="w-full cursor-pointer flex items-center gap-3 p-3 rounded-lg hover:bg-cyan-500/10 transition-all duration-200 group"
            >
              <item.icon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200" />
              <span className="font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200">
                {item.label}
              </span>
            </button>
          ))}

        </nav>
        {/* Logout Button */}
        <button
          className="w-full cursor-pointer bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/30 rounded-lg p-3 flex items-center justify-between hover:from-red-600/30 hover:to-red-700/30 transition-all duration-200 group"
          onClick={() => {
            handleLogout();
          }}
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-red-400" />
            <span className="font-medium text-red-300">SALIR</span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
        {/* Bottom Status */}

      </div>

      {/* Additional Glow Effects */}
      <div className="absolute top-20 left-4 w-32 h-32 bg-cyan-500/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 right-4 w-24 h-24 bg-cyan-500/5 rounded-full blur-lg"></div>
    </div>
  );
};

export default Nav;