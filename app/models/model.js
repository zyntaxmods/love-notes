import mongoose from "mongoose";


export const userSchema = new mongoose.Schema({
    author: {type: String, required: true},
    message: {type: String, required: true},
    to:{type: String, required: true},
    songUrl: {type: String, required: true},
    date: {type: Date, default: Date.now}
}, {timestamps: true});


const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;