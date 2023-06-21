import { timeStamp } from 'console';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    adminConfirm: [
        {
            createdBy: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            status: {
                type: String,
                enum: ['Chờ xác nhận', 'Chờ lấy hàng', 'Đã nhận', 'Xác nhận trả hàng','Xác nhận hủy']
            },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    products: [
        {
            watchId:  Schema.Types.ObjectId,
            quantity: Number,
            price: Number,
            name: String,
            imageUrl: String,
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
    reasonCancel: {
        type: String,
        default:null
    },
    isPayment: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Chờ xác nhận', 'Chờ lấy hàng', 'Đang vận chuyển', 'Đã nhận', 'Trả hàng', 'Hủy', 'Xác nhận hủy'],
        default: 'Chờ xác nhận'
    }
}, {timestamps: true});

export default mongoose.model('order', orderSchema);
