import mongoose, { model } from "mongoose";

const roomSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    homeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Home',
        required:true,
    },

},{timestamps:true})

const Room = mongoose.model('Room',roomSchema);

export default Room;
