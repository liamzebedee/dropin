var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

const MONGO_URL = "mongodb://test:password@ds161255.mlab.com:61255/dbdropin";


var mongoDatabase;
// Connect to the db
MongoClient.connect(MONGO_URL, function(err, db) {
  if(!err) {
    console.log("We are connected");
    mongoDatabase = db;
  }else{
    console.log("MongoDB connection error", err);
  }
});

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();



router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});


router.get('/subjects/nearby', (req, res) => {

	//let now = new Date();
	let now = new Date();
  let query = {
		building: "CB11",
		classType: "Tut",
    //day:now.getDay(),
    day:1,
    now
  };

  var today = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
	// So MongoDB lets you do nested array queries.
	// http://stackoverflow.com/questions/12629692/querying-an-array-of-arrays-in-mongodb

	// TODO: Sort
  var subjects = mongoDatabase.collection('classes');
  let results = subjects.find({
    sessions:{
      $elemMatch:{
        classes:{
          $elemMatch:{
            weeksOn:{ $elemMatch: {$elemMatch:{$lte:today}} },
            day: query.day,
            building: query.building,
            classType: query.classType,
            //startingTime: {"$gte" : Date()}//{ $gte : now }
          }
        }
      }
    }
  }).toArray((err,re)=>{
    /*var responseArray = [];
    re.forEach((item,index)=>{
      responseArray.push({
        subjectName: item.subjectName,
      })
      res.send(responseArray);
    });*/
    res.send(re);
  });
});

router.get('/subjects/search', (req, res) => {

})

router.get('/feedback', (req,res)=>{

})

// Prefix with api
app.use('/api', router);
app.listen(port, ()=>{console.log("Listening on", port)});
