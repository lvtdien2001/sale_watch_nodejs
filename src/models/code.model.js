import mongoose from 'mongoose';
const { Schema } = mongoose;

const codeSchema = new Schema({
    codeNumber: {
        type: String,
        required: true
    },
    emailUser:{
        type:String, 
    },
    resetTokenExpires:{
        type:Date
    }
    
}, {timestamps: true});

export default mongoose.model('code', codeSchema);
