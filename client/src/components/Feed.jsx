import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import Post from './Post'

function Feed(){
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const {isLoggedIn} = useAuth();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await API.get('/posts')
            setPosts(response.data.data)
            
        } catch (error) {
            setError('Failed to load posts')
            console.error('Error fetching posts: ',error)
            
        }finally{
            setIsLoading(false)
        }
    }

    const handlePostUpdate = (updatedPost) => {
        setPosts(prevPosts => 
            prevPosts.map(post =>{
                post._id === updatedPost._id ? updatedPost : post 
            })
        )
    }

    if (isLoading) return <div className="feed-loading">Loading posts...</div>


    if (error) return <div className="feed-error">{error}</div>

    return(
        <div className="feed">
            {!isLoggedIn && (
                <div className="feed-warning">
                    Please log in to interact with posts!!
                </div>
            )}

            {posts.length === 0 ? (
                <div className="no-posts">
                    There are no posts yet
                </div>
            ):(
                <div className="posts-list">
                    {posts.map(post => (
                        <Post key={post._id}
                            post={post}
                            onUpdate={handlePostUpdate}/>
                        ))}
                </div>
            )
            
            }
        </div>
    );
}

export default Feed