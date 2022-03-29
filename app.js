if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");
const mongoose = require("mongoose")
const User = require('./model/user')
const passport = require('passport')
const authRouter = require('./routes/auth')
const indexRouter = require('./routes/index')
const profileRouter = require('./routes/profile')
const storiesRouter = require('./routes/stories')
const session = require('express-session');
const MongoStore = require('connect-mongo')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


require('./config/passport')(passport)

//Google Auth
// const {OAuth2Client} = require('google-auth-library');
// const { urlencoded } = require("express");
// const CLIENT_ID = '332069194244-hpojqbl6qruoplfmp0ddgq9ochngphcn.apps.googleusercontent.com';
// const client = new OAuth2Client(CLIENT_ID);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/oAuth'" })
    // cookie: { secure: true }
  }))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname,'../client/public')))
// app.use(express.urlencoded({extended:true}))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../client/views"));
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json());
app.use(methodOverride('_method'))

mongoose.connect("mongodb://localhost/oAuth'")
const db = mongoose.connection
db.on('error',error=> console.error(error));
db.once('open',()=> console.log('connected to MongoDB'));

app.use(function (req,res,next){
  res.locals.user = req.user||null
  next()
})
app.get('/',(req,res)=>{
  res.render('index')
})
app.use('/',indexRouter)
app.use('/auth',authRouter)
app.use('/profile',profileRouter)
app.use('/stories',storiesRouter)
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
  });