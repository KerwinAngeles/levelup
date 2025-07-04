import React from 'react';
import ReactDOM from 'react-dom/client'; // 👈 SIN llaves
import { UserProvider } from './context/userContext'; // Importa el UserProvider
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
