import mongoose from 'mongoose';
const date = new Date();
const messageSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    message:{type: String},
    created_At: {type: String, default: date}
})

const Message = mongoose.model('Message', messageSchema)

export default Message;