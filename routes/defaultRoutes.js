const express = require('express');
const router = express.Router();
const passport = require('passport');


//dashboard get route
router.get('/dashboard', (req, res)=>{
    res.render('dashboard');
})

//signup route
router.get('/signup', (req, res)=>{
    res.render('signup', {message: req.flash('signupMessage')});
});

//signup post route, to process form
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup',
    failureFlash: true
}));

//login route
router.get('/login', (req, res)=>{
    res.render('login', {message: req.flash('loginMessage')});
});

//login post route, to process login form
// router.post('/login')




module.exports = router;
