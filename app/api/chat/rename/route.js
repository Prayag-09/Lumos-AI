import connectDB from '@/config/db';
import Chat from '@/models/Chat';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const { userId } = getAuth(req);

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: 'User not authenticated' },
				{ status: 401 }
			);
		}

		const { chatId, name } = await req.json();

		if (!chatId || !name) {
			return NextResponse.json(
				{ success: false, message: 'chatId and name are required' },
				{ status: 400 }
			);
		}

		await connectDB();
		const updatedChat = await Chat.findOneAndUpdate(
			{ _id: chatId, userId },
			{ name },
			{ new: true }
		);

		if (!updatedChat) {
			return NextResponse.json(
				{ success: false, message: 'Chat not found or not authorized' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, message: 'Chat renamed successfully' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
