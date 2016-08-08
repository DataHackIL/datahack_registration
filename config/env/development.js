var port = process.env.PORT || 8080;
var host = process.env.IP || '127.0.0.1';
module.exports = {
	port: port,
	host: host,
	db: '***REMOVED***',
	facebook: {
		clientID: '***REMOVED***',
		clientSecret: '***REMOVED***',
		callbackURL: 'http://localhost:'+ port +'/oauth/facebook/callback'
	},
	twitter: {
		clientID: '***REMOVED***',
		clientSecret: '***REMOVED***',
		callbackURL: 'http://localhost:'+ port +'/oauth/twitter/callback'
	}
};