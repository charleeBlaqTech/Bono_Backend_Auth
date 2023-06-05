const {config}= require('dotenv')
config();


module.exports= {
    port:  process.env.PORT,
    db_url: 'mongodb://localhost:27017/bogo_productDB',
    secret_token: process.env.SECRET_STRING,
    google_client_ID: process.env.CLIENT_ID,
    google_client_secret: process.env.CLIENT_SECRET,
    session_secret: process.env.SESSION_SECRET_STRING
};