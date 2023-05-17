import mongoose from 'mongoose';
const { Schema } = mongoose;

const priceSchema = new Schema({
    watchId: {
        type: Schema.Types.ObjectId,
        ref: 'watch'
    },
    price: Number,
    createBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    updateBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {timestamps: true});

export default mongoose.model('price', priceSchema);
