const https = require('https')
const fs = require('fs');

require('dotenv').config()
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var config = require('./config/config'),
    mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    passport = require('./config/passport')

var db = mongoose(),
    app = express(),
    passport = passport()

app.use(require('helmet')());
 options = {
     cert: fs.readFileSync('./fullchain.pem'),
     key: fs.readFileSync('./privkey.pem'),
 }

app.listen(config.port);
https.createServer(options, app).listen(443)

module.exports = app
console.log(process.env.NODE_ENV + ' server running at http://' + config.host + ':' + config.port)
