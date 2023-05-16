import mongoose from 'mongoose';
const { Schema } = mongoose;

const newsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    imageUrl: {
        type: String
    },
    imageId: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('news', newsSchema);
