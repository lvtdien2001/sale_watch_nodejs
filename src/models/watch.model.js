import mongoose from 'mongoose';
const { Schema } = mongoose;

const watchSchema = new Schema({
    brandId: {
        type: Schema.Types.ObjectId,
        ref: 'brand'
    },
    voucherId: {
        type: Schema.Types.ObjectId,
        ref: 'voucher',
        default: null
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
    inventory: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    style: {
        type: String,
        enum: ['Sang trọng', 'Thể thao', 'Thời trang', 'Hiện đại', 'Quân đội'],
        default: null
    },
    imageUrl: {
        type: String
    },
    imageId: {
        type: String
    },
    strap: {
        type: String,
        default: null
    },
    glass: {
        type: String,
        default: null
    },
    principleOperate: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
}, {timestamps: true});

watchSchema.index({name: 'text', description: 'text', glass: 'text', strap: 'text', style: 'text'});
export default mongoose.model('watch', watchSchema);
