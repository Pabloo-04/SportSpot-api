import mongoose from 'mongoose'

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("DB conectada"))
    await mongoose.connect(`${process.env.MONGO_URI}/sport-spot`)
}

export default connectDB
