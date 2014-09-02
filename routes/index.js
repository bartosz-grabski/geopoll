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
};

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
			if(poll) {

                var pollObj = poll.toObject();
                if (pollObj.is_closed) {
                    res.send({is_closed:true});
                    return;
                }



                var isDeclarationClosed = pollObj.is_declaration_closed;
                var today = new Date(); // should we care about timezones somehow ?

                if (pollObj.end_time < today) {
                    poll.is_closed = true;
                    poll.save();
                    res.send({is_closed:true});
                }

                pollObj.isDeclarationClosed = isDeclarationClosed;

                if (pollObj.declaration_end_time < today) {
                    pollObj.is_declaration_closed = true;
                    if (isDeclarationClosed === false) {
                        Poll.findByIdAndUpdate(pollID,pollObj,null, function(err,succ) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("successfully updated declaration_closed field for poll = "+pollID);
                            }
                        });
                    }
                } 

                pollObj.can_edit = false;
                if (pollToken == pollObj.creation_token) {
                    pollObj.can_edit = true;
                }

                delete pollObj.__v;
                delete pollObj.creation_token;
                res.send(pollObj);
            } else {
                console.log(err);
                res.status(404).send('No poll with provided id');
            }
        });
    }
};

var pollPUT = function (req, res) {
    if (!Poll.isIDWithTokenFormatCorrect(req.param('id'))) {
        res.status(400).send('Malformed request');
    }
    else {
        Poll.findByIdAndUpdate(Poll.extractID(req.param('id')), req.body, null, function (err, poll) {
            if (err) {
                console.log(err);
                res.send(403);
            } else {
                console.log("asd");
                res.send(200);
            }
        });
    }
};

var userPollGET = function (req, res) {
    if (!Poll.isIDWithOrWithoutTokenFormatCorrect(req.param('poll_id'))) {
        res.status(404).send('Incorrect id or id and token combination');
    } else {
        var pollId = Poll.extractID(req.param('poll_id'));
        console.log(pollId);
        UserPoll.find({ poll_id: pollId }, function (err, userPolls) {
            if (err) {
                console.log(err);
                res.status(404).send('No poll with provided id');
            } else {
                var userPollObjects = userPolls;
                res.send(userPollObjects);
            }
        });
    }
};


var userPollPOST = function (req, res) {

    var pollId = Poll.extractID(req.param('poll_id'));
    req.body.poll_id = pollId;

    Poll.findById(pollId, function (err, poll) {

        if (err) {
            res.send(500);
        } else if (poll.is_declaration_closed) {
            res.send(400);
        }

        var userPoll = UserPoll(req.body);
        userPoll.save();
        res.send(201);

    });
};

var view = function (req, res) {
    var view = req.params.view;
    res.render(view);
};

var modal = function (req, res) {
    var modal = req.params.modal;
    res.render("modals/" + modal);
};

var index = function (req, res) {
    res.render('index');
};

var addTerm = function (req, res) {

    var pollId = Poll.extractID(req.param('poll_id'));

    Poll.findById(pollId, function(err, poll) {
        if (err) {
            res.send(500);
        } else if (!poll.is_declaration_closed || !poll) {
            res.send(400);
        } else {

            var term = req.body;

            term.id = (Math.random(2000) + 1000).toString(32).substring(6);
            term.votedFor = 0;

            if (!poll.selected_terms) {
                poll.selected_terms = [];
            }

            poll.selected_terms.push(term);

            poll.save();

            res.send(201, term);
         }
    });

};

var deleteTerm = function (req, res) {

    var pollId = Poll.extractID(req.param('poll_id'));
    var termId = req.param('term_id');

    Poll.findById(pollId, function(err, poll) {
        if (err) {
            res.send(500);
        } else if (!poll.is_declaration_closed || !poll) {
            res.send(400);
        } else {
            if (poll.selected_terms) {
                for (var i = 0; i < poll.selected_terms.length; i++) {
                    if (poll.selected_terms[i].id === termId) {
                        index = i;
                        break;
                    }
                }

                poll.selected_terms.splice(index,1);
                poll.markModified("selected_terms");    //otherwise doesn't work (?!)
                poll.save(function(err,poll) {
                    if(err) {
                        res.send(400, err);
                    } else {
                        res.send(201);
                    }
                })
            } else {
                res.send(400);
            }

        }
    });


};

var voteOnTerm = function (req, res) {

    var pollId = Poll.extractID(req.param('poll_id'));
    var termId = req.param('term_id');

    Poll.findById(pollId, function(err, poll) {
        if (err) {
            res.send(500);
        } else if (!poll.is_declaration_closed || !poll) {
            res.send(400);
        } else {
            if (poll.selected_terms) {
                for (var i = 0; i < poll.selected_terms.length; i++) {
                    if (poll.selected_terms[i].id === termId) {
                        if (!poll.selected_terms[i].votedFor) {
                            poll.selected_terms[i].votedFor = 0;
                        }
                        poll.selected_terms[i].votedFor += 1;
                        break;
                    };
                };

                poll.markModified("selected_terms");    //otherwise doesn't work (?!)
                poll.save(function(err,poll) {
                    if(err) {
                        res.send(400, err);
                    } else {
                        res.send(201);
                    }
                })
            } else {
                res.send(400);
            }

        }
    });

};

var pollPOST = function(req,res) {
    if (req.body.operation) {
        var operation = req.body.operation;
        var pollId = Poll.extractID(req.param('poll_id'));
        if (operation === "FINISH_VOTING_PHASE") {
            Poll.findById(pollId, function(err,poll) {
               if (err) {
                   res.send(500);
               }
               poll.is_closed = true;
               poll.save();
               _sendClosedMail(poll);
               res.send(200);
            });
        } else if (operation === "FINISH_DECLARATION_PHASE") {
            Poll.findById(pollId, function(err, poll) {
               if(err) {
                   res.send(500);
               }
               poll.is_declaration_closed = true;
               poll.save();
               _sendDeclarationClosedMail(poll);
               res.send(200);
            });
        } else {
            res.send(400, { "message" : "unknown operation type"});
        }
    } else {
        res.send(400);
    }
};

var _sendClosedMail = function(poll) {

    var locals = {
        email: poll.creator_mail,
        subject: 'Your poll has been closed!',
        poll: 'http://localhost:3000/#/poll/' + poll.id,
        creatorName: poll.creator_name
    };

    //TODO - notify user about results in email

    emailService.send('closed_poll', locals, function (err, responseStatus,html,text) {

    });
};

var _sendDeclarationClosedMail = function(poll) {

    var notificationType = poll.notification_type;

    var locals = {
        email: poll.creator_mail,
        subject: 'Your poll\'s declaration phase has been closed!',
        poll: 'http://localhost:3000/#/poll/' + poll.id,
        editPoll: 'http://localhost:3000/#/poll/' + poll.idWithToken,
        creatorName: poll.creator_name
    };

    emailService.send('closed_decl_poll', locals, function (err, responseStatus,html,text) {

    });
};


var homeGET = function (req, res) {
    res.render('home');
};

var registerGET = function (req, res) {
    res.render('register');
};

var registerPOST = function (req, res) {
    //check if user with given user_name exists
    User.findOne({ user_name: req.body.user_name}, function (err, user) {
        if (user == null) {
            var user = User(req.body);
            user.save();
            res.send(201);
        }
        else {
            res.status.send('User with a provided user name already exists.');
        }
    })
};

var loginGET = function (req, res) {
    res.render('login');
};

var loginPOST = function (req, res) {
    User.findOne({ user_name: req.body.user_name}, function (err, user) {
        if (user == null) {
            res.status(401).send('User with a provided user name does not exist.');
        }
        else {
            if (req.body.hashed_password === user.hashed_password) {
                req.session.user_id = user.id;
                res.send(201);
            } else {
                res.status(401).send('Bad password');
            }
        }
    });


};

module.exports = {
    create: create,
    polls: polls,
    view: view,
    modal: modal,
    index: index,
    pollPUT: pollPUT,
    pollGET: pollGET,
    userPollPOST: userPollPOST,
    userPollGET: userPollGET,
    addTerm: addTerm,
    deleteTerm: deleteTerm,
    voteOnTerm: voteOnTerm,
    pollPOST: pollPOST,
    registerGET: registerGET,
    registerPOST: registerPOST,
    loginGET: loginGET,
    loginPOST: loginPOST,
    homeGET: homeGET
};
