import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import '../styles/commentsection.css'



function CommentSection({post, onClose}){

    const { user: currentUser, isLoggedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [comments, setComments] = useState([])
    const [text, setText] = useState('')
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        if(post, post._id){
            fetchComments()
        }
        
    }, [post?._id])

    const handleInput = (e) => {
        setText( t => e.target.value)
        setError('')
    }

    const fetchComments = async () => {
        try {
            setIsLoading(true)
            const response = await API.get(`/posts/${post._id}/comments`)
            setComments(response.data.data || []);
            
        } catch (error) {
            console.error('Error fetching comments: ', error)
            setError('Failed to load comments')
            
        }finally{
            setIsLoading(false)
        }
    }

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!text.trim()){
            setError('Comment cannot be empty')
            return 
        }
        if(text.length > 300){
            setError('Comment cannot have more that 300 characters')
            return 
        }

        try {
            setIsSending(true)
            const response = await API.post(`/posts/${post._id}/comment`, {
                text: text.trim()
            });

            setComments(prev => [response.data.data.comment, ...prev])
            setText('')
            setError('')
            
        } catch (error) {
            console.error('Error posting a comment: ', error)
            setError(error.response?.data?.message || 'Failed to post comment')
            
        }finally{
            setIsSending(false)
        }

        
    }

    const handleKeyPress = (e) => {
            if(e.key ==='Enter' && !e.shiftKey){
                e.preventDefault()
                handleSubmitComment(e)
            }
        }

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    }

    if(isLoading){
        return <div className="comment-section-loading">
            Loading comments...
        </div>
    }


    return(
        <div className="comment-section-container">
            <div className="comment-header">
                <h3>Comments ({comments.length})</h3>
                <div className="close-section">
                    <button className="close-btn" onClick={handleClose}>X</button>
                </div>

            </div>

            {error && <div className="comment-error">{error}</div>}
            <div className="comments-container">
                { comments.length > 0 ? 
                    <div className="comments-wrapper">
                        {comments.map(comment => 
                            <div className="comment" key={comment._id}>
                                <div className="comment-header">
                                    <span className="comment-username">
                                       @{comment.user?.username || 'Unknown'} 
                                    </span>
                                    
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>

                                </div>
                                <div className="text">
                                    {comment.text}
                                </div>
                            </div>
                        )}
                    </div>
                 : <div className="no-comments">
                    <p>There are no comments under this post yet</p>
                </div>}
            </div>


            { isLoggedIn && <div className="make-comment-container">
                <form className="comment-form">
                    <input type="text" className="comment-input" placeholder="Write a comment..." value={text} onChange={handleInput} onKeyPress={handleKeyPress} disabled={isSending} maxLength={300}/>
                    <button className="send-btn" type="submit" disabled={isSending || !text.trim()} onClick={handleSubmitComment}>{isSending ? 'Posting...' : 'Post'}</button>
                </form>
                <div className="character-count">
                    {text.length}/300 characters
                </div>

            </div>}

        </div>
    );
}

export default CommentSection