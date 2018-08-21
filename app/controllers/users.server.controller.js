var User = require('mongoose').model('User'),
    Param = require('mongoose').model('Param'),
    passport = require('passport'),
    nodemailer = require('nodemailer');


//Init the SMTP transport
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'datahackil2018@gmail.com',
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
};
var transporter = nodemailer.createTransport(smtpConfig);

function sendEmail(body) {
    // setup e-mail data with unicode symbols

    var mailOptions = {
        from: body.email, // sender address
        to: '', // list of receivers
        subject: 'Someone contact DataHack 2018 website!', // Subject line
        text: body.message,// plaintext body
        html: '<h1> ' + body.name + '(' + body.email + ')</h1><h2> This is his message:</h2><h3>' + body.message + '</h3>'// html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

function sendEmailConduct(body) {
    var mailOptions = {
        from: "contact@datahack-il.com", // sender address
        to: 'deanla@gmail.com', // list of receivers
        subject: 'CODE OF CONDUCT VIOLATION', // Subject line
        // text: body.message,// plaintext body
        // html: '<h1> ' + body.name + '(' + body.email + ')</h1><h2> This is the message:</h2><h3>' + body.message + '</h3>'// html body
        text: "test"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

function sendEmailRsvp(emailAddr, f_name, l_name) {
    // setup e-mail data with unicode symbols

    var mailOptions = {
        from: "contact@datahack-il.com", // sender address
        to: emailAddr, // list of receivers
        subject: 'DataHack 2017 RSVP confirmation', // Subject line
        text: "Hi " + f_name + " " + l_name + "\nYou have accepted the rules and RSVP\'d for DataHack 2017.\n\nSee you soon!\nThe DataHack team",// plaintext body
        html: ''// html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}


exports.sendMail = function (req, res, next) {
    sendEmail(req.body);
    res.send("ok");
};

exports.sendConduct = function (req, res, next) {
    // alert('CONDUCT');
    sendEmailConduct(req.body);
    // alert(req.body);
    res.send("Sent")
};

var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    }
    else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    return message;
};

exports.renderLogin = function (req, res, next) {
    if (!req.user) {
        res.render('index', {
            title: 'Log-in Form',
            messages: req.flash('error') || req.flash('info'),
            user: null
        });
    }
    else {
        return res.redirect('/team-up');
    }
};

exports.renderRegister = function (req, res, next) {
    if (!req.user) {
        res.render('register', {
            title: 'Register Form',
            messages: req.flash('error')
        });
    }
    else {
        return res.redirect('/team-up');
    }
    5
};

exports.renderPrintUsers = function (req, res, next) {
    //if (!req.user) {
    User.find({}, function (err, users) {
        if (err) {
            return next(err);
        }
        else {
            res.render('showUsers', {
                title: 'Show Users Panel',
                users: users,
                messages: req.flash('error')
            });
        }
    });
    //} else {
    //	return res.redirect('/');
    //}
};


exports.renderReset = function(req, res, next) {
	// if (req.user && req.user.email === "oded.valtzer@gmail.com" ) {
	if (req.user && (req.user.email === "idoivri@gmail.com" || req.user.email === "shaypal5@gmail.com")) {
	// if (req.user && (req.user.isAdmin === true)) {

        res.render('reset', {
            title: 'reset password',
            user: {"email": req.user.email, "isAdmin": true},
            messages: req.flash('error')
        });
    }
    else {
        console.log("Failing user check!");
        res.redirect("/login");
    }
};

exports.register = function (req, res, next) {
    if (!req.user) {
        console.log(req.body);
        console.log(req.files);
        var user = new User(req.body);
        var message = null;
        user.provider = 'local';
        user.save(function (err) {
            if (err) {
                console.log(err);
                var message = getErrorMessage(err);
                req.flash('error', message);
                if (err.code === 11000) {
                    return res.status(409).json(err.code);
                } else {
                    return res.status(500).json(err.code);
                }
            } else {
                res.send("ok")
            }
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/team-up');
};

// not used - Oauth facebook and twitter
exports.saveOAuthUserProfile = function (req, profile, done) {
    User.findOne({
            provider: profile.provider,
            providerId: profile.providerId
        },
        function (err, user) {
            if (err) {
                return done(err);
            }
            else {
                if (!user) {
                    var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
                    User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                        profile.username = availableUsername;
                        user = new User(profile);

                        user.save(function (err) {
                            if (err) {
                                var message = _this.getErrorMessage(err);
                                req.flash('error', message);
                                return res.redirect('/register');
                            }

                            return done(err, user);
                        });
                    });
                }
                else {
                    return done(err, user);
                }
            }
        }
    );
};


exports.create = function (req, res, next) {
    console.log(req.body)
    if (req.body.isAdmin) {
        req.body.isAdmin = false;
    }
    var user = new User(req.body);
    user.save(function (err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(user);
        }
    });
};

exports.list = function (req, res, next) {
    User.find({}, '-password -isAdmin', function (err, users) {
        if (err) {
            return next(err);
        }
        else {
            res.json(users);
        }
    });
};

exports.read = function (req, res) {
    var retVal = {"isMember": req.userDetails.isMember, "team": req.userDetails.team}
    res.json(retVal);
};

exports.userByID = function (req, res, next, id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        //Yes, it's a valid ObjectId, proceed with `findById` call.

        User.findOne({_id: id}, function (err, user) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                else if (!user) {
                    next("User does not exist");
                } else {
                    req.userDetails = user;
                    next();
                }
            }
        );
    } else if (id.match(/\S+@\S+\.\S+/)) {
        User.findOne({email: {$regex: new RegExp(id, "i")}}, function (err, user) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                else if (!user) {
                    next("User with email " + id + " does not exist");
                } else {
                    req.userDetails = user;
                    next();
                }
            }
        );
    } else {
        res.status(404).json("this is not a valid email");
    }

};

/*
check admin permission of current user
 */
exports.permissionCheck = function (req, res, next) {
    if (req.user) {
        User.findById(req.user._id, function (err, user) {
            if (err) {
                return next(err);
            } else if (user.isAdmin) {
                next();
            } else {
                res.status(401).redirect('/login');
            }
        })
    } else {
        res.status(401).redirect('/login');
    }

};

/*
update user, verify that it wont make itself admin!
 */
exports.update = function (req, res, next) {
    if (req.body.isAdmin) {
        req.body.isAdmin = false;
    }
    User.findByIdAndUpdate(req.userDetails._id, req.body, function (err, user) {
        if (err) {
            return next(err);
        }
        else {
            res.json({status: "ok"});
        }
    });
};


exports.delete = function (req, res, next) {
    req.user.remove(function (err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(req.user);
        }
    })
};

/*
check if user is loged in
 */
exports.logedIn = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

/*
check if registration is open via param schema
 */
exports.isRegistrationOpen = function (req, res, next) {
    Param.findOne({name: "users"}, function (err, param) {
        if (err) {
            return next(err);
        } else if (!param) {
            res.status(403).json({
                code: 14,
                status: "We have a general error, code 14. Please contact contact@datahack-il.com"
            })
        } else if (!param.isOpen) {
            res.redirect('/');
            //res.status(403).send("<h1>Participants Registration is now closed.</h1>");
        } else {
            next();
        }
    })
};

exports.userAgree = function (req, res, next) {
    if (req.params.userIdToUpdate) {
        if (req.params.userIdToUpdate.match(/^[0-9a-fA-F]{24}$/)) {
            //Yes, it's a valid ObjectId, proceed with `findById` call.
            User.findByIdAndUpdate({_id: req.params.userIdToUpdate}, {"accepted": true}, function (err, user) {
                if (err) {
                    res.status(500).send("<h4>We had an internal error, please try again or contact contact@datahack-il.com</h4>");
                }
                else if (!user) {
                    res.status(400).send("<h4>User token not found, please try again or contact contact@datahack-il.com</h4>")
                } else {
                    var msgToSend = "";
                    if (user.accepted) {
                        msgToSend = 'You have already RSVP\'d.';
                    } else {
                        msgToSend = "You have accepted the rules & RSVP'd for DataHack 2018!";
                        sendEmailRsvp(user.email, user.first_name, user.last_name);
                    }

                    res.render('rsvp', {
                        messages: req.flash('error') || req.flash('info'),
                        name: user.first_name,
                        email: user.email,
                        msg: msgToSend
                    });
                }

            });
            //invalid object token
        } else {
            res.status(400).send("<h4>User token not valid, please try again or contact contact@datahack-il.com</h4>")
        }
    } else {
        res.status(400).send("<h4>No user token was sent, please try again or contact contact@datahack-il.com</h4>")
    }
};
