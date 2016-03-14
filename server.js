var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var express = require('express');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var request = require('request');
var logger = require('morgan');

var PORT = process.env.PORT || 7000;

var app = express();

/*-------------------------------------------------
  HANDLEBAR LAYOUTS
-------------------------------------------------*/

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

/*-------------------------------------------------
  ACCESS TO PUBLIC FOLDER
-------------------------------------------------*/

app.use(express.static("public"));

/*-------------------------------------------------
  DATABASE CONNECTION & CONFIG - MONGO DB
-------------------------------------------------*/

mongoose.connect('mongodb://localhost/scrapingApp');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var mongojs = require('mongojs');
var databaseUrl = "scraper";
var collections = ["scrapedData"];
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

/*-------------------------------------------------
  REQUIRING MODELS
-------------------------------------------------*/

var Note = require('./models/noteModel.js');
var Data = require('./models/dataModel.js');

app.listen(PORT, function(){
  console.log("Server listening at " + PORT);
});