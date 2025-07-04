import {Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import MissionPage from './pages/MissionPage';
import RewardPage from './pages/RewardPage';
import ProfilePage from './pages/ProfilePage';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" replace />;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<PrivateRoute><HomePage/></PrivateRoute>} />
            <Route path="/mission" element={<PrivateRoute><MissionPage/></PrivateRoute>} />
            <Route path="/reward" element={<PrivateRoute><RewardPage/></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage/></PrivateRoute>} />
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    );
}
export default App;