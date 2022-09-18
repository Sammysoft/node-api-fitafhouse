import dotenv from 'dotenv';
import  mongoose  from 'mongoose';


    const _connectDB = async()=>{
                try {
                    dotenv.config();
               await  mongoose.connect("mongodb+srv://FITAFHouse:FITAFHouse@investment.5o7ix.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true })
                .then(()=>{
                    console.log("Connected to Database")
                })
                } catch (error) {
                        console.log("An error has occured, ", error)
                }
    }

export default _connectDB;