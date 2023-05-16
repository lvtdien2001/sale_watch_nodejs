import mongoose from 'mongoose';
const { Schema } = mongoose;

const cartSchema = new Schema({
    watchId: {
        type: Schema.Types.ObjectId,
        ref: 'watch'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    quantity: Number
}, {timestamps: true});

export default mongoose.model('cart', cartSchema);
