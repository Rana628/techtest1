
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/router.js');
const { default: mongoose } = require('mongoose');
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect("mongodb://mongo:AtVEibLkzNbOSzpdHiWsThXGgpqrxfCS@gondola.proxy.rlwy.net:17361")
 .then( () => console.log("MongoDb is connected"))
 .catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 8080, function () {
    console.log('Express app running on port ' + (process.env.PORT || 8080))
});