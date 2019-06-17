var config = require('./config'),
    mongoose = require('mongoose')

module.exports = function () {
    mongoose.set('debug', true)
    var db = mongoose.connect(config.db, {dbName: 'test'})
        .then(() => {
            console.log('mongoDB connections established successfully')
        }).catch((error) => {
            console.log('mongoDB connection failed:', error)
        })
    require('../app/models/user.server.model')
    require('../app/models/team.server.model')

    return db
}
