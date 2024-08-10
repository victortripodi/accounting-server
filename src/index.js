// Run the server
const { app } = require("./server.js");
const { databaseConnect } = require("./utils/database.js");

const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
	console.log("Server successfully started!", { PORT});

	// After server succesfully starts, connect to the database 
	databaseConnect();
});