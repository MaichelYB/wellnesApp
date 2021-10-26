const uri = "mongodb+srv://user:user@cluster0.29gdk.mongodb.net/WellnesEvent?retryWrites=true&w=majority&ssl=true"
const { MongoClient } = require('mongodb');

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = async function() {
  console.log('AA')
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db('WellnesEvent');
    // Use the collection "people"
    return db;
  } catch (err) {
    console.log(err.stack);
  }
}

const closeConnection = async function() {
  console.log('closing connection');
  try {
    await client.close();
    console.log('connection closed');
  }
  catch(err){
    console.log(err.stack)
  }
}
// var closeConnection = client.close(err => {
//   if(err) throw err;
// });

module.exports = {
  connection,
  closeConnection
}