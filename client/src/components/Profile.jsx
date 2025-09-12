import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import "../styles/profile.css"; 
import Post from "./Post";

function Profile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user: currentUser, isLoggedIn } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [profileData, setProfileData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const isOwnProfile = currentUser && username === currentUser.username;
    
    useEffect(() => {
        // Only fetch if username is available
        if (username) {
        fetchProfile();
        } else {
        setError("Username is missing");
        setIsLoading(false);
        }
    }, [username, currentUser]); // Added currentUser to dependencies

    const fetchProfile = async () => {
        try {
        setIsLoading(true);
        setError("");
        
        console.log("Fetching profile for username:", username); // Debug log
        
        // Fetch user profile
        const userResponse = await API.get(`/users/${username}`);
        console.log('API response: ', userResponse);
        
        setProfileData(userResponse.data.data);

        // Check if current user is following this profile
        if (currentUser && currentUser._id) {
            const followingStatus = userResponse.data.data.followers.some(
            follower => follower._id === currentUser._id
            );
            setIsFollowing(followingStatus);
        }

        // Fetch user's posts
        const postsResponse = await API.get(`/posts/user/${username}`);
        setUserPosts(postsResponse.data.data || []);
        } catch (error) {
        console.error('Profile fetch error:', error);
        if (error.response?.status === 404) {
            setError("User not found");
        } else {
            setError(error.response?.data?.message || 'Failed to load profile');
        }
        } finally {
        setIsLoading(false);
        }
    };

    const handleFollowAction = async () => {
        if (!isLoggedIn) {
        navigate('/login');
        return;
        }

        try {
        setActionLoading(true);
        const endpoint = isFollowing ? "unfollow" : "follow";
        await API.post(`/users/${username}/${endpoint}`);

        // Update the follow status immediately for better UX
        setIsFollowing(!isFollowing);
        
        // Refetch profile to get updated follower counts
        const userResponse = await API.get(`/users/${username}`);
        setProfileData(userResponse.data.data);
        } catch (error) {
        console.error('Follow action error: ', error);
        alert(error.response?.data?.message || "Action failed. Please try again.");
        } finally {
        setActionLoading(false);
        }
    };

    if (isLoading) {
        return <div className="loading-state">Loading profile...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!profileData) {
        return <div className="error">User not found</div>;
    }

    return (
        <div className="profile-container">
        <div className="profile-header">
            <h1>@{profileData.username}'s Profile</h1>
            
            {!isOwnProfile && isLoggedIn && (
            <button 
                onClick={handleFollowAction} 
                disabled={actionLoading}
                className={`follow-btn ${isFollowing ? "following" : "not-following"}`}
            >
                {actionLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
            </button>
            )}
        </div>

        <div className="profile-info">
            <p className="profile-bio">{profileData.bio || "No bio provided"}</p>
            
            <div className="profile-stats">
            <div className="stat">
                <span className="stat-number">{profileData.followers ? profileData.followers.length : 0}</span>
                <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
                <span className="stat-number">{profileData.following ? profileData.following.length : 0}</span>
                <span className="stat-label">Following</span>
            </div>
            <div className="stat">
                <span className="stat-number">{userPosts.length}</span>
                <span className="stat-label">Posts</span>
            </div>
            </div>
        </div>

        <div className="profile-posts">
            <h2>Posts</h2>
            {userPosts.length === 0 ? (
            <p className="no-posts">No posts yet</p>
            ) : (
            <div className="posts-grid">
                {userPosts.map(post => <Post key= {post._id} post= {post}/>
    
                )}
            </div>
            )}
        </div>
        </div>
    );
    }

    export default Profile;