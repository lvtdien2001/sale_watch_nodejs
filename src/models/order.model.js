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
            quantity: Number,
            price: Number
        }
    ],
    totalAmount: Number,
    province: String,
    district: String,
    ward: String,
    description: String,
    fullName: String,
    email: String,
    phoneNumber: String,
    paymentMethod: String,
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
