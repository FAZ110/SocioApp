import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import '../styles/navbar.css'

function Navbar(){
    const [loggedIn, setLoggedIn] = useState(false)
    console.log(loggedIn)

    useEffect(() => {
        const token = localStorage.getItem('token')
        setLoggedIn(!!token)
        console.log('Token exists?', !!token)
    },[])

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false)
        window.location.href ='/';
    }
    return(
        <div className="nav-container">
            <div id="logo">
                <Link to='/'>
                 <p><span>S</span>ocio<span>A</span>pp</p>
            
                </Link>
                
            </div>

            <div className="nav-items">

            {loggedIn ? (
                <>
                    <Link to="/feed">Home</Link>
                    <Link to="/profile">Profile</Link>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </>
            ): (
                <>
                <Link to='/login'>Login</Link>
                <Link to='/register'>Register</Link>
                </>
            )}
                
                
                
            </div>
        </div>

    );
}

export default Navbar