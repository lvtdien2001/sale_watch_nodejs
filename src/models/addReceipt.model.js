import mongoose from 'mongoose';
const { Schema } = mongoose;

const addReceiptSchema = new Schema({
    createBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    watches: [{
        watchId: {
            type: Schema.Types.ObjectId,
            ref: 'watch'
        },
        price: Number,
        quantity: Number,
        amount: Number,
        supplier: String,
    }],
    totalAmount: {
        type: Number
    }
}, {timestamps: true});

export default mongoose.model('addReceipt', addReceiptSchema);
