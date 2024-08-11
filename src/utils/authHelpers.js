const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();


// Compare raw password to encrypted password
async function comparePasswords(plaintextPassword, encryptedPassword) {
	let doesPasswordMatch = false;
	doesPasswordMatch = await bcrypt.compare(plaintextPassword, encryptedPassword);
	return doesPasswordMatch;
}

// Create a JWT 
function createJwt(userId) {
	let newJwt = jwt.sign(
		// Payload of data
		{ id: userId },

		// Secret key for JWT signature
		process.env.JWT_KEY,

		// Options for JWT expiry
		{
			expiresIn: "7d"
		}
	);

	return newJwt;
}


function decodeJwt(jwtToDecode) {
	let decodedData = jwt.verify(jwtToDecode, process.env.JWT_KEY)
	return decodedData;
}

function validateJwt(req, res, next) {
	const token = req.header("Authorization");

	if (!token) {
		return res.status(401).json({ message: "Access denied. No token provided." });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userId = decoded.id; // Set the decoded JWT payload to req.user
		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		console.log("error", error)
		res.status(401).json({ message: "Invalid token." });
	}
}



module.exports = {
	comparePasswords,
	createJwt,
	validateJwt,
	decodeJwt
}