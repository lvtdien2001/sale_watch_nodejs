import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    watchId: {
        type: Schema.Types.ObjectId,
        ref: 'watch'
    },
    content: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        default: 5
    },
    feedback: [{
        contentFeedback: {
            type: String,
        },
    }],
    imageUrl: {
        type: String
    },
    imageId: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('comment', commentSchema);
