import mongoose from 'mongoose';
const { Schema } = mongoose;

const watchSchema = new Schema({
    brandId: {
        type: Schema.Types.ObjectId,
        ref: 'brand'
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currentQuantity: {
        type: String
    },
    imageUrl: {
        type: String
    },
    imageId: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('watch', watchSchema);
