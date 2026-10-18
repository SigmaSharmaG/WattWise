import mongoose, { model } from "mongoose";

const deviceSchema = new mongoose.Schema({
    homeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Home',
        required:true,
    },
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room',
        required:true,
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        required:true,
    },
    type:{
        type:String,
    }

},{timestamps:true})

const Device = mongoose.model('Device',deviceSchema);

export default Device;
