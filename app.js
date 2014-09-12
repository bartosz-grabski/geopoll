var dbConfig = require('./db/dbConfig.json');
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

// all environments
//app.use(express.compress());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
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
app.get('/home', routes.homeGET);
app.post('/create', routes.create);
app.put('/poll/:id', routes.pollPUT);
app.get('/poll/:id', routes.pollGET);
app.get('/polls', routes.polls);
app.get('/views/:view', routes.view);
app.get('/views/modals/:modal', routes.modal);
app.get('/userpolls/:poll_id', routes.userPollGET);
app.post('/userpoll', routes.userPollPOST);
app.delete('/poll/:poll_id/term/:term_id', routes.deleteTerm);
app.post('/poll/:poll_id/term', routes.addTerm);
app.post('/poll/:poll_id/term/vote/:term_id', routes.voteOnTerm);
app.post('/poll/:poll_id', routes.pollPOST);
app.get('/register', routes.registerGET);
app.post('/register', routes.registerPOST);
app.get('/login', routes.loginGET);
app.post('/login', routes.loginPOST);
