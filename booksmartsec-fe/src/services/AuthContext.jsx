
import { createContext, useState, useContext, useEffect } from "react";
import { userRegister, userLogin, userLogout } from "./api";

const AuthContext = createContext();

export function AuthProvider({children})
{
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try
            {
                const result = await Promise.race([
                    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                        credentials: 'include' // Send cookie automatically
                    }),
                    new Promise((_, reject) => 
                        setTimeout(() => reject (new Error("Unable to connect to server")), 5000)
                    )
                ]); 
                
                const data = await result.json();
                if (data.userId)
                {
                    setUser({userId: data.userId});
                    setIsAuthenticated(true);
                }
            }
            catch
            {
                setIsAuthenticated(false);
            }
            finally
            {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

        const register = async (email, username, password) => {
            const data = await userRegister(email, username, password);
            setUser({userId: data.userId}); 
            setIsAuthenticated(true); 
            return data;
        };

    const login = async (email, password) => {
        // Call the API
        const data = await userLogin(email, password);
        setUser({userId: data.userId});
        setIsAuthenticated(true); 
    };

    const logout = async () => {
        await userLogout()
        setUser(null);
        setIsAuthenticated(false);
    }

    // Export everything into global React space
    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, register, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
}

/* Custom hook (provides easier access) */
export function useAuth()
{
    return useContext(AuthContext);
}