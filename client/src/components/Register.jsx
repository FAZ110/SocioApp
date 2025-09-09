import { useState } from "react";
import '../styles/register.css'
import API from "../api/api";
import { useNavigate } from "react-router-dom";


function Register(){

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordClone: '',
        bio: ''
    })

    const navigate = useNavigate();

    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
        // console.log(formData)
    }

    const correctData = () => {
        if (formData.password !== formData.passwordClone){
            alert('Passwords must match!!!')
            setIsLoading(false)
            return
        }
        if(!formData.username || !formData.email || !formData.password){
            alert('Fill all required fields')
            setIsLoading(false)
            return
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        correctData()

        const {passwordClone, ...registerData} = formData;

        try {
            const response = await API.post('/auth/register', registerData);

            console.log('Registration successful: ', response.data)
            navigate('/login')

            setFormData({
                username: '',
                email: '',
                password: '',
                passwordClone: '',
                bio: ''
            })
        } catch (error) {
            console.error('Registration error: ', error)
            setError(error.response?.data?.message || 'Registration failed, please try again')
            
            
        }finally{
            setIsLoading(false)
        }
    }

    return(
        <div className="register-container">
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input type="text" className="username-inp" placeholder="username" name="username" onChange={handleChange}/>
                    <input type="email" className="email-inp" placeholder="email" name="email" onChange={handleChange}/>
                    <input type="password" className="password-inp" placeholder="password" id="password" name="password" onChange={handleChange}/>
                    <input type="password" className="password-inp" placeholder="confirm password" id="again-password" name="passwordClone" onChange={handleChange}/>
                    <textarea name="bio" id="bio" cols="1" rows="1" placeholder="bio..." className="bio-inp" onChange={handleChange}></textarea>

                </div>
                <div className="buttons-container">
                    <button className="register-btn">Register</button>

                    <div className="reg-login-container">
                        <p className="user-message">Already have an account?</p>
                        <button className="login-button">Login</button>
                    </div>
                </div>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
}

export default Register