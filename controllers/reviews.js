const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req,res) => {
    const cg = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    cg.reviews.push(review);
    await review.save();
    await cg.save();
    req.flash('success' , 'Created new review!');
    // console.log(cg);
    res.redirect(`/campgrounds/${cg._id}`);

};

module.exports.deleteReview = async (req,res) => {
    const {id , reviewId} = req.params;
    await Campground.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success' , 'Deleted the review!');
    res.redirect(`/campgrounds/${id}`);
};