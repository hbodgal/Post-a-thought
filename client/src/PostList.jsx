import React, { useEffect, useState } from "react";
import axios from 'axios';
import CommentCreate from "./CommentCreate";
import CommentsList from "./CommentList";
export default function PostList() {
    const [posts, setPost] = useState([]);
    const fetchPosts = async (event) => {
        try {
            const res = await axios.get('http://posts.com/posts').catch((err) => {
                console.log(err.message);
              });
            setPost(res.data);
        }
        catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchPosts();
        
    }, []);

    const renderredPosts = Object.values(posts).map(post => {
        return <div 
        className="card" 
        style={{ width: '30%', marginBotton: '20px' }}
        key={post.id}
        >
            <div className="card-body">
                <h3>{post.title}</h3>
                <CommentsList comments={post.comments} />
                <CommentCreate postId={post.id} />
            </div>

        </div>
    });
    return (
        <div 
        className="d-flex flex-row flex-wrap justify-content-between"
        style={{padding: '20px'}}>
            {renderredPosts}
    </div>
    );
};