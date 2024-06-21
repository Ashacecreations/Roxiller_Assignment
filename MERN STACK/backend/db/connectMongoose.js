import mongoose from "mongoose";

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log("Error: ", error.message);
    }
}

export default connectMongo