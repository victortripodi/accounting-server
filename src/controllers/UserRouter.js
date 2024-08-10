const express = require("express");
const { UserModel } = require("../models/UserModel");
const { comparePasswords, createJwt, decodeJwt } = require("../utils/authHelpers");
const router = express.Router();


router.post("/", async (request, response, next) => {
	console.log("User signup");

	let result = await UserModel.create(request.body).catch(error => {
		error.status = 400;
		console.log("Error on creating a user", error);
		return error
	});


	let jwt = createJwt(result._id);
	let decodedJwt = decodeJwt(jwt);

	if (result.errors) {
		return next(result);
	}

	console.log("User created");
	response.json({
		message: "User router operation",
		result: result,
		jwt: jwt,
		decodedJwt
	});
});


// Login route 
router.post("/jwt", async (request, response, next) => {

	if (!request.body.password || !request.body.email) {
		console.log("Test error")
		return next(new Error("Missing login details in login request."));
	}

	// Find user by email in DB
	let foundUser = await UserModel.findOne({ email: request.body.email }).exec();

	// Compare request.body.password to foundUser.password using the compare function 
	let isPasswordCorrect = await comparePasswords(request.body.password, foundUser.password);

	// Create a JWT based on foundUser._id 
	if (isPasswordCorrect) {

		let newJwt = "";
		newJwt = createJwt(foundUser._id);
		response.json({
			jwt: newJwt
		});
	} else {
		return next(new Error("Incorrect password."));
	}
})





module.exports = router;