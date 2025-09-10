import { useEffect, useState } from "react";
import API from "../api/api";
import '../styles/controls.css'

function Controls(){
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [users, setUsers] = useState([])


    useEffect(() => {
        fetchUsers()
    }, [])


    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const response = await API.get('/users/')
            console.log(response)
            setUsers(response.data.data)

            

            
        } catch (error) {
            console.error('Server error while fetching users: ', error)
            setError(error.response?.data?.message || 'Fetching failed')

        }finally{
            setIsLoading(false)
        }
    }

    const handleDeleteUser = async (username) => {
        if (!window.confirm(`Are you sure you want to delete user @${username}? This action cannot be undone.`)) {
            return;
        }

        try {
            await API.delete(`users/${username}`)

            setUsers(users.filter(user => user.username !== username))
            
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    if(isLoading){
        return <div className="loading">Loading users...</div>
    }

    if(error){
        return <div className="error">Error: {error}</div>
    }

    return(
        <div className="controls-container">
            <div className="header">
                <h2>Users List</h2>
                <div className="users-count">Total users: {users.length}</div>
            </div>
            <div className="users-list">
                {users.length === 0 ? (
                    <p className="no-users">No users found</p>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Admin Status</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td className="username">@{user.username}</td>
                                    <td className="email">{user.email}</td>
                                    <td className="admin-status">{user.isAdmin ? (<span className="admin-badge">Admin</span>) : (
                                        <span className="user-badge">User</span>
                                    )}</td>

                                    <td className="actions">
                                        {!user.isAdmin && (
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleDeleteUser(user.username)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        
                    </table>
                )}
                


            </div>
        </div>
        
    );
}

export default Controls