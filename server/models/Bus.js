import mongoose from 'mongoose';

const BusSchema = new mongoose.Schema({
    bus: {
        type: String,
        required: true,
    },
    people: {
        type: [String],
    }
}, {timestamps: true});

const Bus = mongoose.model('Bus',BusSchema);
export default Bus;