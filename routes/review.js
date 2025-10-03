const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const {
  reviewValidationSchema,
  loggedIn,
  isauthor,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

router.post(
  "/",
  loggedIn,
  reviewValidationSchema,
  wrapasync(reviewController.createReview)
);

router.delete(
  "/:id2",
  loggedIn,
  isauthor,
  wrapasync(reviewController.deleteReview)
);

module.exports = router;
