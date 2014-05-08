var User = require('../model/user.js');
var Poll = require('../model/poll.js');
var UserPoll = require('../model/user_poll.js');
var emailService = require('../email/emailService.js');

var index = function (req, res) {
    res.render('index');
};

var pollGET = function (req, res) {
    res.render('poll');
};

var pollPOST = function (req, res) {
    var poll = new Poll(req.body);
    poll.save();

    var locals = {
        email: poll.creator_mail,
        subject: 'You have created a new poll',
        poll: 'http;//localhost:3000/poll/' + poll.id,
        editPoll: 'http;//localhost:3000/poll/' + poll.id + '#' + poll.creation_token,
        creatorName: poll.creator_name
    };

    emailService.send('new_poll', locals, function(err, responseStatus, html, text){});
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
