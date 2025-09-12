import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import '../styles/createpost.css'
import API from "../api/api";


function CreatePost({onPostCreated}){
    const [wantToPost, setWantToPost] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [content, setContent] = useState('')
    const { isLoggedIn } = useAuth();
    
    const handleDecisionChange = () => {
        if (!isLoggedIn){
            setError("Please log in to create a post")
            alert("Please log in to create a post")
        }
        setWantToPost(wantToPost => !wantToPost)
        setError("")
    }

    const handleInputChange = (e) => {
        setContent(e.target.value)
        e.target.style.height = 'auto'
        e.target.style.height = e.target.scrollHeight + 'px'
    }


    const createPost = async (e) => {
        e.preventDefault();

        if(!content.trim()){
            setError("Post content cannot be empty")
            return
        }

        if(content.length > 1000){
            setError("Post content cannot exceed 1000 characters")
            return
        }

        try {
            setIsLoading(true)
            setError('')

            const response = await API.post('/posts/', {
                content: content.trim()
            })

            setContent('')
            
            if(onPostCreated){
                onPostCreated(response.data.data)
            }

            alert('Post created successfully!')
            
        } catch (error) {
            console.error('Error creating a post: ', error)
            setError(error.response?.data?.message || 'Failed to create post')
            
        }finally{
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        setContent('')
        setError('')
        setIsLoading(false)
        setWantToPost(false)
    }

    return (

        <div className="outer-container">

            {wantToPost ? (
            <div className="createPost-container">
                <div className="header-CP">
                    <h3>Create New Post</h3>
                </div>
                <form onSubmit={createPost} className="create-post-form">
                    <div className="input-container">
                        <textarea name="content" id="content" rows={3} cols={1} placeholder="Enter post content..." value={content} onChange={handleInputChange} maxLength={1000} disabled={isLoading} className="post-content-textarea"></textarea>
                        <div className="character-count">
                            {content.length}/1000 characters
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    <div className="button-container">
                        <button className="post-btn" type="submit" disabled={isLoading || !content.trim()}>{isLoading ? "Posting..." : "Post"}</button>
                        <button className="post-cancel-btn" onClick={handleCancel} type="button" disabled={isLoading}>Cancel</button>
                    </div>

                </form>
                

                
            </div>) : (
                <button className="wantToPost-btn" onClick={() => handleDecisionChange()} disabled={!isLoggedIn}>{isLoggedIn ? "Create Post" : "Log in to post"}</button>) 
                
            }
        </div>
    );
}

export default CreatePost