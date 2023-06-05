const express= require("express");
const config= require("config")
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const User =require('../models/userModel')


const CheckUser= async (bodyData)=>{
        const userEmail     = bodyData.email;
        const userGoogleId  = bodyData.googleID;

        const verifyUser= await User.findOne({email: userEmail} || {googleID: userGoogleId})
        if(verifyUser){
            return verifyUser
        }else{
            return false
        }
}









module.exports= CheckUser