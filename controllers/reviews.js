const listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let { comment, rating } = req.body;
  let item = await listing.findById(id);
  let newreview = new review({
    comment,
    rating,
  });
  newreview.author = req.user._id;
  await newreview.save();
  item.review.push(newreview._id);
  await item.save();
  req.flash("success", "Your Review Added");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id } = req.params;
  let { id2 } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { review: id2 } });
  await review.findByIdAndDelete(id2);
  req.flash("success", "Your Review Deleted");
  res.redirect(`/listing/${id}`);
};
