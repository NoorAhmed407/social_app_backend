const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config()

//Initialize Express app
const app = express();

//Initialize Cors
app.use(cors());

//Parsing Incoming JSON requests to req.body
app.use(express.json());

//Connect to MongoDB
mongoose.connect(
    process.env.DB_URL,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    },
  () => console.log("Successfully Connected to Database!"),
  (e) => console.log("Error", e)
);

//Initialize Routes.
app.use('/api/auth', require('./Controllers/AuthController'));



//error handling middleware
app.use((err, req, res, next) => {
  res.send(err.message);
});

const PORT = process.env.PORT;
app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
