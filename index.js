// const Alexa = require('alexa-sdk');
// const APP_ID = '';
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const tripPlanner = require('./handler');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Welcome to Trip Planner!'));

app.post('/tripplanner' , (req, res) => {

  tripPlanner.process(req, res);


});

app.listen(3000, () => {
  console.log('listening on port 3000');
});

