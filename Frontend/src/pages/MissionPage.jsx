import React, { useState } from 'react'
import Nav from '../components/Nav'
import MissionForm from '../components/MissionForm'
import MissionList from '../components/MissionList'
import { Plus, Target, Zap, Trophy } from 'lucide-react'

const MissionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMissionSuccess = () => {
    // Trigger refresh of mission list
    setRefreshTrigger(prev => prev + 1);
    console.log('Mission created/updated successfully');
  };

  const handleEditMission = (mission) => {
    setEditingMission(mission);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMission(null);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#3a0ca3] to-[#f72585] flex'>
      <Nav />
      <div className="flex-1 p-4 md:p-8 text-white">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                Misión Central
              </h1>
            </div>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Define tus objetivos, establece metas y conquista nuevos niveles. 
              Cada misión te acerca más a tu mejor versión.
            </p>
          </div>

          {/* Create Mission Button */}
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25 flex items-center gap-3"
            >
              <div className="relative">
                <Plus className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
              </div>
              Crear Nueva Misión
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Mission List */}
          <MissionList 
            key={refreshTrigger}
            onMissionUpdate={handleMissionSuccess}
            onMissionDelete={handleMissionSuccess}
            onEditMission={handleEditMission}
          />
        </div>
      </div>

      {/* Mission Form Modal */}
      <MissionForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleMissionSuccess}
        missionToEdit={editingMission}
      />
    </div>
  )
}

export default MissionPage