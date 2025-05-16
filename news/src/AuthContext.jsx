import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token') || null,
        userId: localStorage.getItem('userId') || null,
        isAuthenticated: false
    });

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_CURRENT_USER_ROUTE, {
                    headers: { Authorization: `Token ${authState.token}` }
                });
                setAuthState(prev => ({
                    ...prev,
                    userId: response.data.id,
                    isAuthenticated: true
                }));
            } catch (error) {
                logout();
            }
        };

        if (authState.token) verifyToken();
    }, [authState.token]);

    const login = async (newToken) => {
        localStorage.setItem('token', newToken);
        try {
            const response = await axios.get(import.meta.env.VITE_CURRENT_USER_ROUTE, {
                headers: { Authorization: `Token ${newToken}` }
            });
            
            setAuthState({
                token: newToken,
                userId: response.data.id,
                isAuthenticated: true
            });
            localStorage.setItem('userId', response.data.id);
        } catch (error) {
            console.error('Login error:', error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setAuthState({
            token: null,
            userId: null,
            isAuthenticated: false
        });
    };

    return (
        <AuthContext.Provider value={{
            token: authState.token,
            userId: authState.userId,
            isAuthenticated: authState.isAuthenticated,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};