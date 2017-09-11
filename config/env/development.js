var port = process.env.PORT || 8080;
var host = process.env.IP || '127.0.0.1';
module.exports = {
	port: port,
	host: host,
	db: process.env.MONGO_DB_URI,
	facebook: {
		clientID: 'facebookClientID',
		clientSecret: 'facebookClientSecret',
		callbackURL: 'http://localhost:'+ port +'/oauth/facebook/callback'
	},
	twitter: {
		clientID: 'twitterClientID',
		clientSecret: 'twitterClientSecret',
		callbackURL: 'http://localhost:'+ port +'/oauth/twitter/callback'
	}
};
