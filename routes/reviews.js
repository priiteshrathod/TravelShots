const express = require('express');
const router = express.Router({mergeParams: true});

const Campground = require('../models/campground');
const Review = require('../models/review');

const {isLoggedIn , validateReview , isReviewAuthor} = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');

const reviews = require('../controllers/reviews');

router.post('/' , validateReview , isLoggedIn ,  catchAsync(reviews.createReview));

router.delete('/:reviewId' , isLoggedIn ,isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;