const {config}= require('dotenv')
config();


module.exports= {
    port:  process.env.PORT,
    db_url: process.env.MONG0_STRING,
    secret_token: process.env.SECRET_STRING,
    google_client_ID: process.env.CLIENT_ID,
    google_client_secret: process.env.CLIENT_SECRET,
    session_secret: process.env.SESSION_SECRET_STRING,
    key_mailgun: process.env.KEY_MAILGUN,
    mail_gun_domain:process.env.MAIL_GUN_DOMAIN,
    company_email:process.env.COMPANY_EMAIL
};