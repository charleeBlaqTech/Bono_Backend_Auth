const express           = require("express");
const router            = express.Router();
const homeControllers   = require('../controllers/homeControllers')
const authorizeUser     = require("../middlewares/authUsers")










//welcome note===============
router.get('/', homeControllers.homeResponse)

// ============USER SIGNUP WITH FORM DATA, COOKIE-PARSER AND JWT===========

// =================POST ROUTE TO LOGIN USER WITH FORM DATA==============
router.route('/login').get(homeControllers.loginPage).post(homeControllers.loginUser);

// =================POST ROUTE TO SIGNUP USER WITH FORM DATA=============
router.route('/signup').get(homeControllers.signupPage).post(homeControllers.registerUser);

// =================POST route for completing SIGNUP PROCESS=============
router.route('/verify-otp').get(homeControllers.otpVerificationPage).post(homeControllers.verifyOtp)

router.route('/signup/complete/:id?').get(homeControllers.completeRegistrationPage).post(authorizeUser,homeControllers.completeRegistration)

// =================POST ROUTE TO UPDATE USER PASSWORD WITH FORM DATA====
router.route('/password/new/:id?').get(authorizeUser,homeControllers.newPasswordPage).post(authorizeUser,homeControllers.resetPassword);

// =================Get ROUTE TO LOGOUT USER=============================
router.get('/logout',authorizeUser,homeControllers.logoutUser);






module.exports= router;