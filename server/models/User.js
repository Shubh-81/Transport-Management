import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min:2,
        max:50
    },
    lastName: {
        type: String,
        required: true,
        min:2,
        max:50
    },
    email: {
        type: String,
        required: true,
        min:2,
    },
    password: {
        type: String,
        required: true,
        min: 5
    },
    verified: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        default: "user",
        required: true,
    },
    id: {
        type: String,
        required: true
    }
}, {timestamps: true});

const User = mongoose.model('User',UserSchema);
export default User;