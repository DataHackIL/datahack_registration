module.exports = function(app) {
    var index = require('../controllers/index.server.controller'),
        teams = require('../../app/controllers/teams.server.controller');
    app.get('/code-of-conduct', index.renderCodeOfConduct);
    app.get('/team-up', teams.isTeamsOpen, index.render);
    app.get('/mingle', teams.isTeamsOpen, index.renderMingle);
    app.get('/timerFlag', index.isTimerOn);
};