const express = require('express');
const bodyparser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyparser.json());

const moderateEvent = async (type, data) => {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
        // calling /events in event-bus and sending status update
        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        });
}

app.post('/events', async (req, res) => {
    const {type, data} = req.body;
    if(type === 'CommentCreated') {
        moderateEvent(type, data);
    }
    res.send({});
});

app.listen(4003, async () => {
    console.log('listening on 4003!');
    try {
        const res = await axios.get("http://localhost:4005/events");
     
        for (let event of res.data) {
            if(event.type === 'CommentCreated') {
                console.log("Processing event:", event.type);
                moderateEvent(event.type, event.data);
            }
        }
      } catch (error) {
        console.log(error.message);
      }
})