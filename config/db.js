import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/addiction';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log('MongoDb in connected');
    }catch (e) {
        console.log(e)
    }
};

export default connectDB;
