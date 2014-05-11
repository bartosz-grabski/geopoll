var User = require('../model/user.js');
var Poll = require('../model/poll.js');
var UserPoll = require('../model/user_poll.js');
var emailService = require('../email/emailService.js');


var create = function (req, res) {
    var poll = new Poll(req.body);
    poll.creation_token = Poll.generateCreationToken();
    poll.save();

    var locals = {
        email: poll.creator_mail,
        subject: 'You have created a new poll',
        poll: 'http://localhost:3000/#/poll/' + poll.id,
        editPoll: 'http://localhost:3000/#/poll/' + poll.idWithToken,
        creatorName: poll.creator_name
    };

    emailService.send('new_poll', locals, function (err, responseStatus, html, text) {
    });
    res.send(201);
}

var polls = function (req, res) {
    Poll.find({}, function (err, polls) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(polls);
        }
    });
};

var pollGET = function (req, res) {

    if (!Poll.isIDWithOrWithoutTokenFormatCorrect(req.param('id'))) {
        res.status(404).send('Incorrect id or id and token combination');
    }
    else {
        var pollID = Poll.extractID(req.param('id'));
        var pollToken = Poll.extractToken(req.param('id'));

        Poll.findById(pollID, function (err, poll) {
            if (err) {
                console.log(err)
                res.status(404).send('No poll with provided id');
            }
            else {
                var pollObj = poll.toObject();

                pollObj.can_edit = false;
                if (pollToken == pollObj.creation_token) {
                    pollObj.can_edit = true;
                }

                delete pollObj.__v;
                delete pollObj.creation_token;
                res.send(pollObj);
            }
        });
    }
}

var pollPUT = function (req, res) {
    if (!Poll.isIDWithTokenFormatCorrect(req.param('id'))) {
        res.status(400).send('Malformed request');
    }
    else {
        Poll.findByIdAndUpdate(Poll.extractID(req.param('id')), req.body, null, function (err, poll) {
            if (err) {
                console.log(err);
                res.status(403);
            }
        });
    }
}

var view = function (req, res) {
    var view = req.params.view;
    res.render(view);
}

var index = function (req, res) {
    res.render('index');
}

module.exports = {
    create: create,
    polls: polls,
    view: view,
    index: index,
    pollPUT: pollPUT,
    pollGET: pollGET
}
