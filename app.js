var dbConfig = require('./db/dbConfig.json');
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

mongoose.connect('mongodb://' + dbConfig["dbHost"] + ":" + dbConfig["dbPort"] + "/" + dbConfig["dbDatabase"]);

app.get('/', routes.index);
app.post('/create', routes.create);
app.put('/poll/:id', routes.pollPUT);
app.get('/poll/:id', routes.pollGET);
app.get('/polls', routes.polls);
app.get('/views/:view', routes.view);
app.get('/views/modals/:modal', routes.modal);
app.get('/userpolls/:poll_id', routes.userPollGET);
app.post('/userpoll/:id', routes.userPollPOST);
