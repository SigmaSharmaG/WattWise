import mongoose, { model } from "mongoose";

const telemetrySchema = new mongoose.Schema({
    deviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Device',
        required:true,
    },
    voltage:{
        type:Double,
        required:true,
        default:0.0
    },
    current:{
        type:Double,
        required:true,
        default:0.0
    },
    power:{
        type:Double,
        required:true,
        default:0.0
    },
    
},{timestamps:true})

const Telemetry = mongoose.model('Telemetry',telemetrySchema);

export default Telemetry;
