import mongoose from 'mongoose';
const { Schema } = mongoose;

const watchSchema = new Schema({
    brandId: {
        type: Schema.Types.ObjectId,
        ref: 'brand'
    },
    voucherId: {
        type: Schema.Types.ObjectId,
        ref: 'voucher'
    },
    createBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    updateBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    priceId: {
        type: Schema.Types.ObjectId,
        ref: 'price',
        required: true
    },
    currentQuantity: {
        type: String
    },
    style: {
        type: String,
        enum: ['Sang trọng', 'Thể thao', 'Thời trang', 'Hiện đại', 'Quân đội']
    },
    imageUrl: {
        type: String
    },
    imageId: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('watch', watchSchema);
