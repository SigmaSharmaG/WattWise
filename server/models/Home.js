import mongoose, { model } from "mongoose";

const homeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    tarrif:{
        type:String,
        required:true,
    }

},{timestamps:true})

const Home = mongoose.model('Home',homeSchema);

export default Home;
