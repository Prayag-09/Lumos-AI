import mongoose from 'mongoose';

let cached = global.mongoose || { conn: null, promise: null };

export default async function connectDB() {
	if (cached.conn) return cached.conn;

	if (!process.env.MONGODB_URI) {
		throw new Error('MONGODB_URI is not set in environment variables');
	}

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(process.env.MONGODB_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then((mongoose) => mongoose);
	}

	try {
		cached.conn = await cached.promise;
		console.log('✅ Connected to MongoDB');
	} catch (error) {
		console.error('❌ Error connecting to MongoDB:', error);
		throw error; // Don't swallow the error
	}

	global.mongoose = cached;
	return cached.conn;
}
