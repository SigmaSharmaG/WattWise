import mongoose, { model } from "mongoose";

const ruleSchema = new mongoose.Schema({
    deviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Device',
        required:true,
    },
    RoomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room',
        required:true,
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        trim:true,
    },
    trigger:{
        type:String,
    },
    condition:{
        type:String,
    },
    action:{
        type:String,
    },
    status:{
        type:String,
        required:true,
    },

},{timestamps:true})

const Rule = mongoose.model('Rule',ruleSchema);

export default Rule;
