import mongoose, { model } from "mongoose";

const alertSchema = new mongoose.Schema({
    deviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Device',
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    severity:{
        type:String,
        required:true,
    },
    message:{
        type:String,
    },
    acknowledged:{
        type:Boolean,
        default:false
    },
    
},{timestamps:true})

const Alert = mongoose.model('Alert',alertSchema);
export default Alert;
