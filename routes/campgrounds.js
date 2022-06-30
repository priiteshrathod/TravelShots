const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas');
const {isLoggedIn , isAuthor , validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn , upload.array('image'), validateCampground , catchAsync(campgrounds.createNewCg));

router.get('/new', isLoggedIn ,  campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCg))
    .put(isLoggedIn , isAuthor , upload.array('image') , validateCampground, catchAsync(campgrounds.updateCg))
    .delete(isLoggedIn, isAuthor , catchAsync(campgrounds.deleteCg));

router.get('/:id/edit' ,isLoggedIn , isAuthor , catchAsync(campgrounds.renderEditForm));

module.exports = router;