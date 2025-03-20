import connectDB from '@/config/db';
import Chat from '@/models/Chat';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const auth = getAuth(req);
		const userId = auth?.userId;

		if (!userId) {
			console.warn('Unauthorized chat creation attempt');
			return NextResponse.json(
				{ success: false, message: 'User not authenticated' },
				{ status: 401 }
			);
		}

		const chatData = {
			userId,
			messages: [],
			name: 'New Chat',
		};

		await connectDB();
		const newChat = await Chat.create(chatData);

		console.log(`Chat created for user: ${userId}, chatId: ${newChat._id}`);

		return NextResponse.json(
			{ success: true, message: 'Chat created successfully', chat: newChat },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating chat:', error);
		return NextResponse.json(
			{ success: false, error: error.message || 'Internal server error' },
			{ status: 500 }
		);
	}
}
