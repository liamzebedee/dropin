var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

const MONGO_URL = "mongodb://test:password@ds161255.mlab.com:61255/dbdropin";

function isDigit(n) {
    return Boolean([true, true, true, true, true, true, true, true, true, true][n]);
}



var mongoDatabase;
// Connect to the db
MongoClient.connect(MONGO_URL, function(err, db) {
  if(!err) {
    console.log("We are connected");
    mongoDatabase = db;
    mongoDatabase.collection('classes').createIndex({ subjectName: "text" })
    
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

app.all('*', function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
});


router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});


router.post('/subjects/upcoming', (req, res) => {

	let now = new Date();

  let query =  req.body || {
    building: "CB11",
    classType: "Tut",
    day:now.getDay(),
    hour: now.getHours(),
  };

  var today = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  console.log(query);
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
            day: now.getDay(),
            building: query.building,
            //classType: query.classType,
            startHour: {$gte: query.hour}
          }
        }
      }
    }
  }).toArray((err,re)=>{
    /*var responseArray = [];
    re.forEach((item,index)=>{
      if (item.sessions)
      responseArray.push(item);
  });*/
    //res.send(responseArray);
    res.send(re);
  });
});

router.get('/subjects/search', (req, res) => {
  let query = {
    q: req.query.q
    // q: "48023",
    // q: "french",
  }

  let selector;

  if(isDigit(query.q.charAt(0))) {
    // Search for subject code
    selector = {
      subjectId: query.q
    };

  } else {
    // Search for subject name
    selector = {
      $text: {
          $search: query.q.toLowerCase(),
          // $caseSensitive: false,
          $language: "EN"
        }
    };
  }

  var subjects = mongoDatabase.collection('classes');
  subjects.find(selector).toArray((err,re)=>{
    res.send(re);
  });
  
})

router.get('/feedback', (req,res)=>{

})

// Prefix with api
app.use('/api', router);
app.listen(port, ()=>{console.log("Listening on", port)});
