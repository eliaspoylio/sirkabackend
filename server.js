const express = require("express")
const mongoose = require("mongoose")
const app = express()
const authRoute = require('./routes/auth')
const favRoute = require('./routes/addfav')
//const env = require('../env-var');
var cors = require('cors')
require('dotenv').config();

dbURL =  process.env.DB_URI

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoute)
app.use('/api/fav', favRoute)


mongoose.connect(dbURL , {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

app.use(express.static(process.cwd()+"/dist/sirka/"));

app.get('/', (req,res) => {
    res.sendFile(process.cwd()+"/dist/sirka/index.html")
  });

//default
app.get('*', (req, res) => {
    res.status(200).json({ status: "Server up" })
});


db.on("error", (err)=>{console.error(err)})
db.once("open", () => {console.log("Connected to DB")})

app.listen(4201, () => {console.log("Server listening to port 4201")})



process.on('SIGINT', function(){
    mongoose.connection.close(function(){
      console.log("Db disconnected with Node termination");
       process.exit(0);
      })
})