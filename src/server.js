const express = require("express");
const userRouter = require("./controllers/UserRouter.js");
const accountRouter = require("./controllers/AccountRouter");
// const journalRouter = require("./controllers/JournalRouter.js");



const app = express();
// const cors = require("cors");

// Allows POST requests to have JSON body content
app.use(express.json());

// app.use(cors());

app.get("/", (request, response, next) => {
	response.json({
		message: "Hello world!"
	});
});

// Use the user router
app.use("/users", userRouter);
// Use the account router
app.use("/accounts", accountRouter);
// Use the journal router
// app.use("/journal", journalRouter);


app.get("*", (request, response, next) => {
	response.status(404).json({
		message:"404 Page not found."
	});
});


app.use((error, request, response, next) => {
	response.status(error.status || 500).json({
		message: "Error occured!",
		error: error.message
	});
});


module.exports = {
	app
}