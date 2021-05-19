const express = require('express');
const mongoose = require("mongoose")
const app = express();
const authRoute = require('./routes/auth')
const favRoute = require('./routes/addfav')
var cors = require('cors');

app.use(
    cors({
        credentials: true,
        origin: true
    })
);
app.options('*', cors());

dbURL =  process.env.DB_URI

app.use(express.json())
app.use('/api/auth', authRoute)
app.use('/api/fav', favRoute)


mongoose.connect(dbURL , {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on("error", (err)=>{console.error(err)})
db.once("open", () => {console.log("Connected to DB")})

app.get('/', (req, res) => res.send('Working!!!'));

app.listen(process.env.PORT || 3000, function() {
    console.log('server running on port 3000', '');
});

process.on('SIGINT', function(){
    mongoose.connection.close(function(){
      console.log("Db disconnected with Node termination");
       process.exit(0);
      })
})