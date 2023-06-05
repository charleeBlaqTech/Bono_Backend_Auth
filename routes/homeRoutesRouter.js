const express           = require("express");
const router            = express.Router();
const homeControllers   = require('../controllers/homeControllers')
const passport          = require("passport")
const config            = require("config")
const jwt               = require('jsonwebtoken');
const authorizeUser     = require("../middlewares/authUsers")




// ============USER SIGNUP WITH FORM DATA, COOKIE-PARSER AND JWT===========
router.get('/login',(req, res)=>{
    res.render('login')
});
router.get('/signup',(req, res)=>{
    res.render('signup')
});
router.get('/home',authorizeUser,(req, res)=>{
    const userEmail= req.user.email;
    res.render('home',{userEmail})
});
router.get('/admin',authorizeUser,(req, res)=>{

    const userEmail= req.user.email;
    res.render('dashboard')
});




// =================POST ROUTE TO LOGIN USER WITH FORM DATA==============
router.post('/login',homeControllers.loginUser);

// =================POST ROUTE TO SIGNUP USER WITH FORM DATA=============
router.post('/signup',homeControllers.registerUser);

// =================POST route for completing SIGNUP PROCESS=============
router.route('/signup/complete').get(authorizeUser,homeControllers.completeRegistrationPage).post(authorizeUser,homeControllers.completeRegistration)

// =================POST ROUTE TO UPDATE USER PASSWORD WITH FORM DATA====
router.post('/password/new',authorizeUser,homeControllers.resetPassword);


// =================Get ROUTE TO LOGOUT USER=============================
router.get('/logout',homeControllers.logoutUser);

// =========== SIGNUP ROUTE TO GOOGLE API==========================================
router.get('/auth/google', passport.authenticate('google',{scope: ['email', 'profile']}));

// ============Google AUTH CALL BACK ROUTE with user data======================================
router.get('/auth/google/callback', passport.authenticate('google'), homeControllers.googleLoginCallBack);






module.exports= router;