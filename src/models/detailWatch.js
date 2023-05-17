import mongoose from 'mongoose';
const { Schema } = mongoose;

const detailWatchSchema = new Schema({
    watchId: {
        type: Schema.Types.ObjectId,
        ref: 'watch'
    },
    createBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    updateBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    color: [{
        name: String
    }],
    strap: String,
    glass: String
}, {timestamps: true});

export default mongoose.model('detailWatch', detailWatchSchema);
