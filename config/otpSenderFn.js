const express   = require("express");
const config    = require("config")
const nodeMailer=require('nodemailer')
const mailGunTransport=require('nodemailer-mailgun-transport');



const key_mailgun      = config.get('key_mailgun');
const mail_gun_domain  = config.get('mail_gun_domain');
const company_email    = config.get('company_email');

const sendOtpToEmail= async (email,otp)=>{
    const mailGunAuth={
        auth:{
            api_key: key_mailgun,
            domain:  mail_gun_domain 
        }
    }
    
    const transporter= nodeMailer.createTransport(mailGunTransport(mailGunAuth))
    const name="BONO OIL LIMITED"
    const data={
        from: `${name} ${company_email}`,
        to:`${email}`,
        subject:"verify your account with Bogo with the One Time pin sent to Your Email",
        text: `${otp}`
    }
    
    
    const messageSent=await transporter.sendMail(data)
    return messageSent
}

module.exports= sendOtpToEmail