import mongoose from 'mongoose';

const BusSchema = new mongoose.Schema({
    bus_name: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true
    },
    route: {
        type: String,
    }
}, {timestamps: true});

const Bus = mongoose.model('Bus',BusSchema);
export default Bus;