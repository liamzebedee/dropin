var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

const MONGO_URL = "mongodb://test:password@ds161255.mlab.com:61255/dbdropin";

function isDigit(n) {
  return Boolean([true, true, true, true, true, true, true, true, true, true][n]);
}

var mongoDatabase;


let classes = null;
let subjectInfos = null;


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

router.get('/classes/search', (req, res) => {
  let query = {
    building: ""+req.query.building,
    day: Number(req.query.day),
    hour: Number(req.query.hour),
  }

  // query = testQuery;

  let selector = {
    day: query.day,
    startHour: { $gte: query.hour },
    building: query.building,
    "session.trimester": "SPR",
  };

  let data;

  classes
  .find(selector)
  .sort({
    'startHour': 1
  })
  .toArray((err, arr) => {
    if(err) console.error(err);

    let dataWithSubjectInfo = arr;

    let promises = dataWithSubjectInfo.map(classInfo => {
      let promise = subjectInfos.findOne({ code: classInfo.subjectId })
      return promise;
    })

    Promise.all(promises).then((vals) => {
      vals.map((subjInfo, i) => {
        console.log(subjInfo)
        dataWithSubjectInfo[i].subject = subjInfo;
      })

      res.send(dataWithSubjectInfo)
    })

  })
});

router.get('/subject', (req,res) => {
  console.log(req.query.subjectId);

  const selector = {
    code : "" + req.query.subjectId,
  };
  subjectInfos
  .findOne(selector)
  .then((doc,err)=>{
    if (!err){
      res.send(doc);
    } else res.sendStatus(500);
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
      code: query.q
    };

  } else {
    // Search for subject name
    selector = {
      $text: {
        $search: query.q.toLowerCase(),
        $language: "EN"
      }
    };
  
  }

  subjectInfos.find(selector).toArray((err, arr) => {
    res.send(arr);
  });

})


// Prefix with api
app.use('/api', router);

// Connect to the db
MongoClient.connect(MONGO_URL, function(err, db) {
  if(!err) {
    console.log("We are connected");
    mongoDatabase = db;

    // Setup collections
    classes = mongoDatabase.collection('classes')
    subjectInfos = mongoDatabase.collection('subjectInfos')

    // Indexes
    classes.createIndex({ name: "text" });

    app.listen(port, () => { console.log("Listening on", port) });
  }else{
    console.log("MongoDB connection error", err);
  }
});
