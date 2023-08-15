const express       = require("express");
const passport      = require("passport")
const config        = require("config")
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const User          = require('../models/userModel');
const {CheckUser,otpGenerator }    = require('../config/helperFn');
const sendOtpToEmail= require('../config/otpSenderFn');






// =================LOGIN AND REGISTER USER WITH GOOGLE OAUTH===========

const googleLoginCallBack= async (req, res)=>{

    
    const secret = config.get('secret_token');
    try {
        if(req.user){
            const currentUserDetail= req.user;
            const verifiedUser= CheckUser(req.user);
            if(verifiedUser){
                const verifiedUserId= verifiedUser._id;
                const accessToken= await jwt.sign(({verifiedUserId}), secret,{expiresIn: 420});         
                res.cookie('auth',accessToken,{maxAge:420000, httpOnly: true, sameSite: "lax"});
                res.status(200).render('profile',{currentUserDetail, loggedIn});
            }else{
                const verifiedUserId= req.user._id;
                const accessToken= await jwt.sign(({verifiedUserId}), secret,{expiresIn: 420});         
                res.cookie('auth',accessToken,{maxAge:420000, httpOnly: true, sameSite: "lax"});
                res.redirect('/customer/signup/complete');
            }
            
        }
    } catch (error) {
        console.log(error)
        res.redirect('/customer/login');
    }
   
    
}

module.exports={googleLoginCallBack}