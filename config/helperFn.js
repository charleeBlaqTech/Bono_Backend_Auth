const express       = require("express");
const config        = require("config")
const validateInputs= require('../middlewares/validationFn')
const User =require('../models/userModel')


const CheckUser= async (bodyData)=>{
    
        const email    = bodyData.email;

        const verifyUser= await User.findOne({email:email});
        if(verifyUser){
            return verifyUser
        }else{
            return false
        }
}



const otpGenerator= ()=>{

    let minNumb= 100000;
    let maxNumb= 999999;

    const otp= Math.floor(Math.random() * (maxNumb - minNumb + 1)) + minNumb;
    return otp

}






module.exports= {otpGenerator,CheckUser}