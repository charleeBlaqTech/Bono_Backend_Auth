const express       = require("express");
const passport      = require("passport")
const config        = require("config")
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const User          = require('../models/userModel');
const {CheckUser,otpGenerator }    = require('../config/helperFn');
const sendOtpToEmail= require('../config/otpSenderFn')






const homeResponse=(req,res)=>{
    res.status(200).json({message: "WELCOME TO BONO OIL SERVICES USER AUTHENTICATION AND AUTHORIZATION BACKEND ENDPOINTS....READ DOCS FOR ENDPOINT ROUTS NEEDED TO MAKE API CALLS..... THANKS"})
}
// =================LOGIN EXISTING USER================================
const loginPage=(req, res)=>{
    res.status(200).json({message: "The login page will be displayed by this route"})//render login page
}
const loginUser=async (req, res)=>{
    try{
        const verifyUser= await CheckUser(req.body)
        
        if(verifyUser.isEmailVerified === true){
            const passwordVerify= await bcrypt.compareSync(req.body.password.toLowerCase(), verifyUser.password)
            if(passwordVerify === true){

                const secret = config.get('secret_token');
                const verifiedUserId=verifyUser._id
                const accessToken= await jwt.sign(({verifiedUserId}), secret,{expiresIn: 300});
                
                res.cookie('auth',accessToken,{maxAge:300000, httpOnly: true, sameSite: "lax"})
                
                res.status(200).json({status: 200})
            }else{
                res.status(404).json({status: 404, message: "The password Entered does not match"});
            }
            
        }else{
            res.status(404).json({status: 404, message: "The User With This Email not found or not verified"});
        }
    }catch(error){
        res.status(400).json({status:400, message: error.message})
    }   
}



//==================REGISTER NEW USER===================================
const signupPage= (req, res)=>{
    res.status(200).json({message: "The signup form page will be displayed by this route"})//render signup page
}
const registerUser=async(req, res)=>{ 
    try{
        const {firstname, lastname,password,confirmedPassword, email, phone}=req.body;
       
        if(String(password).length < 8){
            res.status(400).json({message: "password must be equal or more than 8 letters"});
        }else if(String(password).length >= 8){
            if(password !== confirmedPassword){
                res.status(400).json({status:400, message: "password not matched"})
            }else{
                if(String(firstname) && String(lastname) && String(email) && String(password) && Number(phone)){
    
                    const checkUserExist= await User.findOne({email:email});
                    if(checkUserExist){
                        res.status(400).json({status:400, message: "User with this email already exist"})
                    }else{
                        // ====generated six digit  otp ========
                        const otp = await otpGenerator();
                        

                        const newUser= await User.create({
                            firstname:      firstname.toLowerCase(),
                            lastname:       lastname.toLowerCase(),
                            email:          email.toLowerCase(),
                            password:       password.toLowerCase(),
                            phone:          Number(phone),
                            otpToken:       Number(otp)
                        })
                        
                        const otpSentSuccess= await sendOtpToEmail(newUser.email, otp);
                        
                        if(otpSentSuccess.status === 200){
                            res.status(200).redirect('/verify');
                        }else{
                            await User.findByIdAndDelete(newUser._id).then((response)=>{
                                res.redirect('/register').json({ status:404, message: "verification unsuccessful"});
                                
                            });
                           
                        }

                        
                    }
                    
                }else{
                    res.status(404).json({ status:404, message: "User informations not complete to Continue request"});
                }
            }
        }
        
    }catch(error){
        res.status(400).json({status:400, message: error.message});
    }
   
}




//=================VERIFY USER OTP=====================================
const otpVerificationPage=(req,res)=>{
    res.status(200).json({message:"this will be the verification page for otp"})//render otp verification page
}
const verifyOtp=async (req,res)=>{

    const userOtp= req.body.otpToken;
    const checkUserExist= await User.findOne({otpToken:Number(userOtp)});
                    if(!checkUserExist){
                        res.status(400).json({status:400, message: "User details not found"})
                    }else{
                        const secret = config.get('secret_token');
                        const verifiedUserId= checkUserExist._id;
                        const accessToken= await jwt.sign(({verifiedUserId}), secret,{expiresIn: 300}); 

                        checkUserExist.isEmailVerified= true;
                        checkUserExist.otpToken= null;
                        checkUserExist.save();

                        res.cookie('auth',accessToken,{maxAge:300000, httpOnly: true, sameSite: "lax"})
                        res.status(200).json({ status:200, message: "Email account verified successfully"});
                        
                    }
}

//==================NEW USER UPDATE REGISTRATION FORM===================================
const completeRegistrationPage=(req,res)=>{
    res.status(200).json({message:"this will be the complete signup page"})//render other user account details page
}

const completeRegistration=async(req, res)=>{ 
    try{
        const userID= req.user._id || req.params.id
        const {country, city, companyName, tradeType}=req.body;

        if(String(country) && String(city) && String(companyName) && String(tradeType)){
            const checkUserExist= await User.findById({_id:userID});
            if(!checkUserExist){
                res.status(400).json({status:400, message: "User does not exist"})
            }else{
                checkUserExist.country      =country.toLowerCase();
                checkUserExist.city         =city.toLowerCase();
                checkUserExist.companyName  =companyName.toLowerCase();
                checkUserExist.tradeType    =tradeType.toLowerCase();
                checkUserExist.save()
                res.status(200).json({status:200, message: "signup completed Successfully"});
            }
            
        }else{
            res.status(404).json({ status:404, message: "User informations not complete to Continue request"});
        }
        

    }catch(error){
        res.status(400).json({status:400, message: error});
    }
   
}


// =================NEW PASSWORD RESET======================================
const newPasswordPage=(req,res)=>{
    res.status(200).json({message: "The new password form page will be displayed by this route"}) //render new password input page
}
const resetPassword=async(req, res)=>{
    try {
        const currentUserId   = req.user._id
        const newPassword     = req.body.newPassword;
        const confirmPassword = req.body. confirmedNewPassword;

        if(!currentUserId){
            res.status(404).redirect('/login')
        }else{
            if(newPassword.length < 8){
                res.status(400).json({message: "password must be equal or more than 8 letters"});
                
            }else if(newPassword.length >= 8){
                if(newPassword !== confirmPassword){
                    res.status(400).json({message: "passwords entered not match"})
                }else{
                    const currentUserDetail= await User.findOne({_id:currentUserId});
                    if(currentUserDetail){
                        currentUserDetail.password = newPassword;
                        currentUserDetail.save();
                        res.status(200).json({status: 200, message: "password has been successfully updated"})
                    }else{
                        res.status(403).json({status: 403, message: "you are not authorized"})
                    }
                    
                }
            }
        }
        
    } catch (error) {
        res.status(400).json({status:400, message:error});
    }
}


// =================LOGIN AND REGISTER USER WITH GOOGLE OAUTH===========

const googleLoginCallBack= async (req, res)=>{
    const secret = config.get('secret_token');
    const verifiedUserId= req.user._id;
    const accessToken= await jwt.sign(({verifiedUserId}), secret,{expiresIn: 300});         
    res.cookie('auth',accessToken,{maxAge:300000, httpOnly: true, sameSite: "lax"})
    res.redirect('/signup/complete');
}


//==================LOG OUT USER========================================

const logoutUser= async (req, res)=>{
    
    try {
        await res.cookie('auth', '', {maxAge: 10})
        res.status(200).json({status:200});
    } catch (error) {
        res.status(400).json({status:400});
    }
}






module.exports={homeResponse,loginUser,loginPage,signupPage,newPasswordPage,registerUser,completeRegistrationPage,
                completeRegistration,resetPassword,
                logoutUser,otpVerificationPage, googleLoginCallBack,verifyOtp
                }
   

