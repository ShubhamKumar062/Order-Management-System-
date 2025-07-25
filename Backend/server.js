require("dotenv").config()
const express = require("express")
const connectedDB = require("./config/db")
const app = express()

app.use(express.json())

const PORT=process.env.PORT
connectedDB.then(() =>{
app.listen(() =>{
    console.log(`Server is Started at ${PORT}`)
})
})
.catch((err) =>console.log(err))
