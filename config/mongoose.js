var config = require('./config'),
  mongoose = require('mongoose');

module.exports = function() {
	mongoose.set('debug', true);
  var db = mongoose.connect(config.db);

  require('../app/models/user.server.model');
  require('../app/models/team.server.model');

  return db;
};
