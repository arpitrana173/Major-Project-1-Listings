const listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  let objectArray = [];
  objectArray = await listing.find({});
  res.render("home2", { objectArray });
};

module.exports.renderNewForm = (req, res) => {
  res.render("newform2");
};

module.exports.newPost = async (req, res) => {
  // See Comment 1 ->
  let url = req.file.path;
  let filename = req.file.filename;
  let { title, description, price, country, location } = req.body;
  let newlist = new listing({
    title,
    description,
    price,
    country,
    location,
  });
  newlist.image = { filename, url };
  newlist.owner = req.user._id;
  await newlist.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listing");
};

module.exports.showDetail = async (req, res) => {
  let { id } = req.params;
  let item = await listing
    .findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!item) {
    req.flash("error", "Listing Doesn't Exist");
    return res.redirect("/listing");
  }
  res.render("detail2", { item });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let item = await listing.findById(id);
  if (!item) {
    req.flash("error", "Listing Doesn't Exist");
    return res.redirect("/listing");
  }
  let orgImageUrl = item.image.url
  orgImageUrl.replace("/upload","/upload/h_300,w_200")
  res.render("editform2", { item,orgImageUrl });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let { title, description, price, country, location } = req.body;
  let editedListing = await listing.findByIdAndUpdate(id, {
    title: title,
    description: description,
    price: price,
    country: country,
    location: location,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    editedListing.image = { filename, url };
    await editedListing.save();
  }
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listing");
};

// Comment 1 ->
//   if (!req.body || Object.keys(req.body).length === 0) {
//     throw new ExpressError(400, "Send Valid Data");
//   }
/* Object.keys(req.body)
Object.keys(obj) is a built-in JavaScript method that returns an array of all the 
property names (keys) of an object.
Example:
const obj = { name: "Arpit", age: 20 };
console.log(Object.keys(obj)); // ["name", "age"]
If the object has no properties, it returns an empty array:
const obj = {};
console.log(Object.keys(obj)); // []
.length gives the number of elements in an array.
So Object.keys(obj).length tells you how many keys (properties) the object has.
Object.keys(req.body).length === 0
req.body is the object Express creates from your POST/PUT request body.
Object.keys(req.body).length === 0 checks if req.body is empty, meaning 
the client sent no data at all.
Example:
app.post("/test", (req, res) => {
  console.log(req.body); // {} if empty
  if (Object.keys(req.body).length === 0) {
    return res.send("Body is empty!");
  }
  res.send("Body has data!");
});
If you send an empty POST request, req.body is {}, so Object.keys(req.body).length is 0.
✅ This is why it’s used to detect empty request bodies safely before trying to 
destructure or validate fields. */
