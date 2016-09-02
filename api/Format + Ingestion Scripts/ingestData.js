var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
const MONGO_URL = "mongodb://test:password@ds161255.mlab.com:61255/dbdropin";


MongoClient.connect(MONGO_URL, function(err, db) {

  if(!err) {
    var collection = db.collection('classes');
    collection.insertMany(
      JSON.parse(fs.readFileSync('ingest.json')), (err,res)=>{
        if (err === null){
          console.log('Success', res);
        }else{
          console.log('Error', err);
        }
      })
  }else{
    console.log("MongoDB connection error", err);
  }
});
