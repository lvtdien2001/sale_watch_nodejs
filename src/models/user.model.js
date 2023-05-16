import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    fullName: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    imageUrl: {
        type: String
    },
    imageId: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('user', userSchema);
