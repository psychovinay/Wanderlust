const express = require('express');
const router =express.Router();
const Listing = require('../models/listing');
const wrapAsync=require('../utils/wrapAsync');
const {isLoggedIn, isOwner,validateListing}=require('../middleware.js')
const multer = require('multer');
const { storage } = require('../cloudCofig.js');
const upload = multer({storage});

const listingController=require('../controlers/listings.js');

router.route('/')
.get(wrapAsync(listingController.index))
.post(
isLoggedIn,
upload.single('listing[image]'),
validateListing,
wrapAsync(listingController.post ));


//new route
router.get('/new',isLoggedIn,listingController.new);

router.route('/:id')
.get( wrapAsync(listingController.show))
.put(isLoggedIn, isOwner,
   upload.single('listing[image]'),
   validateListing,
   wrapAsync(listingController.update ))
.delete(isLoggedIn,isOwner, 
wrapAsync(listingController.delete));

//edit route
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingController.edit));


module.exports=router;