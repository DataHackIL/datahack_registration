var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport');
var AWS = require('aws-sdk')
var multer = require('multer');
var multerS3 = require('multer-s3')
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
var s3 = new AWS.S3({
	region: process.env.AWS_REGION,
  signatureVersion: 'v4'
});
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
    	console.log('Trying create key...');
      cb(null, req.body.email+"_"+file.originalname);
    }
  })
});
module.exports = function(app) {
	app.route('/users')
		.post(users.permissionCheck, users.isRegistrationOpen, users.create)
		.get(users.permissionCheck, users.list);
	app.route('/users/:userId')
		.get(users.logedIn, users.read)
		.put(users.permissionCheck, users.update)
		.delete(users.permissionCheck, users.delete);
	app.param('userId', users.userByID);
	app.route('/late')
		.get(users.isRegistrationOpen, users.renderRegister)
		.post(users.isRegistrationOpen, upload.single('cv'), users.register);
	app.route('/printUsers').get(users.permissionCheck, users.renderPrintUsers);
	app.route('/admin').get(users.permissionCheck, users.renderPrintUsers);
    app.route('/reset').get(users.permissionCheck, users.renderReset);
    app.route('/login')
		.get(users.renderLogin)
		.post(passport.authenticate('local', {
			successRedirect: '/team-up',
			failureRedirect: '/login',
			failureFlash: true
		}));
    app.route('/rsvp/:userIdToUpdate').get(users.userAgree);
	app.get('/logout', users.logout);
	app.post('/contactus', users.sendMail);
};
