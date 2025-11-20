const express = require('express');
const router =express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { savedRedirectUrl } = require('../middleware.js');

const userController=require('../controlers/user.js');

router.get('/showusers', wrapAsync(async (req, res) => {
    try {
        const users = await User.find({});
        res.render('users/showusers.ejs', { users });
    } catch (err) {
        req.flash('error', 'Unable to fetch users');
        res.redirect('/listings');
    }
}));

router.route('/signup')
.get( (req,res) =>{
    res.render('users/signup.ejs');
})
.post( wrapAsync(userController.post));

router.route('/login')
.get( (req,res) =>{
    res.render('users/login.ejs');
})
.post(
    savedRedirectUrl,
    passport.authenticate('local',
    {failureRedirect:'/login', 
    failureFlash: true}) ,
    userController.login
    );

router.get('/logout', userController.logout); 

module.exports=router;