import { createContext, useState, useEffect } from "react";
import api from "../api";
export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if(!token) return;
        try{
            const response = await api.get('/api/profile/getProfile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(response.data);
        }catch(error){
            console.error('Error fetching user:', error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{user, setUser, fetchUser}}>
            {children}
        </UserContext.Provider>
    );
}