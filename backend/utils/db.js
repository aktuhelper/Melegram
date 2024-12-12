import mongoose from "mongoose";
const connect=async()=>{
    try{
     await  mongoose.connect(process.env.MONGOURI)
     console.log('DB connection successfull!')
    }catch(error){
        console.log(error)
    }
}
export default connect