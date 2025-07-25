const mongoose = require("mongoose");

const connectedDB = mongoose.connect("mongodb://localhost:27017/")
        .then(() => console.log("MongoDb is Connected"))
        .catch((error) => console.log("Error in MongoDb Connection",error))

module.exports =  connectedDB;