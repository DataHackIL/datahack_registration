module.exports = function (app) {
    var index = require('../controllers/index.server.controller'),
        teams = require('../../app/controllers/teams.server.controller'),
        users = require('../../app/controllers/users.server.controller');
    app.route('/code-of-conduct')
        .get(index.renderCodeOfConduct)
    app.post('/code-of-conduct', users.sendConduct);
    app.get('/join-chat', index.redirectToWhatsapp);
    app.get('/team-up', teams.isTeamsOpen, index.render);
    app.get('/mingle', teams.isTeamsOpen, index.renderMingle);
    app.get('/timerFlag', index.isTimerOn);
};