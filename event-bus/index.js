const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
app.use(bodyParser.json());
const events = [];
app.post('/events', (req, res) => {


    const event = req.body;
    // storing events in a in-memory data structure.
    events.push(event);
    axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log(err.message);
      });
    axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log(err.message);
      });
    axios.post('http://localhost:4002/events', event).catch((err) => {
        console.log(err.message);
      });
    axios.post('http://localhost:4003/events', event).catch((err) => {
      console.log(err.message);
    });
    res.send({status: 'OK'});
});
// created API to get all the events stored.
app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
    console.log('listening on 4005');
})