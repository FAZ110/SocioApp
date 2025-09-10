import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // console.log('AuthContext mounting')
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token')
            // console.log('Token found in local storage:', !!token)
            if(token){
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    _id: decodedToken.userId,
                    token: token
                    // Add other properties if they're in the token
                });
            }
        } catch (error) {
            // console.error('Auth check failed: ', error)
            // console.log('Auth check complete, isLoading set to false')
            logout()
            
        }finally{
            setIsLoading(false)
        }
    }

    const login = (userData, token) => {
        localStorage.setItem('token', token)
        setUser({
            _id: userData._id,
            username: userData.username,
            email: userData.email,
            bio: userData.bio,
            isAdmin: userData.isAdmin,
            token: token
        });
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
        isLoggedIn : !!user
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
