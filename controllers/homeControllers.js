const express       = require("express");
const passport      = require("passport")
const config        = require("config")
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const User          = require('../models/userModel');
const CheckUser     = require('../config/helperFn')







// =================LOGIN EXISTING USER================================

const loginUser=async (req, res)=>{
    try{
        const verifyUser= await CheckUser(req.body)
        if(verifyUser){
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
            res.status(404).json({status: 404, message: "The User With This Email not found"});
        }
    }catch(error){
        res.status(400).json({status:400, message: error.message})
    }   
}


//==================REGISTER NEW USER===================================

const registerUser=async(req, res)=>{ 
    try{
        const {firstname, lastname,password,confirmedPassword, email, phone}=req.body;
       
        if(password.length < 8){
            res.status(400).json({message: "password must be equal or more than 8 letters"});
        }else if(password.length >= 8){
            if(password !== confirmedPassword){
                res.status(400).json({status:400, message: "password not matched"})
            }else{
                if(String(firstname) && String(lastname) && String(email) && String(password) && phone){
    
                    const checkUserExist= await User.findOne({email:email});
                    if(checkUserExist){
                        res.status(400).json({status:400, message: "User with this email already exist"})
                    }else{
                        // ====email otp send========
    
    
                        const newUser= await User.create({
                            firstname:      firstname.toLowerCase(),
                            lastname:       lastname.toLowerCase(),
                            email:          email.toLowerCase(),
                            password:       password.toLowerCase(),
                            phone:          Number(phone)
                        })
        
                        res.status(201).json({data: newUser, status:201, message: "Your Account was created Successfully"});
                        res.redirect('/signup/complete')
                    }
                    
                }else{
                    res.status(404).json({ status:404, message: "User informations not complete to Continue request"});
                }
            }
        }
        

        
       
    }catch(error){
        res.status(400).json({status:400, message: error});
    }
   
}

//==================NEW USER UPDATE REGISTRATION FORM===================================
const completeRegistrationPage=(req, res)=>{
    const userEmail= req.user.email;
    if(userEmail){
        res.status(200).json({status:200, message: "authenticated"});
    }else{
        res.status(404).json({status:404, message: "unAuthorized"});
    }
    
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

// =================LOGIN AND REGISTER USER WITH GOOGLE OAUTH===========

const googleLoginCallBack= async (req, res)=>{
    const secret = config.get('secret_token');
    const verifiedUserId= req.user._id;
    const accessToken= await jwt.sign(({verifiedUserId}), secret,{expiresIn: 300});         
    res.cookie('auth',accessToken,{maxAge:300000, httpOnly: true, sameSite: "lax"})
    res.redirect('/signup/complete');
}

// =================verifying current user with otp to authorize change of password=====

const verifyCurrentUser= async(req, res)=>{
    try {
        const userEmail= req.body.email;
        if(!userEmail){
            res.status(400).json({message: "email can not be empty"});
        }else{
            const verifyUser= await user.findOne({email: userEmail});
            if(!verifyUser){
                res.status(400).json({message: "a user with this email does not exist"});
            }else{
                // otp will be sent to the email........
            }

        }
    } catch (error) {
        
    }
}


// =================NEW PASSWORD RESET======================================
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

//==================LOG OUT USER========================================

const logoutUser= async (req, res)=>{
    
    try {
        await res.cookie('auth', '', {maxAge: 10})
        res.status(200).json({status:200});
    } catch (error) {
        res.status(400).json({status:400});
    }
}






module.exports={loginUser,registerUser,completeRegistrationPage,
                completeRegistration,resetPassword,verifyCurrentUser,
                logoutUser, googleLoginCallBack
                }
   

