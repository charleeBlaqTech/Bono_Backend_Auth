const JwtStrategy= require('passport-jwt').Strategy;
const ExtractJwt =require('passport-jwt').ExtractJwt
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const config= require("config")
const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
const User =require('../models/userModel');
const CheckUser =require('./helperFn')




const authPassport=(passport)=>{

    const google_client_ID      = config.get('google_client_ID');
    const google_client_secret  = config.get('google_client_secret');
   
    passport.use(
        new GoogleStrategy({
        clientID:       google_client_ID,
        clientSecret:   google_client_secret,
        callbackURL:    "http://localhost:1900/auth/google/callback"
    }, 
    async (accessToken, refreshToken, profile, callbackFn)=>{
        const newUserData = {
            googleID: profile.id.toLowerCase(),
            firstname:profile.name.familyName.toLowerCase(),
            lastname:profile.name.givenName.toLowerCase(),
            email: profile.emails[0].value.toLowerCase(),
            googleUserImage:profile.photos[0].value
        }
        try {
            // const checkUserExistence= await User.findOne({googleID:profile.id});
            const checkUserExistence= await CheckUser(newUserData)
            if(checkUserExistence){
                callbackFn(null, checkUserExistence);
            }else{
                const newUser= await User.create(newUserData);
                callbackFn(null, newUser)
            }
        } catch (error) {
            console.log(error)
        }
       
    })
    )

    passport.serializeUser((user,callbackFn)=>{
        callbackFn(null,user.id)
    });

    passport.deserializeUser((id, callbackFn)=>{
        User.findById(id, (err, user)=>{
            callbackFn(err, user)
        });
    });
}









module.exports=authPassport