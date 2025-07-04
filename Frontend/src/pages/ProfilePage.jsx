import Nav from '../components/Nav'
import { useEffect, useState } from 'react'
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

import api from '../api';
import {
  User,
  Edit3,
  Save,
  Camera,
  Award,
  Star,
  Zap
} from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [previewImage, setPreviewImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [countAwards, setCountAwards] = useState(0);

  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const fetchAwardCount = async () => {
      try {
        const token = localStorage.getItem('token'); // Asegúrate de tener el token guardado
        const response = await api.get('/api/awards/allCount', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCountAwards(response.data.totalCount);
        console.log('Total Awards Count:', response.data.totalCount);
      } catch (error) {
        console.error('Error fetching award count:', error);
      }
    };

    fetchAwardCount();
  }, []);

  const handleSave = async () => {
    if (!userData.firstname) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El nombre es obligatorio.',
        confirmButtonColor: '#6366f1',
      });
    }
    if (!userData.lastname) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El apellido es obligatorio.',
        confirmButtonColor: '#6366f1',
      });
    }
    if (!userData.username) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El nombre de usuario es obligatorio.',
        confirmButtonColor: '#6366f1',
      });
    }


    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('firstname', userData.firstname);
      formData.append('lastname', userData.lastname);
      formData.append('username', userData.username);
      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }
      const response = await api.put('api/profile/updateProfile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const updateUser = response.data.user;
      setUser(updateUser);
      setIsEditing(false);
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Algo salió mal';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
        confirmButtonColor: '#e11d48',
      });
      console.error('Error updating profile:', error);
    }
  }

  console.log('User Data:', userData);
  if (!userData) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#3a0ca3] to-[#f72585] flex items-center justify-center">
      <div className="text-white text-xl">Cargando perfil...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#3a0ca3] to-[#f72585] flex">
      <Nav />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 md:p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {/* Header with edit button */}
            <div className='w-full flex justify-end mb-8'>
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              )}
            </div>

            {/* Profile Image Section */}
            <div className="flex flex-col justify-center items-center mb-8">
              <div className="relative group">
                <div className="w-48 h-48 rounded-full p-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 shadow-2xl">
                  <img
                    alt="Foto de perfil"
                    src={previewImage || `http://localhost:5000/uploads/${userData.profileImage}`}
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>

                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <label className="cursor-pointer">
                      <div className="w-48 h-48 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setSelectedImage(file);
                            setPreviewImage(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* User Info Section */}
            <div className="text-center mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={userData.firstname}
                    disabled={!isEditing}
                    onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    placeholder="Nombre"
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={userData.lastname}
                    disabled={!isEditing}
                    onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div className="relative max-w-md mx-auto">
                <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                  <User className="h-5 w-5 text-purple-300" />
                  <input
                    type="text"
                    className="flex-1 bg-transparent text-white placeholder-white/60 focus:outline-none disabled:opacity-50"
                    value={userData.username}
                    disabled={!isEditing}
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    placeholder="Username"
                  />
                </div>
              </div>
              
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <Zap className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{userData.level}</div>
                <div className="text-purple-200 text-sm font-medium">Level</div>
              </div>

              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <Star className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{userData.xp}</div>
                <div className="text-pink-200 text-sm font-medium">Total Points</div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <Award className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{countAwards}</div>
                <div className="text-blue-200 text-sm font-medium">Rewards</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage