import mongoose from 'mongoose';
const { Schema } = mongoose;

const voucherSchema = new Schema({
    deadline: Date,
    discount: Number // %
}, {timestamps: true});

export default mongoose.model('voucher', voucherSchema);
