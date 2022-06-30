const Campground = require('../models/campground');

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds});
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
};

module.exports.createNewCg = async (req,res,next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground data' , 400);
    const campground = new Campground(req.body.campground);
    campground.image = req.files.map(f => ({ url: f.path , filename: f.filename}));
    campground.author = req.user._id ;
    await campground.save();
    // console.log()
    req.flash('success' , 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCg = async (req,res,next) => {
    const cg = await Campground.findById(req.params.id).populate({
        path: 'reviews' ,
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(cg);
    if(!cg){
        req.flash('error' , 'Sorry! No such Campground exists!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show' , {cg});
};

module.exports.renderEditForm = async (req,res,next) => {
    const cg = await Campground.findById(req.params.id);
    if(!cg){
        req.flash('error' , 'Sorry! No such Campground exists!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit' , {cg});

};

module.exports.updateCg = async (req,res,next) => {
    const { id } = req.params;
    // console.log(req.body);
    const cg = await Campground.findByIdAndUpdate(id , {...req.body.campground});
    const imgs = req.files.map(f => ({ url: f.path , filename: f.filename}));
    cg.image.push(...imgs);
    await cg.save();
    req.flash('success' , 'Successfully Updated Campground!');
    res.redirect(`/campgrounds/${cg._id}`);
}

module.exports.deleteCg = async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success' , 'Successfully Deleted the Campground!');
    res.redirect('/campgrounds');
}