const express           = require("express");
const router            = express.Router();
const homeControllers   = require('../controllers/homeControllers')
const passport          = require("passport")
const config            = require("config")
const jwt               = require('jsonwebtoken');
const authorizeUser     = require("../middlewares/authUsers")










//welcome note===============
router.get('/', homeControllers.homeResponse)


// ============USER SIGNUP WITH FORM DATA, COOKIE-PARSER AND JWT===========

// =================POST ROUTE TO LOGIN USER WITH FORM DATA==============
router.route('/login').get(homeControllers.loginPage).post(homeControllers.loginUser);

// =================POST ROUTE TO SIGNUP USER WITH FORM DATA=============
router.route('/signup').get(homeControllers.signupPage).post(homeControllers.registerUser);

// =================POST route for completing SIGNUP PROCESS=============
router.route('/verify').get(homeControllers.otpVerificationPage).post(homeControllers.verifyOtp)

router.route('/signup/complete').get(authorizeUser,homeControllers.completeRegistrationPage).post(authorizeUser,homeControllers.completeRegistration)

// =================POST ROUTE TO UPDATE USER PASSWORD WITH FORM DATA====
router.route('/password/new').get(authorizeUser,homeControllers.newPasswordPage).post(authorizeUser,homeControllers.resetPassword);

// =================Get ROUTE TO LOGOUT USER=============================
router.get('/logout',authorizeUser,homeControllers.logoutUser);

// =========== SIGNUP ROUTE TO GOOGLE API==========================================
router.get('/auth/google', passport.authenticate('google',{scope: ['email', 'profile']}));

// ============Google AUTH CALL BACK ROUTE with user data======================================
router.get('/auth/google/callback', passport.authenticate('google'), homeControllers.googleLoginCallBack);






module.exports= router;