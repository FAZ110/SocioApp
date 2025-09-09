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
                <Link to='/'>
                    <p><span>S</span>ocio<span>A</span>pp</p>
                </Link>
            </div>

            <div className="nav-items">
                {isLoggedIn ? (
                    <>
                        <Link to="/feed">Home</Link>
                        <Link to="/profile">Profile</Link>
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
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