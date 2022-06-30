const User = require('../models/user');

module.exports.renderRegisterForm = (req,res) => {
    res.render('users/register');
};

module.exports.registerNewUser = async (req,res) => {
    try{
    const {email , username , password} = req.body;
    const user = new User({email , username});
    const registeredUser = await User.register(user , password);
    req.login(registeredUser , e => {
        if(e) return next(e);
        req.flash('success' , 'Welcome to Yelp-Camp!');
        res.redirect('/campgrounds');
    })
    } catch(e) {
        req.flash('error' , e.message);
        res.redirect('/register');
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render('users/login');
};

module.exports.login = (req,res) => {
    req.flash('success' , 'Welcome back!');
    // console.log(req.session);
    // console.dir(req);
    const redirectUrl = req.session.returnTo || '/campgrounds' ; 
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res) => {
    req.logout( (e) => {
        if(e) return next(e);

        req.flash('success' , 'GoodBye! See you soon again!');
        res.redirect('/campgrounds');
    });
    
};