import connectDB from '@/config/db';
import Chat from '@/models/Chat';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req) {
	try {
		const { userId } = getAuth(req);

		if (!userId) {
			return NextResponse.json({
				success: false,
				message: 'User not authenticated',
			});
		}

		// Connect to the database and fetch all chats for the user
		await connectDB();
		const data = await Chat.find({ userId });
		console.log(`Fetched ${chats.length} chats for user: ${userId}`);

		return NextResponse.json({ success: true, data: chats }, { status: 200 });
	} catch (error) {
		console.error('Error fetching chats:', error);
		return NextResponse.json(
			{ success: false, message: 'Error fetching chats', error: error.message },
			{ status: 500 }
		);
	}
}
