import mongoose from 'mongoose';
const { Schema } = mongoose;

const priceSchema = new Schema({
    watchId: {
        type: Schema.Types.ObjectId,
        ref: 'watch'
    },
    price: Number
}, {timestamps: true});

export default mongoose.model('price', priceSchema);
