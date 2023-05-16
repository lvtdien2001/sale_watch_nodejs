import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    products: [
        {
            watchId: {
                type: Schema.Types.ObjectId,
                ref: 'watch'
            },
            quantity: Number
        }
    ],
    address: {
        type: String
    },
    phoneNumber: Number,
    payMethod: String,
    isPayment: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Chờ xác nhận', 'Chờ lấy hàng', 'Đang vận chuyển', 'Đã nhận', 'Trả hàng'],
        default: 'Chờ xác nhận'
    }
}, {timestamps: true});

export default mongoose.model('order', orderSchema);
