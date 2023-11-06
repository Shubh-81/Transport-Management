import mongoose, {Schema} from 'mongoose';
import User from './User.js';
import Bus from "./Bus.js";

const RideSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bus_id: {
        type: Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    boarding_date: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Ride = mongoose.model('Ride',RideSchema);
export default Ride;