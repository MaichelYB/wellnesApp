// managing request for vendors
const database = require('../database/database.js')
const globalVar = require('../helper/global')
var ObjectId = require('mongodb').ObjectID;

const login = async function(data){
  try {
    const db = await database.connection();
    const col = db.collection(globalVar.userPath);
    const p = await col.findOne({"name": data.username, "pass":data.password});
    // if ((await p.count()) === 0) {
    //   console.log("No documents found!");
    // }
    console.log(data.username)
    return {"status": 200, "data": p};
  } catch (error) {
    console.log(error.stack)
  }
}
const allUsers = async function(){
  try{
    // const col = db.collection("vendors");
    const db = await database.connection();
    const col = db.collection(globalVar.userPath);
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
const getVendors = async function(){
  try{
    // const col = db.collection("vendors");
    const db = await database.connection();
    const col = db.collection(globalVar.userPath);
    const p = await col.find({});
    var jsonArr = []
    if ((await p.count()) === 0) {
      console.log("No documents found!");
    }
    await p.forEach((element) => {
      if(element.is_hr == 0){
        jsonArr.push(element)
      }
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
const getUser = async function(id){
  try{
    const db = await database.connection();
    const col = db.collection(globalVar.userPath);
    const p = await col.findOne({"_id": id});
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

var postUser = async function(body){
  try{
    const db = await database.connection();
    const col = db.collection(globalVar.userPath);
    const opt = col.createIndex({"name":1}, {unique: true})
    const p = await col.insertOne(body, opt);
  }catch (err){
    // console.log(err.stack)
    return {"status": 500, "message": err.stack};
  }
  finally{
    await database.closeConnection();
  }
  return {"status": 200, "data": body};
  // await database.connection();
}

module.exports = {
  allUsers, getUser, postUser, login, getVendors
}