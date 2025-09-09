import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await API.post('/auth/login', formData);
            
            // Use the context login function instead of managing localStorage directly
            login(response.data.data.user, response.data.data.token);
            
            navigate('/feed')
            
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) =>{
        setFormData({
            ...formData,[e.target.name]: e.target.value
        })
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id='email'
                    name='email'
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='login-inp'
                />
                <input
                    type="password"
                    id='password'
                    name='password'
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='login-inp'
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