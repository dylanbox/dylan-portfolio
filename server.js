var express = require('express');
var app = express();
var nunjucks = require('nunjucks');
var config = require('config');
var compression = require('compression');
var works = require('./worksConfig.json');

// Compress all requests
app.use(compression())

// Views
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

function BaseView(request, response) {
  response.render('index.njk', {"works": works});
}

function PortfolioView(work) {
  return function (request, response) {
    response.render('work/' + work.slug + '.njk', {"work": work});
  }
}


// Urls
// ========
app.get('/', BaseView);

// Portfolio Urls
for (var index = 0; index < works.length; index++) {
  var work = works[index];
  app.get('/work/' + work.slug, PortfolioView(work));
}


// Static files
app.use('/dist', express.static(__dirname + '/dist'));

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.
app.use(function(request, response, next){
  response.status(404);

  // default to plain-text. send()
  response.type('txt').send('Not found');
});

// Create the server
app.listen(config.get('Server.port'));
