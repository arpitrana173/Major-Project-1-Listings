const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const { loggedIn } = require("../middleware.js");
const { isowner } = require("../middleware.js");
const { validateSchema } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfigue.js")
const upload = multer({ storage })

router.get("/", wrapasync(listingController.index));

router.get("/new", loggedIn, listingController.renderNewForm);

router.get("/:id", wrapasync(listingController.showDetail));

router.post(
  "/newpost",
  loggedIn,
  upload.single("image"),
  validateSchema,
  wrapasync(listingController.newPost)
);

router.get(
  "/:id/edit",
  loggedIn,
  isowner,
  wrapasync(listingController.renderEditForm)
);

router.patch(
  "/:id",
  loggedIn,
  isowner,
  upload.single("image"),
  validateSchema,
  wrapasync(listingController.editListing)
);

router.delete(
  "/:id",
  loggedIn,
  isowner,
  wrapasync(listingController.deleteListing)
);

module.exports = router;
