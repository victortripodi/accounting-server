const express = require("express");
const userRouter = require("./controllers/UserRouter.js");
const accountRouter = require("./controllers/AccountRouter");
const journalRouter = require("./controllers/JournalRouter.js");
const entityRouter = require("./controllers/EntityRouter.js");
const salesRouter = require("./controllers/SalesRouter.js");
const expensesRouter = require("./controllers/ExpensesRouter.js");




const app = express();
const cors = require("cors");

// Allows POST requests to have JSON body content
app.use(express.json());

// app.use(cors({ 
//     credentials: true, 
//     origin: 'https://accountingvt.netlify.app',
// }));

app.use(cors());

app.get("/", (request, response, next) => {
	response.json({
		message: "Hello world!"
	});
});

// Use Routers
app.use("/users", userRouter);
app.use("/accounts", accountRouter);
app.use("/journal", journalRouter);
app.use("/entity", entityRouter);
app.use("/sales", salesRouter);
app.use("/expenses", expensesRouter);



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