import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token')
            if(token){
                setUser({token})
            }
        } catch (error) {
            console.error('Auth check failed: ', error)
            logout()
            
        }finally{
            setIsLoading(false)
        }
    }

    const login = (userData, token) => {
        localStorage.setItem('token', token)
        setUser({...userData, token})
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null);
        window.location.href = '/login'
    }

    const value = {
        user,
        isLoading,
        login,
        logout,
        loggedIn : !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
