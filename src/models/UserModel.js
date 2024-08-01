const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
	_id: { type: Schema.ObjectId, auto: true },
	email: {
		type: String,
		required: true,
		unique: true
	},

	password: {
		type: String, 
		required: true, 
		unique: false
	},
	name: {
		type: String,
		required: true
	},
	abn: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	postcode: {
		type: String,
		required: true

	}
	
});


userSchema.pre(
	"save",
	async function (next) { 
		const user = this;
		console.log("Pre-save hook running.");

		if (!user.isModified("password")){
			return next();
		}

		console.log("Pre-save hook runnin and password is modified!");
		// if we reach this line of code, the password is modified
		// and thus is not encrypted!
		// we must encrypt it!

		console.log("Raw password is: " + this.password);
		
		const hash = await bcrypt.hash(this.password, 10);

		console.log("Hashed and encrypted and salted password is: " + hash)

		this.password = hash;

		next();
	}
)



const UserModel = mongoose.model("User", userSchema);

module.exports = {
	UserModel
}