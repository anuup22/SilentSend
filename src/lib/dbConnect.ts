import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    //if already connected, return
    if (connection.isConnected) {
        console.log('Using existing connection');
        return;
    }

    //connect to db
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

        connection.isConnected = db.connections[0].readyState;
        console.log('Connected to db:', connection.isConnected === 1 ? 'yes' : 'no')
    }
    catch (error) {
        console.log('Error connecting to db:', error);
        process.exit(1);
    }
};

export default dbConnect;