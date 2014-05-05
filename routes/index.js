//var User = require('../model/user.js');
//var Poll = require('../model/poll.js');
//var UserPoll = require('../model/user_poll.js');

var index = function (req, res) {
    res.render('index');
};

var pollGET = function (req, res) {
    res.render('poll');
};

var pollPOST = function (req, res) {
    var poll = new Poll(req.body);
    poll.save();
}

var pollList = function (req, res) {
    Poll.find({}, function (err, polls) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(polls);
        }
    });

};

var home = function(req, res){
    res.render('home');
}

module.exports = {
    index: index,
    pollGET: pollGET,
    pollPOST: pollPOST,
    pollList: pollList,
    home: home
}
