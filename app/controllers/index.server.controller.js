var Team = require('mongoose').model('Team');
var Param = require('mongoose').model('Param');
var debug = require('debug')('registration:controllers:index')

/**
 * This function renders the main page of the platform -
 * pass relevant objects according to user status (has team, has team and team admin, no team)
 */
exports.render = function(req, res) {
    if (req.user){
        if (req.user.isMember){
            Team.findOne({_id:req.user.team},function(err,team){
               if (err){
                   res.render('index', {
                       user: req.user
                   });
               } else{
                   var index = team.members.indexOf(team.admin_email);
                   team.members.splice(index, 1);
                   res.render('index', {
                       user: req.user,
                       team: team
                   });
               }
            });
        }else{
            res.render('index', {
                user: req.user
            });
        }
    }else{
        res.render('index', {
            user: '',
            messages: req.flash('error')
        })
    }

};
/**
 * this function renders the mingle page which is the page showing open teams which are looking for members
 */
exports.renderMingle = function(req, res) {
    if (req.user){
        Team.find({isClosed:false},function(err, teams){
            shuffle(teams);
            res.render('mingle',{
                user:req.user,
                teams: teams
            });
        });
    }else{
        return res.redirect('/team-up');
    }

};

exports.renderCodeOfConduct = function (req, res) {
    res.render('codeOfConduct')
};

exports.renderGear = function (req, res) {
    res.render('gear')
};

exports.redirectToWhatsapp = function (req, res) {
    res.redirect('https://chat.whatsapp.com/FcVj6qaK9qzJQfVILrRMMJ')
};
/*
This function checks in parameter schema if the timer is on
 */
exports.isTimerOn = function (req, res, next) {
    Param.find({name:"timer"},function(err, param){
        if (err) {
            return next(err);
        }else if(!param){
            res.status(403).send("close")
        }else if (!param.isOpen){
            res.status(200).send("close")
        }else{
            res.status(200).send("on")
        }
    })
};

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}
