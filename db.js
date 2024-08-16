const mongoose = require('mongoose');
require('dotenv').config();

// Define the Mongodb connnection in URL
const mongoURL = process.env.MONGODB_URL_local;


// setup mongodb connections
mongoose.connect(mongoURL, {
useNewUrlParser: true,
 useUnifiedTopology: true ,
})

//get the default connection 
//Mongoose maintains a default connection object representing the Mongodb connection 

const db = mongoose.connection;

//define event listeners for database connection
db.on('error', (err) =>{ 
    console.log('MongoDB connection error:',err);
});
db.on('connected', () =>{ 
    console.log('Connected to MongoDB Server');
});
db.on('disconnected', () =>{ 
    console.log('MongoDB disconnected');
});

// export the database connection

module.exports = db;



