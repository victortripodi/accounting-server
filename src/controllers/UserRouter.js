const express = require("express");
const { UserModel } = require("../models/UserModel");
const { comparePasswords, createJwt, decodeJwt } = require("../utils/authHelpers");
const router = express.Router();

// Get all users
router.get("/", async (request, response, next) => {

	let result = await UserModel.find({}).exec();

	response.json({
		message:"User router operation",
		result: result
	});
});

// Get user by ID
router.get("/findById/:id", async (request, response, next) => {

	let result = await UserModel.findById(request.params.id).exec();

	response.json({
		message:"User router operation",
		result: result
	});
});


router.post("/", async (request, response, next) => {
	console.log("User signup body is:");
	console.log(request.body);

	let result = await UserModel.create(request.body).catch(error => {
		error.status = 400;
		console.log("Error on creating a user", error);
		return error
	});


	let jwt = createJwt(result.__id);
	let decodedJwt = decodeJwt(jwt);

	if (result.errors) {
		return next(result);
	}

	response.json({
		message:"User router operation",
		result: result,
		jwt: jwt,
		decodedJwt
	});
});

router.patch("/findById/:id", async (request, response, next) => {

	let result = await UserModel.findByIdAndUpdate(
		request.params.id, 
		request.body,
		{
			returnDocument: "after"
		}
	);

	response.json({
		message:"User router operation",
		result: result
	});
});

router.delete("/", async (request, response, next) => {

	let result = await UserModel.findByIdAndDelete(request.body.id);

	response.json({
		message:"User router operation",
		result: result
	});
});



// Login route 
router.post("/jwt", async (request, response, next) => {
	let newJwt = "";

	if (!request.body.password || !request.body.email){
		return next(new Error("Missing login details in login request."));
	}

	// Find user by email in DB
	let foundUser = await UserModel.findOne({email: request.body.email}).exec();

	console.log(request.body, foundUser);

	// Compare request.body.password to foundUser.password using the compare function 
	let isPasswordCorrect = await comparePasswords(request.body.password, foundUser.password);


	// Create a JWT based on foundUser._id 
	if (isPasswordCorrect){

		newJwt = createJwt(foundUser._id);

		response.json({
			jwt: newJwt
		});
	} else {
		return next(new Error("Incorrect password."));
	}

	
})





module.exports = router;