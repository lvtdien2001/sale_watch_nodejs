import mongoose from 'mongoose';
const { Schema } = mongoose;

const customerSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    voucherId: [{
        type: Schema.Types.ObjectId,
        ref: 'voucher'
    }],
    totalAmount: Number, // Tong so tien da mua
    numberOfBuying: Number // So lan mua
}, {timestamps: true});

export default mongoose.model('customer', customerSchema);
