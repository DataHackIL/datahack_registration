var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		trim: true,
		unique: true,
		required: 'Email address is required',
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
	},
	phone: String,
	age: String,
	degree: String,
	student: {type :Boolean, default: false},
	field: String,
	institution: String,
	teamstatus: String,
	gender: String,
	shirttype: String,
	shirtsize: String,
	food: String,
	sleep: String,
	hacker: {type :Boolean, default: false},
	class: String,
	transport: String,
	bus: {type :Boolean, default: false},
	tags: Object,
	regDate: String,
	mailOk: {type :Boolean, default: true},
	accepted: {type :Boolean, default: false},
	isMember: {type :Boolean, default: false},
	isAdmin:{type: Boolean, default: false},
	team: {type :String, default: ''},
	password: String,
	provider: String,
	providerId: String,
	providerData: {}

});

UserSchema.static('findByEmail', function (email, callback) {
	return this.findOne({ email: email }, callback);
});

UserSchema.pre('save',
	function(next) {
		if (this.password) {
			var md5 = crypto.createHash('md5');
			this.password = md5.update(this.password).digest('hex');
		}

		next();
	}
);

UserSchema.pre('findOneAndUpdate', function(next) {
	if (this._update.password){
		var md5 = crypto.createHash('md5');
		this._update.password = md5.update(this._update.password).digest('hex');
	}
	next();
});

UserSchema.methods.authenticate = function(password) {
	var md5 = crypto.createHash('md5');
	md5 = md5.update(password).digest('hex');

	return this.password === md5;
};

UserSchema.statics.findUniqueUsername = function(email, suffix, callback) {
	var _this = this;
	var possibleEmail = email + (suffix || '');

	_this.findOne(
		{email: possibleEmail},
		function(err, user) {
			if (!err) {
				if (!user) {
					callback(possibleEmail);
				}
				else {
					return _this.findUniqueUsername(email, (suffix || 0) + 1, callback);
				}
			}
			else {
				callback(null);
			}
		}
	);
};

mongoose.model('User', UserSchema);