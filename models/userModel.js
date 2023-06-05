const mongoose= require('mongoose')
const bcrypt= require('bcrypt');

const Schema = mongoose.Schema;



const userSchema= new Schema({
    googleID:{
        type:String,
    },
    isEmailVerified:{
        type:Boolean,
        default: false,
        required:true
    },
    otpToken:{
        type:Number,
        default:null
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    googleUserImage:{
        type:String,
    },
    password:{
        type:String,
    },

    country:{
        type:String
    },
    city:{
        type:String
    },
    tradeType:{
        type:String,
    },
    companyName:{
        type:String,
    },
    
    joined:{
        type:Date,
        default:Date.now
    },
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }else{
        let password= this.password
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)
        this.password= hashedPassword
        next()
    }

})


const User= mongoose.model('user', userSchema);

module.exports= User