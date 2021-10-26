const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const user = require('../controllers/usersController');
const event = require('../controllers/eventsController');

const modelVendor = require('../model/vendors');
const modelHR = require('../model/hr');
const modelEvent = require('../model/events');

const app = express();
app.use(cors())
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json())

const port = '8000'

app.get('/', (req, res) => {
  res.end('Hello World');
});

// login
app.post('/login', async function(req, res){
  var response = await user.login(req.body);
  console.log(req.body)
  console.log('AA')
  res.json(response)
})
// users
app.get('/users', async(req, res) => {
  if (req.query.id != undefined){
    var response = await user.getUser(req.query.id);
    res.json(response)
  }
  else{
    var response = await user.allUsers();
    res.json(response);
  }
});

app.get('/vendors', async(req,res)=> {
  var response = await user.getVendors()
  res.json(response);
});

app.post('/createUsers', async function(req, res) {
  var response = await user.postUser(req.body);
  res.json(response);
});

app.get('/userEvents', async(req, res) => {
  var response = await event.getEventsByUserId(req.query.id);
  res.json(response);
});

// events
app.get('/events', async(req, res) => {
  if (req.query.id == undefined){
    var response = await event.allEvents();
    res.json(response);
  }
  else{
    var response = await event.getEvent(req.query.id);
    res.json(response);
  }
});

app.post('/allUserEvents', async(req, res) => {
  try {
    var response = await event.allUserEvents(req.body); 
  } catch (error) {
    res.json({status: 500, data:null, error: error.stack})
  }
  res.json(response);
})

app.post('/createEvent', async function(req, res) {
  var response = await event.postEvent(req.body);
  res.json(response);
});

app.post('/updateRejected', async function(req, res) {
  var response = await event.updateRejected(req.body);
  res.json(response);
});

app.post('/updateAccepted', async function(req, res) {
  var response = await event.updateAccepted(req.body);
  res.json(response);
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});