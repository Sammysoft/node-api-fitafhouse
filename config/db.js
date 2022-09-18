import dotenv from 'dotenv';
import  mongoose  from 'mongoose';


    const _connectDB = async()=>{
                try {
                    dotenv.config();
                    const MongoURL = "mongodb+srv://FITAFHouse:z7IVKotQfLySsVEl@investment.5o7ix.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
               await  mongoose.connect(MongoURL, { useNewUrlParser: true })
                .then(()=>{
                    console.log("Connected to Database")
                })
                } catch (error) {
                        console.log("An error has occured, ", error)
                }
    }

export default _connectDB;