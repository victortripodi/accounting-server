const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//Connect to the database
async function databaseConnect(){
	let databaseURL = process.env.DATABASE_URL || 'mongodb://localhost:27017/accounting-server';

	await mongoose.connect(databaseURL);
	console.log("Database connecting completed!");
}

// Disconnect from database 
async function databaseClose(){
	await mongoose.connection.close();
	console.log("DB is disconnected!");
}

// Clear the database
async function databaseClear(){
	await mongoose.connection.db.dropDatabase();
}

module.exports = {
	databaseConnect,
	databaseClose,
	databaseClear
}