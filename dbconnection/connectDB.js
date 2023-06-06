const mongoose= require('mongoose')
const config =require('config')



const connectToDb= ()=>{
    const db_url= config.get('db_url');
    return (
        mongoose.connect(db_url).then(()=>{
            console.log('database connected successfully');
        }).catch((error)=>{
            console.log(error);
        })
    )
}

module.exports = connectToDb;