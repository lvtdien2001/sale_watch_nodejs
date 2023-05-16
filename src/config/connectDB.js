import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.0dl4s4r.mongodb.net/`)
        console.log('Connect to database successfully');
    } catch (error) {
        console.log(error);
        console.log('Connect to databse failure');
    }
}

export default connectDB;
