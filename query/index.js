const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();


app.use(bodyParser.json());
app.use(cors());

const posts = {};
// moved all if statements from event post to here. TO handle event processing after any service restarts.

const handleEvent = (type, data) => {
    if(type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: []};

    }
    if(type === 'CommentCreated') {
        // status added on 18/7/24
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    // Comment Updated event added on 18/7/24 start
    if(type === 'CommentUpdated') {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        })

        comment.status = status;
        comment.content = content;
    }
    // Comment Updated event added on 18/7/24 end
}
// post === {
//     'j123j42': {
//         id: 'j123j42',
//         title: 'post title',
//         comments: [
//             {id: 'klj3l', content: 'comments!'}
//         ]
//     }
// };
app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;
    // moved all the if statements to a function and called that function here.
    handleEvent(type, data);
    res.send({});

});

app.listen(4002, async () => {
    console.log("Listening on 4002");
    try {
      const res = await axios.get("http://event-bus-srv:4005/events");
   
      for (let event of res.data) {
        console.log("Processing event:", event.type);
   
        handleEvent(event.type, event.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  });