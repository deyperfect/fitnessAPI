require("dotenv").config();

const express = require('express');
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const databaseURL = process.env.MONGODB;

// Routes
const userRoutes = require("./routes/userRoutes")
const workoutRoutes = require("./routes/workoutRoutes")
// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(databaseURL);
mongoose.connection.once("open", () => {
    console.log("Now connected to MongoDB Atlas.");
});

app.use("/users", userRoutes)
app.use("/workouts", workoutRoutes)

if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}
module.exports = { app, mongoose };


// REQUIREMENTS
/* 

workout model:
name
duration
dateAdded
status


register
email and password

retrieve user detalis


users to add, retrieve, update, delete workouts

*/