# 🏆 LevelUp - Sistema de Misiones y Premios

## 📖 Descripción

**LevelUp** es una aplicación web gamificada diseñada para motivar y recompensar el cumplimiento de objetivos personales y de fitness. Los usuarios pueden crear misiones personalizadas, completarlas y desbloquear premios basados en su progreso y consistencia.

## ✨ Características Principales

### 🎯 Sistema de Misiones
- **Creación de misiones personalizadas** con diferentes tipos de ejercicios
- **Tipos de ejercicios disponibles**: Push-ups, Sit-ups, Pull-ups, Plank, Squats, Running, Jogging
- **Sistema de fechas límite** para mantener la motivación
- **Estados de misión**: Pendiente, Completada, Fallida
- **Sistema de XP** con bonificaciones por consistencia

### 🏆 Sistema de Premios
- **40 premios diferentes** desde "Recluta" hasta "Leyenda del Mundo Real"
- **Desbloqueo automático** basado en misiones completadas
- **Premios especiales** con condiciones únicas:
  - Completar misiones en períodos específicos
  - Misiones completadas antes de las 8am
  - Consistencia sin pausas largas

### 📊 Estadísticas y Progreso
- **Dashboard personalizado** con estadísticas detalladas
- **Progreso por tipo de ejercicio**
- **Sistema de niveles** (cada 100 XP = 1 nivel)
- **Últimos premios desbloqueados** en el home
- **Tasa de éxito** de misiones

### 🔐 Autenticación y Perfil
- **Registro e inicio de sesión** seguro
- **Perfil de usuario** con foto personalizada
- **Sistema de tokens JWT** para seguridad
- **Rutas protegidas** para usuarios autenticados

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos modernos
- **SweetAlert2** - Notificaciones elegantes
- **React Router** - Navegación entre páginas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para base de datos
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **Multer** - Manejo de archivos
- **bcryptjs** - Encriptación de contraseñas

### 1. Registro e Inicio de Sesión
- Crea una cuenta nueva o inicia sesión con credenciales existentes
- Completa tu perfil con foto personalizada

### 2. Crear Misiones
- Ve a la sección "Misiones"
- Crea misiones personalizadas seleccionando:
  - Título y descripción
  - Tipo de ejercicio
  - Fecha límite (opcional)

### 3. Completar Misiones
- Marca las misiones como completadas
- Gana XP y sube de nivel
- Desbloquea premios automáticamente

### 4. Ver Progreso
- Revisa tu dashboard en el home
- Consulta estadísticas por tipo de ejercicio
- Ve tus premios desbloqueados

### 5. Premios
- Explora todos los premios disponibles
- Los premios se desbloquean automáticamente
- Algunos requieren condiciones especiales

## 🏆 Sistema de Premios

### Premios Básicos (por cantidad de misiones)
- **Recluta**: 1 misión
- **Cadete Novato**: 3 misiones
- **Soldado en Práctica**: 5 misiones
- **Guardia en Formación**: 10 misiones
- **Sargento de Misión**: 20 misiones
- **General de Misiones**: 50 misiones
- **Leyenda del Mundo Real**: 500 misiones

### Premios Especiales
- **Soldado Activo**: 7 misiones en menos de 10 días
- **Teniente**: 25 misiones en 20 días
- **Águila del Amanecer**: 110 misiones antes de las 8am

## 📊 Sistema de XP

### XP por Tipo de Ejercicio
- **Push-ups**: 25 XP
- **Sit-ups**: 20 XP
- **Pull-ups**: 30 XP
- **Plank**: 15 XP
- **Squats**: 18 XP
- **Running**: 35 XP
- **Jogging**: 22 XP

### Bonificaciones
- **Consistencia**: +10% XP por día consecutivo (máximo 50%)
- **Niveles**: Cada 100 XP = 1 nivel


## 📁 Estructura del Proyecto

```
LevelUp/
├── Backend/
│   ├── config/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Models/
│   ├── Routes/
│   ├── uploads/
│   └── scripts/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── assets/
│   └── public/
└── README.md
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**LevelUp Team**
- Desarrollado con ❤️ para motivar el fitness y la productividad

## 🙏 Agradecimientos

- Iconos proporcionados por [Lucide](https://lucide.dev/)
- Notificaciones con [SweetAlert2](https://sweetalert2.github.io/)
- Estilos con [Tailwind CSS](https://tailwindcss.com/)

---

**¡Únete a LevelUp y transforma tus objetivos en logros! 🚀** 