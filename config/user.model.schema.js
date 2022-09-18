import mongoose from "mongoose";


const date= new Date();
let presentDate = `0${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`



const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true
    },
    phonenumber:{
        type:Number,
        required: true
    },
    investment: [
        {plan:{type: String},
        investmentDuration: {type: Number},
        amount:{type: String},
        rate: {type: String},
        created_at: {
            type: String,
            default: presentDate
        },
        dueDate: {
            type: String
        }}
    ],
    role:{
        type: String,
        default: 'Investor'
    },
    isActive:{
        type: Boolean
    },
    approved:{
        type: Boolean
    },
    accountnumber: {
        type: Number
    },
   bank:{
       type: String
   },
   notification:{type: String, default: 'Hey there, Welcome to FITAFHOUSE'}
}, {
    timestamps: true
})

userSchema.methods.endDate = function endDate(investmentDuration){
    let date, extractedMonth, month, newMonth, dueDate, finalMonth;
    date = new Date();
    month =
        ["January","February","March","April","May","June","July","August","September","October","November","December"]
   extractedMonth = date.getMonth();
   newMonth = Number(extractedMonth) + Number(investmentDuration) + Number(1);
    if(newMonth >= 12){
        newMonth -= 12
        finalMonth = month[newMonth]
            dueDate = `0${newMonth}/${date.getDate()}/${date.getFullYear() + 1}`
            return dueDate;
    }else{
        dueDate = `0${newMonth}/${date.getDate()}/${date.getFullYear()}`
        return dueDate;
    }


}







const User = mongoose.model('User', userSchema)
export default User;