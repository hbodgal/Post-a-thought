import React, { useState } from "react";
import axios from 'axios';

export default function PostCreate() {
    const [title, setTitle] = useState('');
    const onSubmit = async (event) => {
        event.preventDefault();
        await axios.post('http://posts.com/posts/create', {
            title
        });
        setTitle('');
    };
    return (
        <div className="container">
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input 
                    className="form-control"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    />
            </div>
            <button className="btn btn-primary">Submit Here</button>
        </form>
    </div>
    );
};