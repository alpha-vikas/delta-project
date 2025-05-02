const express = require("express");
const router = express.Router({mergeParams: true });
const wrapAsync = require("../utils/warpAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Reviews POST ROUTE 
router.post("/", isLoggedIn ,validateReview , wrapAsync(reviewController.createReview));

//Reviews DELETE ROUTE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor , wrapAsync(reviewController.deleteReview));

module.exports = router;