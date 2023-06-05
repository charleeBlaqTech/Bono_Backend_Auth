const express           = require("express");
const exphbs            = require('express-handlebars')
const config            = require("config")
const mongoose          = require('mongoose')
const cors              = require('cors');
const bcrypt            = require('bcrypt');
const jwt               = require('jsonwebtoken');
const cookieParser      = require('cookie-parser');
const passport          = require("passport");
require('./config/passportAuth')(passport);
const session           = require("express-session");
// const MongoStore        = require('connect-mongo')(session)
const fileUpload        = require('express-fileupload');
const connectToDb       = require("./dbconnection/connectDB")
const homeRoutes        = require('./routes/homeRoutesRouter')



const port              = config.get('port');
const session_secret    = config.get('session_secret');
const app               = express();

// ===============MIDDLEWARES==========================
app.use(session({
  secret: session_secret,
  resave: false,
  saveUninitialized:false,
  cookie:{secure:true},
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(cors({
  credentials: true,
  origin: "*",
 
}));
app.use(passport.initialize());
app.use(fileUpload());


// =====template engine====
// TEMPLATE-ENGINE=HBS
app.engine("hbs",exphbs.engine({
  extname: ".hbs", defaultLayout: "main", runtimeOptions:{
      allowProtoMethodsByDefault: true, allowProtoPropertiesByDefault:true
  }
}))
app.set("view engine", "hbs")

// ==========Home routes are all routes that have / + route names=================
app.use('/', homeRoutes);



// =======================PORT FUCTION========================
// ======the app only start listening for requests after connecting to a database===============
app.listen(port, async()=>{
    await connectToDb();
    console.log(`listening on port: ${port}`)
})