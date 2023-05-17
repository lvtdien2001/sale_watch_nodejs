import mongoose from 'mongoose';
const { Schema } = mongoose;

const detailWatchSchema = new Schema({
    watchId: {
        type: Schema.Types.ObjectId,
        ref: 'watch'
    },
    color: [{
        name: String
    }],
    strap: String,
    glass: String
}, {timestamps: true});

export default mongoose.model('detailWatch', detailWatchSchema);
