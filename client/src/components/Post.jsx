import { useState } from "react"
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import '../styles/post.css'
import { Link } from "react-router-dom";
import CommentSection from "./CommentSection";

function Post({post, onUpdate}){
    const {user, isLoggedIn} = useAuth()
    const [isLiking, setIsLiking] = useState(false)
    const [showComments, setShowComments] = useState(false)

    if (!post) {
        return <div className="post">Post not available</div>;
    }

    


    const isPostLiked = post.likes.some(like => like._id ===user?.id) || false
    const likeCount = post.likes.length || 0;
    const authorUsername = post.author?.username || 'Unknown user';

    const handleLike = async () => {
        if(!isLoggedIn){
            alert('Please log in to like the post')
            return
        }
        setIsLiking(true)

        try {
            const response = await API.post(`/posts/${post._id}/toggleLike`)

            if (onUpdate){
                onUpdate(response.data.data)
            }
            
        } catch (error) {
            console.error('Error liking post: ', error)
            alert('Failed to like post')
            
        }finally{
            setIsLiking(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const toggleComments = () => {
        setShowComments(!showComments)
    }

    const closeComments = () => {
        setShowComments(false)
    }
    

    return (
        <div className="post-container">
            <div className="post">
                
                <div className="info">
                <span className="author-username">
                    <Link to={`profile/${authorUsername}`}>@{authorUsername}</Link>
                    </span>
                <span className="post-date">{formatDate(post.createdAt)}</span>
            </div>
            <div className="content">
                <div className="text">
                    <p>{post.content}</p>
                    {post.image && (<img src={post.image} className="post-image"></img>)}
                </div>
            </div>

            <div className="feedback">
                <button onClick={handleLike} disabled={isLiking} className={`like-btn ${isPostLiked ? 'liked' : ''}`}>
                    {isLiking ? '...' : isPostLiked ? '❤️' : '🤍'}
                    {likeCount > 0 && <span className="like-count">{likeCount}</span>}
                </button>
                <button className="comment-btn" onClick={toggleComments}>Comment</button>

                {showComments && <CommentSection post={post} onClose={closeComments}/>}
            </div>

            </div>
            

        </div>
    );
}

export default Post