const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');
const app = express();
// bodyparses makes sure that when user sends JSON data in request object, it actually gets parsed show that it shows properly in request handler.
app.use(bodyParser.json());
app.use(cors());
//for this porject we will store data in memory.
const commentByPostId  = {};
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentByPostId[req.params.id] || []);
});
app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentByPostId[req.params.id] || [];

    // added on 18/7/24
    // comments.push({ id: commentId, content });
    comments.push({ id: commentId, content, status: 'pending' });
    //
    commentByPostId[req.params.id] = comments;

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending' // added on added on 18/7/24
        }
    }).catch((err) => {
        console.log(err.message);
      });
    res.status(201).send(comments);
});

// this /event will recieve an event from event-bus and make changes to comment present in local data  and update status field.
app.post('/events', async (req, res) => {
    console.log('Received Event', req.body.type);
    const { type, data } = req.body; 
    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        const comments = commentByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                content,
                postId,
                status
            }
        })
    }
    res.send({});
});

app.listen(4001, () => {
    console.log('listening on 4001');
})