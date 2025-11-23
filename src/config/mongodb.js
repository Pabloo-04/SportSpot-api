import mongoose from 'mongoose'

const connectDB = async () => {
    mongoose.connection.on('connected', () =>
        console.log("Conectado a DB:", mongoose.connection.name)
    );

    await mongoose.connect(process.env.MONGO_URI, {
        dbName: "sport-spot"
    });
}

export default connectDB;
