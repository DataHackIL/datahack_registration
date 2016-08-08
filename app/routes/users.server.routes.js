var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport');

module.exports = function(app) {
	app.route('/users')
		.post(users.permissionCheck,users.isRegistrationOpen, users.create)
		.get(users.permissionCheck, users.list);

	app.route('/users/:userId')
		.get(users.logedIn, users.read)
		.put(users.permissionCheck, users.update)
		.delete(users.permissionCheck, users.delete);
	app.param('userId', users.userByID);

	app.route('/register')
		.get(users.isRegistrationOpen, users.renderRegister)
		.post(users.isRegistrationOpen, users.register);

	app.route('/printUsers').get(users.permissionCheck,users.renderPrintUsers);


	app.route('/login')
		.get(users.renderLogin)
		.post(passport.authenticate('local', {
			successRedirect: '/team-up',
			failureRedirect: '/login',
			failureFlash: true
		}));

	app.route('/rsvp/:userIdToUpdate').get(users.userAgree);

	app.route('/reset').get(users.permissionCheck, users.renderReset)

	app.get('/logout', users.logout);

	app.post('/contactus', users.sendMail)
};