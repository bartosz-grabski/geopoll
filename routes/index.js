var User = require('../model/user.js');
var Poll = require('../model/poll.js');
var UserPoll = require('../model/user_poll.js');

var index = function(req, res){
	res.render('index');
};

var pollGET = function(req,res) {
	res.render('poll');
};

var pollPOST = function(req, res) {

}

var pollList = function(req,res) {
    var list = Poll.find();
    console.log(list);
    res.json(list);
};

var home = function(req, res){
    res.render('home.html');
}

module.exports = { 
	index: index,
	pollGET: pollGET,
    pollPOST: pollPOST,
    pollList: pollList
}