//Decided to install and require MongoClient to help store data instead of a mongoose library because
//even  familiar with mongoose, using MongoClient
// gets the job done just as well without the need to define a schema and complicate things as required in mongoose. 

const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const db             = require('./config/db');

const port = 8085;

//front end angular related
app.set('view engine', 'ejs');
app.use('/assets', express.static(__dirname + '/public'));


app.get('/', function(req, res) {
  res.render('index');
});

// For returning data back from Mlab
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
require('./app/routes')(app, database);
require('./app/routes')(app, {});

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
})
