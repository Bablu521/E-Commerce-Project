import mongoose from "mongoose";

const ConnectDB = async()=>{
    return await mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("DB-CONNECTED")
    }).catch((error)=>{
        console.log(`Failed To Connect DB , ${error}`);
    })
}

export default ConnectDB
