import connectDB from '@/config/db';
import Chat from '@/models/Chat';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const auth = getAuth(req);
		const userId = auth?.userId;

		if (!userId) {
			console.warn('Unauthorized attempt to rename chat');
			return NextResponse.json(
				{ success: false, message: 'User not authenticated' },
				{ status: 401 }
			);
		}

		const { chatId, name } = await req.json();

		if (!chatId || !name.trim()) {
			return NextResponse.json(
				{ success: false, message: 'chatId and a valid name are required' },
				{ status: 400 }
			);
		}

		await connectDB();

		const updatedChat = await Chat.findOneAndUpdate(
			{ _id: chatId, userId },
			{ name: name.trim() },
			{ new: true }
		);

		if (!updatedChat) {
			console.warn(
				`Chat rename failed — chat not found or unauthorized: ${chatId}`
			);
			return NextResponse.json(
				{ success: false, message: 'Chat not found or not authorized' },
				{ status: 404 }
			);
		}

		console.log(`Chat renamed successfully: ${chatId} -> ${name.trim()}`);

		return NextResponse.json(
			{ success: true, message: 'Chat renamed successfully', updatedChat },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error renaming chat:', error);
		return NextResponse.json(
			{ success: false, message: 'Error renaming chat', error: error.message },
			{ status: 500 }
		);
	}
}
