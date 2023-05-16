import mongoose from 'mongoose';
const { Schema } = mongoose;

const brandSchema = new Schema({
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
