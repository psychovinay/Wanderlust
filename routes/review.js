const express = require('express');
const router =express.Router({mergeParams:true});
const Listing = require('../models/listing');
const wrapAsync=require('../utils/wrapAsync.js')
const Review = require('../models/review.js');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware.js')

const reviewController=require('../controlers/review.js');

//post route
router.post('/',isLoggedIn,validateReview, wrapAsync(reviewController.post));

//delete route
router.delete('/:reviewId',
  isLoggedIn,
  isReviewAuthor,
   wrapAsync(reviewController.delete));


module.exports=router;