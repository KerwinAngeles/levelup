import React from "react";
import { useState, useEffect } from "react";
import { X, Target, Calendar, Zap, Award, Plus, Edit3 } from "lucide-react";
import api from "../api";
import Swal from 'sweetalert2';


const initialForm = {
    title: '',
    description: '',
    statTarget: 'Push_Ups',
    dueDate: '',
}

const MissionForm = ({ missionToEdit, onSuccess, isOpen, onClose }) => {
    const [form, setForm] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (missionToEdit) setForm(missionToEdit);
        else setForm(initialForm);
    }, [missionToEdit]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title) {
            return Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'El titulo es obligatorio.',
                confirmButtonColor: '#6366f1',
            });
        }

        if (!form.description) {
            return Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'La description es obligatorio.',
                confirmButtonColor: '#6366f1',
            });
        }

        if (!form.dueDate) {
            return Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'La fecha es obligatorio.',
                confirmButtonColor: '#6366f1',
            });
        }

        setIsSubmitting(true);

        try {
            if (missionToEdit) {
                await api.put(`api/missions/edit/${missionToEdit.id}`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Success notification
                showNotification('¡Misión actualizada!', 'La misión fue editada correctamente.', 'success');
            } else {
                await api.post('api/missions/create', form, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Success notification
                showNotification('¡Misión creada!', 'Ya puedes comenzar con esta misión.', 'success');
            }

            onSuccess();
            setForm(initialForm);
            onClose();
        } catch (e) {
            showNotification('Error', 'Hubo un problema al guardar la misión.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const showNotification = (title, message, type) => {
        // Simple notification - you can replace with SweetAlert or any other library
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`;
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="font-semibold">${title}</span>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 rounded-3xl shadow-2xl border border-white/10 overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4">
                {/* Header */}
                <div className="relative p-6 border-b border-white/10">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                {missionToEdit ? (
                                    <Edit3 className="h-6 w-6 text-white" />
                                ) : (
                                    <Plus className="h-6 w-6 text-white" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {missionToEdit ? 'Editar Misión' : 'Crear Nueva Misión'}
                                </h2>
                                <p className="text-purple-200 text-sm">
                                    {missionToEdit ? 'Modifica los detalles de tu misión' : 'Define tu próxima aventura'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Mission Title */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-white font-medium">
                            <Target className="h-4 w-4 text-purple-300" />
                            Título de la Misión
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Ej: Completar 50 push-ups diarios"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-white font-medium">
                            <Award className="h-4 w-4 text-purple-300 " />
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            placeholder="Describe tu misión y objetivos..."
                            value={form.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                        />
                    </div>

                    {/* Stats and XP Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Stat Target */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-white font-medium">
                                <Target className="h-4 w-4 text-purple-300" />
                                Tipo de Ejercicio
                            </label>
                            <select
                                name="statTarget"
                                value={form.statTarget}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            >
                                <option className="text-black" value="Push_Ups">Push Ups</option>
                                <option className="text-black" value="Running">Running</option>
                                <option className="text-black" value="Sit_Ups">Sit Ups</option>
                                <option className="text-black" value="Plank">Plank</option>
                                <option className="text-black" value="Squats">Squats</option>
                                <option className="text-black" value="Jogging">Jogging</option>
                                <option className="text-black" value="Pull_Ups">Pull Ups</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-white font-medium">
                                <Calendar className="h-4 w-4 text-purple-300" />
                                Fecha Límite
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    {missionToEdit ? 'Actualizar' : 'Crear'} Misión
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MissionForm;