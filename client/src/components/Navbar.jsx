import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import '../styles/navbar.css'

function Navbar(){
    const auth = useAuth();
    // console.log('Full auth object: ', auth)
    const {isLoggedIn, logout, isLoading, user} = useAuth()

    // console.log('Navbar rendering - isLoggedIn:', isLoggedIn, 'isLoading:', isLoading, 'user', user);
    if (isLoading) {
        return (
            <div className="nav-container">
                <div id="logo">
                    <Link to='/'>
                        <p><span>S</span>ocio<span>A</span>pp</p>
                    </Link>
                </div>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="nav-container">
            <div id="logo">
                <Link to='/' className="logo">
                    <p><span>S</span>ocio<span>A</span>pp</p>
                </Link>
            </div>

            <div className="nav-items">
                {isLoggedIn ? (
                    <>
                        <Link to="/feed" className="links">Home</Link>
                        <Link to={`/profile/${user.username}`} className="links">Profile</Link>
                        {user.isAdmin ? (<Link to="/controls" className="links">Controls</Link>) : null}
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to='/login'className="links">Login</Link>
                        <Link to='/register'className="links">Register</Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar