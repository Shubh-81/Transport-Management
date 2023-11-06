import mongoose, {Schema} from 'mongoose';

const RequestSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicle_type: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
}, {timestamps: true});

const Request = mongoose.model('Request',RequestSchema);
export default Request;