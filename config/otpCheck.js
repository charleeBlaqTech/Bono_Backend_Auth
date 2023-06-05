const express   = require("express");
const config    = require("config")
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const User      =require('../models/userModel')



const sendEmail = () => {
    

    emailjs.sendForm('service_3jv3gaw', 'template_rc6rzvo', form.current, 'Z79F8FHrVgxthbM-Y')
        .then((result) => {
            ScrollToTop()
        }, (error) => {
            Navigate("/contact")
        });
       
};
