import React from 'react';
import PostCreate from './PostCreate';
import PostList from './PostList';
import './App.css'
export default function App() {
    return (
        <div>
        <h1 className="app-title">POST A THOUGHT</h1>
        <PostCreate />
        <PostList />
    </div>
    )};