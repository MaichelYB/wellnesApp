// managing request for vendors
const database = require('../database/database.js')
const globalVar = require('../helper/global')
var ObjectId = require('mongodb').ObjectID;

const allEvents = async function(){
  try{
    // const col = db.collection("vendors");
    const db = await database.connection();
    const col = db.collection(globalVar.eventPath);
    const p = await col.find({});
    var jsonArr = []
    if ((await p.count()) === 0) {
      console.log("No documents found!");
    }
    await p.forEach((element) => {
      jsonArr.push(element)
    });
    // const myDoc = await col.findOne();
    return {"status": 200, "data": jsonArr};
  }catch (err){
    console.log(err.stack)
    return {"status": 500, "message": err.stack};
  }
  finally{
    await database.closeConnection();
  }
}

const allUserEvents = async function(body){
  var allRes = []
  var newBody = []
  try {
    body.forEach(element => {
      const _id = ObjectId(element)
      newBody.push(_id)
    });
    console.log(newBody[0])
    const db = await database.connection();
    const col = db.collection(globalVar.eventPath);
    // console.log(col)
    const p = await col.find({
        _id: {
            $in: newBody
        }
    });
    var jsonArr = []
    if ((await p.count()) === 0) {
      console.log("No documents found!");
    }
    await p.forEach((element) => {
      jsonArr.push(element)
    });
    await database.closeConnection();
    return {"status": 200, "data": jsonArr}; 
  } catch (error){
    // console.log(uncaughtException.stack);
    throw error
    await database.closeConnection();
    return {"status": 500, "message": err.stack};
  }
  // finally{
  //   await database.closeConnection();
  // }
}

const getEventsByUserId = async function(id){
  try{
    const db = await database.connection();
    const col = db.collection(globalVar.userPath);
    const options = {
      // Include only the `title` and `imdb` fields in each returned document
      projection: { events: 1 },
    };
    const p = await col.findOne({"_id": ObjectId(id)}, options);
    // const myDoc = await col.findOne();
    return {"status": 200, "data": p};
  }catch (err){
    console.log(err.stack)
    return {"status": 500, "message": err.stack};
  }
  finally{
    await database.closeConnection();
  }
}

const getEvent = async function(id){
  try{
    const db = await database.connection();
    const col = db.collection(globalVar.eventPath);
    const p = await col.findOne({"_id": ObjectId(id)});
    // const myDoc = await col.findOne();
    return {"status": 200, "data": p};
  }catch (err){
    console.log(err.stack)
    return {"status": 500, "message": err.stack};
  }
  finally{
    await database.closeConnection();
  }
}

var postEvent = async function(body){
  try{
    const db = await database.connection();
    const col = db.collection(globalVar.eventPath);
    const p = await col.insertOne(body);

    const addEvent = db.collection(globalVar.userPath);
    await addEvent.updateMany(
      { _id: {
        $in: [body['hr']['id'], body['vendor']['id']]
      }},
      {
        $push: {
          events: {
              $each: [ body['_id'] ],
          }
        }
      }
    );
    return {"status": 200, "data": body};
  }catch (err){
    console.log(err.stack)
    return {"status": 500, "message": err.stack};
  }
  finally{
    await database.closeConnection();
  }
  // await database.connection();
}

var updateRejected = async function(body){
  try{
    const db = await database.connection();
    const col = db.collection(globalVar.eventPath);
    const p = await col.update(
      { _id: ObjectId(body['id'])},
      // {$set: {
      //   "status": 1
      // }}
      {
        $set: {
          "confirmed": 1,
          "status": 0,
          "remarks": body['remarks'],
          "dateConfirmed": new Date()
        }
      }
    );
    const res = await col.findOne({"_id": ObjectId(body['id'])})
    return {"status": 200, "data": res};
  }catch (err){
    console.log(err.stack)
    return {"status": 500, "message": err.stack};
  }
  finally{
    await database.closeConnection();
  }
  // await database.connection();
}

var updateAccepted = async function(body){
  try{
    const db = await database.connection();
    const col = db.collection(globalVar.eventPath);
    const p = await col.update(
      { _id: ObjectId(body['id'])},
      // {$set: {
      //   "status": 1
      // }}
      {
        $set: {
          "confirmed": 1,
          "status": 1,
          "chosenDate": body['dateSelected'],
          "dateConfirmed": new Date()
        }
      }
    );
    const res = await col.findOne({"_id": ObjectId(body['id'])})
    return {"status": 200, "data": res};
  }catch (err){
    console.log(err.stack)
    return {"status": 500, "message": err.stack};
  }
  finally{
    await database.closeConnection();
  }
  // await database.connection();
}

module.exports = {
  allEvents, getEventsByUserId, getEvent, postEvent, allUserEvents, updateRejected, updateAccepted
}