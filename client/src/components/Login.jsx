import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import '../styles/login.css'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth(); // Get login function from context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await API.post('/auth/login', formData);
            
            // Use the context login function instead of managing localStorage directly
            login(response.data.data.user, response.data.data.token);
            
            // Redirect to feed
            window.location.href = '/feed';
            
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                />
                <button type="submit" disabled={isLoading} className='login-btn'>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default Login;