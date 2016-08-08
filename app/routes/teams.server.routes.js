var teams = require('../../app/controllers/teams.server.controller'),
	users = require('../../app/controllers/users.server.controller'),
	passport = require('passport');

module.exports = function(app) {
	app.route('/teams')
		.post(teams.isTeamsOpen, teams.logedIn, teams.verifyUserPermissionOnCDTeam, teams.preVerifyTeamCreate,teams.preVerifyNewTeamMembers, teams.create,teams.updateNewTeamMembers)
		.get(teams.logedIn, users.permissionCheck, teams.list);

	app.route('/teams/:teamId').get(teams.isTeamsOpen, teams.logedIn,users.permissionCheck, teams.read)
		.put(teams.isTeamsOpen, teams.logedIn,teams.verifyUserPermissionOnUpdateTeam, teams.preVerifyNewTeamMembers, teams.update, teams.updateUserMembership)
		.delete(teams.isTeamsOpen, teams.logedIn, teams.verifyUserPermissionOnCDTeam, teams.updateRelatedMembers, teams.delete);

	app.route('/createTeam').get(teams.isTeamsOpen, teams.logedIn, teams.createTeamPage);
	app.route('/updateTeam').get(teams.isTeamsOpen, teams.logedIn, teams.createUpdateTeamPage);
	app.route('/myTeam').get(teams.isTeamsOpen, teams.logedIn, teams.createMyTeamPage);

	app.param('teamId', teams.teamByID);

};