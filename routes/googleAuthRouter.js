const express           = require("express");
const router            = express.Router();
const googleAuthControllers   = require('../controllers/googleAuthController')
const passport          = require("passport")
const config            = require("config")
const jwt               = require('jsonwebtoken');
const authorizeUser     = require("../middlewares/authUsers")


// =========== SIGNUP ROUTE TO GOOGLE API==========================================
router.get('/google', passport.authenticate('google',{scope: ['email', 'profile']}));

// ============Google AUTH CALL BACK ROUTE with user data======================================
router.get('/google/callback', passport.authenticate('google',{failureRedirect: '/customer/login'}), googleAuthControllers.googleLoginCallBack);





module.exports= router;
