const express       = require("express");
const config        = require("config")
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const User          = require('../models/userModel');
const CheckUser     = require('../config/helperFn')




const authorized= async (req, res, next)=>{

    const secret = config.get('secret_token');

   if(req.cookies.auth){
    const {verifiedUserId}= await jwt.verify(req.cookies.auth, secret);
    const userDetails= await User.findById({_id: verifiedUserId});
        if(userDetails){
            req.user = userDetails;
            next()
        }else{
            res.status(403).json({message: "unauthorized"})
        }
    
   }else{
        res.status(404).json({message: "unauthorized"})
    }
   
}
const authenticateUser= async (req, res, next)=>{

    const secret = config.get('secret_token');
   if(req.cookies.auth){
    const {verifiedUserId}= await jwt.verify(req.cookies.auth, secret);
    const userDetails= await User.findById({_id: verifiedUserId});
        req.user = userDetails;
        next();
    
   }else{
       next();
    }
   
}



module.exports={authorized,authenticateUser}