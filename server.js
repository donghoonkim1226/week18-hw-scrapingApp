/*-------------------------------------------------
  NODE PACKAGES
-------------------------------------------------*/
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var express = require('express');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var request = require('request');
var logger = require('morgan');
var app = express();

/*-------------------------------------------------
  CONNECTION PORT
-------------------------------------------------*/

var PORT = process.env.PORT || 7000;

/*-------------------------------------------------
  LOGGER & BODY PARSER SET UP
-------------------------------------------------*/
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

/*-------------------------------------------------
  HANDLEBAR SETUP
-------------------------------------------------*/

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

/*-------------------------------------------------
  ACCESS TO PUBLIC FOLDER
-------------------------------------------------*/

app.use(express.static("public"));

/*-------------------------------------------------
  DATABASE CONFIG
-------------------------------------------------*/

mongoose.connect('mongodb://localhost/scrapingApp');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

/*-------------------------------------------------
  REQUIRING MODELS/SCHEMA
-------------------------------------------------*/

var Note = require('./models/noteModel.js');
var Article = require('./models/articleModel.js');

/*-------------------------------------------------
  ROUTES
-------------------------------------------------*/
app.get("/", function (req, res) {
  res.render("index");
});

/*-------------------------------------------------
  SCRAPE TO DB
-------------------------------------------------*/

app.get("/scrape", function(req, res){
	request("https://news.ycombinator.com/", function (error, response, html) {
    var $ = cheerio.load(html);
    $("td.title:nth-child(3)>a").each(function(i, element) {

      var articleTitle = $(element).text();
      var articleLink = $(element).attr('href');
      var insertedArticle = new Article({
        title : articleTitle,
        link: articleLink
       });

      insertedArticle.save(function(err, dbArticle) {
        if (err) {
          console.log(err);
        } else {
          // console.log(dbArticle);
        }
      });
    });
    res.render('index');
  });
});


app.get("/data", function (req, res) {
	Article.find({}, function(err, data){
   if (err){
     throw err;
   }
   console.log(Article);
  });
  res.render('data'); 
});

app.listen(PORT, function(){
  console.log("Server listening at " + PORT);
});