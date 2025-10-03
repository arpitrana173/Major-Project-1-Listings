const listing = require("./models/listing.js");
const review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./serverSchmaValidation.js");
const { reviewSchema } = require("./serverSchmaValidation.js");

let loggedIn = function(req,res,next){
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl
    req.flash("error", "Please Login to add Post");
    return res.redirect("/login");
  }
  next()
};
// module.exports=loggedIn
// dono ko ek object me daalke export krna pdega , tabhi aur sirf tabbhi dono 
// work krenge

let saveRedirectedUrl = function(req,res,next){
    res.locals.redirectUrl = req.session.redirectUrl
    next()
}


let isowner = async function(req, res, next){
    let {id} = req.params
    let thisListing = await listing.findById(id)
    if(!thisListing.owner._id.equals(res.locals.userLogged._id)){
        req.flash("error","You are not owner of this Hotel")
        return res.redirect(`/listing/${id}`)
    }
    next()
}

const validateSchema = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

const reviewValidationSchema = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

let isauthor = async function(req, res, next){
    let {id} = req.params
    let {id2} = req.params
    let thisReview = await review.findById(id2)
    if(!thisReview.author._id.equals(res.locals.userLogged._id)){
        req.flash("error","You are not author of this Review")
        return res.redirect(`/listing/${id}`)
    }
    next()
}

module.exports = { saveRedirectedUrl, loggedIn, isowner, validateSchema, reviewValidationSchema, isauthor}

// Kyun saveRedirectedUrl aur loggedIn ko ek object me export karte hain?
// Node.js/Express me module.exports sirf ek hi cheez export kar sakta hai.
// Agar tum do alag-alag module.exports = ... likh doge, to last one overwrite ho jayega.
// Matlab pehla export chala jayega, aur dusra hi module me available hoga.