import connectDB from '@/config/db';
import Chat from '@/models/Chat';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const { userId } = getAuth(req);
		const { chatId } = await req.json();

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: 'User not authenticated' },
				{ status: 401 }
			);
		}

		if (!chatId) {
			return NextResponse.json(
				{ success: false, message: 'chatId is required' },
				{ status: 400 }
			);
		}

		await connectDB();
		const result = await Chat.deleteOne({ _id: chatId, userId });

		if (result.deletedCount === 0) {
			return NextResponse.json(
				{ success: false, message: 'Chat not found or not authorized' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, message: 'Chat deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
