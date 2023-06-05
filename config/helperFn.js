const express= require("express");
const config= require("config")
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const User =require('../models/userModel')


const CheckUser= async (bodyData)=>{
        const email    = bodyData.email;

        const verifyUser= await User.findOne({email});
        if(verifyUser){
            return verifyUser
        }else{
            return false
        }
}


const otpGenerator= async()=>{

    let minNumb= 100000;
    let maxNumb= 999999;

    const otp= await Math.floor(Math.random() * (maxNumb - minNumb + 1)) + minNumb;
    return otp

}









module.exports= {otpGenerator,CheckUser}