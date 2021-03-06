var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {
	passport.use(new LocalStrategy(function(email, password, done) {
		User.findOne(
			{email: { $regex : new RegExp(email, "i") }},
			function(err, user) {
				if (err) {
					return done(err);
				}

				if (!user) {
					return done(null, false, {message: 'Unknown user'});
				}
				if (!user.authenticate(password)) {
					return done(null, false, {message: 'Invalid password. Please try again or contact us at contact@datahack-il.com'});
				}
				return done(null, user);
			}
		);
	}));
};