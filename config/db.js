import dotenv from 'dotenv';
import  mongoose  from 'mongoose';


    const _connectDB = async()=>{
                try {
                    dotenv.config();
               await  mongoose.connect(process.env.MongoDB_ATLAS, { useNewUrlParser: true })
                .then(()=>{
                    console.log("Connected to Database")
                })
                } catch (error) {
                        console.log("An error has occured, ", error)
                }
    }

export default _connectDB;