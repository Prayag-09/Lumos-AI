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

		const chatData = {
			userId,
			messages: [],
			name: 'New Chat',
		};

		await connectDB();
		const newChat = await Chat.create(chatData);

		return NextResponse.json(
			{ success: true, message: 'Chat created', chat: newChat },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
