import mongoose from 'mongoose';
const { Schema } = mongoose;

const voucherSchema = new Schema({
    deadline: Date,
    discount: Number, // %
    createBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    updateBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {timestamps: true});

export default mongoose.model('voucher', voucherSchema);
