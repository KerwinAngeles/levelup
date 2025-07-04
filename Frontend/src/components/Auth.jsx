import React, { useState } from "react";
import api from '../api';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { useContext } from "react";

const Auth = ({ type = 'login' }) => {
    const navigate = useNavigate();
    const { fetchUser } = useContext(UserContext);

    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        image: null,
        password: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const isRegister = type === 'register';

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: files ? files[0] : value
        }));
        setError('');
        setSuccess('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let response;

        if (!formData.username) {
            return Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'El nombre de usuario es obligatorio.',
                confirmButtonColor: '#6366f1',
            });
        }
        if (!formData.password) {
            return Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'La contraseña es obligatoria.',
                confirmButtonColor: '#6366f1',
            });
        }
        if (!formData.email && isRegister) {
            return Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'El correo electrónico es obligatorio.',
                confirmButtonColor: '#6366f1',
            });
        }
        if (!formData.firstname && isRegister) {
            return Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'El nombre es obligatorio.',
                confirmButtonColor: '#6366f1',
            });
        }
        if (!formData.lastname && isRegister) {
            return Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'El apellido es obligatorio.',
                confirmButtonColor: '#6366f1',
            });
        }
        if (!formData.image && isRegister) {
            return Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: 'La imagen de perfil es obligatoria.',
                confirmButtonColor: '#6366f1',
            });
        }

        try {
            const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

            if (isRegister) {
                const data = new FormData();
                data.append('firstname', formData.firstname);
                data.append('lastname', formData.lastname);
                data.append('username', formData.username);
                data.append('email', formData.email);
                data.append('password', formData.password);
                if (formData.image) {
                    data.append('image', formData.image);
                }

                response = await api.post(endpoint, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                const payload = {
                    username: formData.username,
                    password: formData.password
                };
                response = await api.post(endpoint, payload);
            }

            if (!isRegister && response.data.user) {
                localStorage.setItem('token', response.data.token);
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }
                Swal.fire({
                    icon: 'success',
                    title: '¡Inicio Exitoso!',
                    text: 'Ya puedes iniciar sesión.',
                    confirmButtonColor: '#6366f1',
                }).then(() => {
                    fetchUser();
                    navigate('/home');
                });
            }

            setSuccess(response.data.message || 'Operation successful');

            if (isRegister) {
                setTimeout(() => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Cuenta creada!',
                        text: 'Ya puedes iniciar sesión.',
                        confirmButtonColor: '#6366f1',
                    }).then(() => {
                        navigate('/');
                    });
                }, 1500);
            }
            setError('');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Algo salió mal';
            setError(errorMsg);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMsg,
                confirmButtonColor: '#e11d48',
            });
            setSuccess('');
        }
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#3a0ca3] to-[#f72585] px-2 sm:px-4">
            <div className="max-w-4xl max-sm:max-w-lg mx-auto p-6 mt-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border-2 border-white">

                <h2 className="text-center text-white font-bold text-2xl">{isRegister ? 'Create an account' : 'Log In'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid sm:grid-cols-2 gap-8 py-4">
                        {isRegister && (
                            <>
                                <div>
                                    <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        id="firstname"
                                        className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:border-white dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        id="lastname"
                                        className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:border-white dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:border-white dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Imagen
                                    </label>
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        accept="image/*"
                                        className="border border-white text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:border-white dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="text-white text-sm font-medium mb-2 block">Username</label>
                            <input
                                name="username"
                                type="text"
                                className="bg-white/20 w-full text-white text-sm px-4 py-3 rounded-md focus:bg-white/30 outline-blue-500 transition-all"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="text-white text-sm font-medium mb-2 block">Password</label>
                            <input
                                name="password"
                                type="password"
                                className="bg-white/20 w-full text-white text-sm px-4 py-3 rounded-md focus:bg-white/30 outline-blue-500 transition-all"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-500 text-sm">{success}</div>}

                    <button
                        type="submit"
                        className="w-full cursor-pointer text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        <span className="font-medium">
                            {isRegister ? 'Registrarse' : 'Entrar'}
                        </span>
                    </button>

                    <div className="text-sm font-light text-gray-500 dark:text-gray-400 text-center py-4">
                        {isRegister ? (
                            <div className="flex justify-center items-center gap-2">
                                <p className>¿Ya tienes cuenta?</p>
                                <a href="/" className="font-medium text-blue-600 hover:underline dark:text-white">
                                    Inicia sesión
                                </a>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center gap-2">
                                <p>¿No tienes una cuenta?</p>
                                <a href="/register" className="font-medium text-blue-600 hover:underline dark:text-white">
                                    Regístrate
                                </a>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Auth;