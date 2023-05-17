import mongoose from 'mongoose';
const { Schema } = mongoose;

const brandSchema = new Schema({
    createBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    updateBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    imageId: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('brand', brandSchema);
