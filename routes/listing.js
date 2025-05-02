const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/warpAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
    .route("/")
    .get(wrapAsync(listingController.index)) 
    .post(
        isLoggedIn ,
        upload.single('listing[image]') ,
        validateListing , 
        wrapAsync(listingController.Create)
    ); 

//New Route
router.get("/new", isLoggedIn ,wrapAsync(listingController.New));

router
    .route("/:id")
    .get(wrapAsync(listingController.Show)) //Show Route 
    .put(
        isLoggedIn, 
        isOwner ,
        upload.single('listing[image]') ,
        validateListing ,
        wrapAsync(listingController.update)
    ) //Update Route 
    .delete(isLoggedIn, isOwner , wrapAsync(listingController.delete)); //Delete Route

//Edit Route 
router.get("/:id/edit", isLoggedIn, isOwner ,wrapAsync(listingController.Edit));

module.exports = router;
