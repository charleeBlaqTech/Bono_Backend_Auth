const express       = require("express");
const passport      = require("passport")
const config        = require("config")
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const User          = require('../models/userModel');
const {CheckUser,otpGenerator } = require('../config/helperFn');
const sendOtpToEmail= require('../config/otpSenderFn');
const validators    =require('../middlewares/validationFn');






const homeResponse   =(req, res)=>{
    const loggedIn= req.user;
    if(loggedIn){
        const message={
            msg: "WELCOME TO BONO OIL SERVICES USER AUTHENTICATION AND AUTHORIZATION BACKEND ENDPOINTS....READ DOCS FOR ENDPOINTS NEEDED TO MAKE API CALLS..... THANKS",
            docsLink: "https://documenter.getpostman.com/view/27827884/2s93sXeFps"
        }
        res.status(200).render("index",{message, loggedIn});
    }else{
        const message={
            msg: "WELCOME TO BONO OIL SERVICES USER AUTHENTICATION AND AUTHORIZATION BACKEND ENDPOINTS....READ DOCS FOR ENDPOINTS NEEDED TO MAKE API CALLS..... THANKS",
            docsLink: "https://documenter.getpostman.com/view/27827884/2s93sXeFps"
        }
        res.status(200).render("index",{message});
    }
   
}


//==========LOGIN ROUTE CONTROLLER FUNCTIONs=================
const loginPage      =(req, res)=>{
    //res.status(200).json({message: "The login page will be displayed by this route"})
    res.status(201).render('signin');//render login page
}

const loginUser      =async (req, res)=>{
    try{

        const {errors, sanitizedData} = await validators.validateUserInputsForSignIn(req.body);
        if (errors.length > 0) {
            res.status(400).json({message: errors });
        }else{
            const verifiedUser= await CheckUser(sanitizedData)
        
            if(verifiedUser.isEmailVerified === true){
                const passwordVerification = await bcrypt.compareSync(sanitizedData.password, verifiedUser.password)
                if(passwordVerification === true){
                    const secret = config.get('secret_token');

                    const verifiedUserId=verifiedUser._id
                    const loggedIn= verifiedUser;
                    const accessToken= await jwt.sign(({verifiedUserId}), secret,{expiresIn: 420});
                    
                    res.cookie('auth',accessToken,{maxAge:420000, httpOnly: true, sameSite: "lax"})
                    //res.status(200).json({status: 200, message:"you have been logged in successfully"});
                    res.status(200).render('profile');

                }else{
                    res.status(404).json({status: 404, message: "The password Entered does not match"});
                }
                
            }else{
                res.status(404).json({status: 404, message: "The User With This Email not found or not verified"});
            }
        }
        
    }catch(error){
        res.status(400).json({status:400, message: error.message})
    }   
}


//==================REGISTER NEW USER===================================
const signupPage     = (req, res)=>{
    //res.status(200).json({message: "The signup form page will be displayed by this route"})
    res.status(201).render('signup')//render signup page
}
const registerUser   =async(req, res)=>{ 
    try{

        const {errors, sanitizedData} = await validators.validateUserInputsForSignUp(req.body);
        if (errors.length > 0) {
            res.status(400).json({message: errors });
        }else{
            if(sanitizedData.password !== sanitizedData.confirmedPassword){
                res.status(400).json({status:400, message: "password not matched"})
            }else{
                const checkUserExist= await CheckUser(sanitizedData);
                    if(checkUserExist){
                        res.status(400).json({status:400, message: "User with this email already exist"})
                    }else if(validators.inputAreAllNumbers(Number(sanitizedData.phone)) === false){
                        res.status(400).json({status:400, message: "Phone Numbers Must Only Contain Numerical Values[0-9]"});
                    }else{
                        // ====generated six digit  otp ========
                        const otp = await otpGenerator();

                        const newUser= await User.create({
                            firstname:      sanitizedData.firstname,
                            lastname:       sanitizedData.lastname,
                            email:          sanitizedData.email,
                            password:       sanitizedData.password,
                            phone:          Number(sanitizedData.phone),
                            otpToken:       Number(otp)
                        })
                        
                        const otpSentSuccess= await sendOtpToEmail(newUser.email, newUser.otpToken);
                        
                        if(otpSentSuccess.status === 200){
                            res.status(200).redirect('/customer/verify-otp');
                        }else{
                            await User.findByIdAndDelete(newUser._id);
                            res.status(400).json({ status:400, message: "registration unsuccessful try again"});
                           
                        }

                        
                    }
            }
        }
       
        
        
    }catch(error){
        res.status(400).json({status:400, message: error.message});
    }
   
}


//=================VERIFY USER OTP=====================================
const otpVerificationPage=(req, res)=>{
    //res.status(200).json({message:"this will be the verification page for otp"})
    res.status(200).render('verify');//render otp verification page
}
const verifyOtp      =async (req, res)=>{

    const {errors, sanitizedData} = await validators.validateUserInputsForOtp(req.body);
        if (errors.length > 0) {
            res.status(400).json({message: errors });
        }else{
            const checkUserExist= await User.findOne({otpToken:Number(sanitizedData.otpToken)});
            if(!checkUserExist){
                res.status(400).json({status:400, message: "opt may have expired or not correct"})
            }else{
                const secret = config.get('secret_token');
                const verifiedUserId= checkUserExist._id;
                const accessToken= await jwt.sign(({verifiedUserId}), secret,{expiresIn: 420}); 

                checkUserExist.isEmailVerified= true;
                checkUserExist.otpToken= null;
                checkUserExist.save();

                res.cookie('auth',accessToken,{maxAge:420000, httpOnly: true, sameSite: "lax"})
                res.status(200).redirect('/customer/signup/complete')
                
            }
        }
   
}

//==================NEW USER UPDATE REGISTRATION FORM===================================
const completeRegistrationPage=(req, res)=>{
    const loggedIn= req.user;
    //res.status(200).json({message:"this will be the complete signup page"})
    res.status(200).render('complete-rg', {loggedIn})//render other user account details page
}

const completeRegistration=async(req, res)=>{ 
    try{
        const userID= (req.user? req.user.id.trim() : null || req.params.id? req.params.id.trim() : "");
        if(userID){
            const checkUserExist= await User.findById({_id:userID});
                if(!checkUserExist){
                    res.status(400).json({status:400, message: "User does not exist or account details mismatch"})
                }else{
                    const {errors, sanitizedData} = await validators.validateUserInputsForSignUpComplete(req.body);
                    if (errors.length > 0) {
                        res.status(400).json({message: errors });
                    }else{
                        const loggedIn= req.user;
                        checkUserExist.country      =sanitizedData.country;
                        checkUserExist.city         =sanitizedData.city;
                        checkUserExist.companyName  =sanitizedData.companyName;
                        checkUserExist.tradeType    =sanitizedData.tradeType;
                        checkUserExist.save();
                        //res.status(200).json({status:200, message: "signup completed Successfully"});
                        res.status(200).render('profile', {loggedIn});
                    }
                }
            
        }else{
            res.status(400).json({message: "you are not authorized"});
        }  

    }catch(error){
        res.status(400).json({status:400, message: error.message});
    }
   
}


// =================NEW PASSWORD RESET======================================
const newPasswordPage=(req, res)=>{
    const loggedIn= req.user;
    //res.status(200).json({message: "The new password form page will be displayed by this route"})
    res.status(200).render('new-password', {loggedIn}) //render new password input page
}
const resetPassword=async(req, res)=>{
    try {
        const currentUserId   = req.user? req.user._id.trim(): undefined;
        const userIdParams    =req.params?.id? req.params.id.trim() : null;
        
        if(!currentUserId && !userIdParams){
            res.status(404).redirect('/customer/login');
        }else{
            const currentUserDetail= await User.findOne({_id:(currentUserId || userIdParams)});
            if(currentUserDetail){
                const {errors, sanitizedData} = await validators.validateUserInputsForNewPassword(req.body);
                if (errors.length > 0) {
                    res.status(400).json({message: errors });
                }else{
                    if(sanitizedData.newPassword !== sanitizedData.confirmedNewPassword){
                        res.status(400).json({message: "passwords entered do not match"})
                    }else{
                        currentUserDetail.password = sanitizedData.newPassword;
                        currentUserDetail.save();
                        //res.status(200).json({status: 200, message: "password has been successfully updated"})   
                        res.status(200).redirect('/profile')   
                    }
                }
                
            }else{
                res.status(403).json({status: 403, message: "you are not authorized"})
            }
            
        }
        
    } catch (error) {
        res.status(400).json({status:400, message:error});
    }
}


//=======================USER PROFILE==========

const userProfile= async(req, res)=>{
    try {
        const currentUser   = req.user;
        if(!currentUser){
            res.status(404).redirect('/customer/login');
        }else{
            const currentUserDetail= await User.findOne({email:(currentUser.email)});
            if(currentUserDetail){
                //res.status(200).json({status:200});
                res.status(200).render('profile',{currentUserDetail, loggedIn});
            }else{
                res.status(403).json({status: 403, message: "you are not authorized"})
            }
            
        }
    } catch (error) {
        res.status(400).json({status:400});
    }
}

//==================LOG OUT USER========================================

const logoutUser= async (req, res)=>{
    
    try {
        await res.cookie('auth', '', {maxAge: 10})
        //res.status(200).json({status:200});
        res.status(200).redirect('/login');
    } catch (error) {
        res.status(400).json({status:400});
    }
}






module.exports={homeResponse,loginUser,loginPage,signupPage,newPasswordPage,registerUser,completeRegistrationPage,
                completeRegistration,resetPassword,
                logoutUser,otpVerificationPage,verifyOtp,userProfile
                }
   

