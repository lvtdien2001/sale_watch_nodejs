import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    roles: [{
        roleId: {
            type: Schema.Types.ObjectId,
            ref: 'role'
        }
    }],
    email: {
        type: String,
        unique: true,
        required: true,
        index:true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    disable:{
        type:Boolean,
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
