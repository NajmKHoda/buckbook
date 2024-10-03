import { connect, connection } from 'mongoose';

export default async function connectToDatabase() {
    // Return immediately if we're already connected to Mongoose
    if (connection.readyState === 1) return;

    const dbURL = process.env.DB_URL;
    if (!dbURL) throw new Error('Environment variable DB_URL not defined.');
    
    connect(dbURL);
    console.log("Connected to database.")
}