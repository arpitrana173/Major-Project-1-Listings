if(process.env.NODE_ENV != "production"){ //isse production me env nhi jayengi which is imp
  require('dotenv').config()
}
console.log(process.env)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport")
const passportLocal= require("passport-local")
const user = require("./models/user.js")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const MongoStore = require('connect-mongo');

// ______________________________________________________________________________________
const mongoURL="mongodb://127.0.0.1:27017/Project1"
const atlasURL=process.env.MONGO_URL
async function main() {
  await mongoose.connect(atlasURL);
  // await mongoose.connect(mongoURL);
}
main()
  .then((res) => {
    console.log("Connection Established");
  })
  .catch((err) => {
    console.log(err);
  });
// ______________________________________________________________________________________

// use middleware -> Ek bi Middleware ko Routes me nhi bheja
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);

const mystore = MongoStore.create({
  mongoUrl : atlasURL,
  crypto : {
    secret : process.env.CRYPTO_SESSION_SECRET // session me bi same use h
  },
  touchAfter : 24*3600,
})
mystore.on("error",()=>{
  console.log("Error In Mongo Session Store", err)
})

app.use(
  session({
    store : mystore,
    secret: process.env.CRYPTO_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires:Date.now() + 1000*60*60*24*3,
      maxAge: 1000*60*60*24*3,
      httpOnly : true,
    }
  })
);
// Passport Session Ko use Krta h ... Isliye Hmesa Session ke bad Bnega
passport.initialize()
app.use(passport.session())
passport.use(new passportLocal(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.use(flash()) // YE [app.use(flash())] ROUTES SE PHELE LIKHA JATA H
app.use((req,res,next)=>{
  res.locals.IAMsucces = req.flash("success")
  res.locals.IAMerror = req.flash("error")
  res.locals.userLogged = req.user
  next()
})
app.use("/listing", listingsRouter);
app.use("/listing/:id/review", reviewsRouter);
app.use("/", usersRouter);

app.all(/.*/, (req, res, next) => {
  console.log("app.all");
  next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  console.log("I am error Handler");
  console.log(err);
  let { status = 500, message = "Something went Wrong" } = err;
  res.render("Error", { status, message });
});

// ______________________________________________________________________________________
const port = 3000;
app.listen(port, () => {
  console.clear();
  console.log(`Serve Is Started, Port Is ${port}`);
});