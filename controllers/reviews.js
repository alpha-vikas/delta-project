const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);

    // When form will get submitted it will send reviews and comments object name="review[rating]" name="review[comment]" 
    let newReview = new Reviews(req.body.review); //Extract it review object from request body 
    newReview.author = req.user._id;
    listing.reviews.push(newReview);  //Push it to in listings review array  

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Reviews.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}