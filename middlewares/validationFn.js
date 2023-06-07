// const { body, validationResult } = require('express-validator');




function validateUserInputsForSignUp(bodyData) {
    const errors = [];
    const sanitizedData = {
      email: bodyData.email ? bodyData.email.trim().toLowerCase() : '',
      password: bodyData.password ? bodyData.password.trim().toLowerCase() : '',
      confirmedPassword: bodyData.confirmedPassword ? bodyData.confirmedPassword.trim().toLowerCase() : '',
      firstname: bodyData.firstname ? bodyData.firstname.trim().toLowerCase() : '',
      lastname: bodyData.lastname ? bodyData.lastname.trim().toLowerCase() : '',
      phone: bodyData.phone ? bodyData.phone.trim().toLowerCase() : '',
    };
  
  
    if (!sanitizedData.email || typeof sanitizedData.email !== 'string') {
      errors.push('Invalid email');
    }
  
    if (!sanitizedData.password || typeof sanitizedData.password !== 'string' || sanitizedData.password.length < 8) {
      errors.push('Invalid password and Password should be at least 8 characters');
    }
  
    if (!sanitizedData.confirmedPassword || typeof sanitizedData.confirmedPassword !== 'string' || sanitizedData.confirmedPassword.length < 8) {
      errors.push('Invalid password and Password should be at least 8 characters');
    }
  
    if (!sanitizedData.firstname || typeof sanitizedData.firstname !== 'string') {
      errors.push('Name cannot be empty and must be of type string');
    }
  
    if (!sanitizedData.lastname || typeof sanitizedData.lastname !== 'string') {
      errors.push('Name cannot be empty and must be of type string');
    }
    if (!sanitizedData.phone || typeof sanitizedData.phone !== "string") {
      errors.push('Phone Cannot be empty and the type is invalid');
    }
  
    return {errors: errors,sanitizedData: sanitizedData};
}

function validateUserInputsForSignIn (bodyData) {
  const errors = [];
    const sanitizedData = {
      email: bodyData.email ? bodyData.email.trim().toLowerCase() : '',
      password: bodyData.password ? bodyData.password.trim().toLowerCase() : ''
    };
   
    if (!sanitizedData.email || typeof sanitizedData.email !== 'string') {
      errors.push('Invalid email');
    }
  
    if (!sanitizedData.password || typeof sanitizedData.password !== 'string' || sanitizedData.password.length < 8) {
      errors.push('invalid password and Password should be at least 8 characters');
    }
  
    return {errors: errors,sanitizedData: sanitizedData};
}

function validateUserInputsForOtp(bodyData) {
    const errors = [];
    const sanitizedData = {
      otpToken: bodyData.otpToken ? bodyData.otpToken.trim().toLowerCase(): '',
    };

    
    if (!sanitizedData.otpToken || typeof sanitizedData.otpToken !== 'string') {
      errors.push('Invalid otp token');
    }
    return {errors: errors,sanitizedData: sanitizedData};
}

function validateUserInputsForSignUpComplete(bodyData) {
    const errors = [];
    {country, city, companyName, tradeType}
    const sanitizedData = {
      country: bodyData.email ? bodyData.email.trim().toLowerCase(): '',
      city: bodyData.password ? bodyData.password.trim().toLowerCase() : '',
      companyName: bodyData.confirmedPassword ? bodyData.confirmedPassword.trim().toLowerCase(): '',
      tradeType: bodyData.firstname ? bodyData.firstname.trim().toLowerCase() : '',
    };
  
  
    if (!sanitizedData.country || typeof sanitizedData.country !== 'string') {
      errors.push('Invalid country entry');
    }
  
    if (!sanitizedData.city || typeof sanitizedData.city !== 'string') {
      errors.push('Invalid city');
    }
  
    if (!sanitizedData.companyName || typeof sanitizedData.companyName !== 'string') {
      errors.push('Invalid company name or character');
    }
  
    if (!sanitizedData.tradeType || typeof sanitizedData.tradeType !== 'string') {
      errors.push('Invalid trade type or characters');
    }

  
    return {errors: errors,sanitizedData: sanitizedData};
}

function validateUserInputsForNewPassword (bodyData) {
  const errors = [];
    const sanitizedData = {
      confirmedNewPassword: bodyData.confirmedNewPassword ? bodyData.confirmedNewPassword.trim().toLowerCase() : '',
      newPassword: bodyData.newPassword ? bodyData.newPassword.trim().toLowerCase() : ''
    };
   
    if (!sanitizedData.newPassword || typeof sanitizedData.newPassword !== 'string' || sanitizedData.newPassword.length < 8) {
      errors.push('Invalid password and Password should be at least 8 characters');
    }
  
    if (!sanitizedData.confirmedNewPassword || typeof sanitizedData.confirmedNewPassword !== 'string' || sanitizedData.confirmedNewPassword.length < 8) {
      errors.push('Invalid password and Password should be at least 8 characters');
    }
  
    return {errors: errors,sanitizedData: sanitizedData};
}


//VALIDATION USING PACKAGE == express-validator==the array is used as a middleware then the validation result fuction is used on the next function;



// const validatingArray= [
//     body('name').notEmpty().trim().isLength({ min: 3 }),
//     body('email').isEmail().normalizeEmail(),
//     body('password').isLength({ min: 6 }),
//   ]

// const errors = validationResult(req);
// if (!errors.isEmpty()) {
//     // Return a response with validation errors
//     return res.status(400).json({ errors: errors.array() });
// }else{
//     res.status(201).json({ message: 'User created successfully' });
// }



module.exports={validateUserInputsForSignUpComplete, 
                validateUserInputsForSignUp,
                 validateUserInputsForSignIn, 
                  validateUserInputsForOtp,
                  validateUserInputsForNewPassword 
                }