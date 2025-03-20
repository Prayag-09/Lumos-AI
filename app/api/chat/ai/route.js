import connectDB from '@/config/db';
import Chat from '@/models/Chat';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import model from '@/lib/gemini';

export const maxDuration = 60;

export async function POST(req) {
	try {
		const auth = getAuth(req);
		const userId = auth?.userId;

		if (!userId) {
			console.warn('Unauthorized attempt to access chat AI endpoint');
			return NextResponse.json(
				{ success: false, message: 'User not authenticated' },
				{ status: 401 }
			);
		}

		const { chatId, prompt } = await req.json();

		if (!prompt?.trim()) {
			return NextResponse.json(
				{ success: false, message: 'Prompt cannot be empty' },
				{ status: 400 }
			);
		}

		await connectDB();
		const chatData = await Chat.findOne({ userId, _id: chatId });

		if (!chatData) {
			console.warn(`Chat not found for user: ${userId}, chatId: ${chatId}`);
			return NextResponse.json(
				{ success: false, message: 'Chat not found for this user' },
				{ status: 404 }
			);
		}

		// Save user prompt locally
		const userPrompt = {
			role: 'user',
			content: prompt,
			timestamp: Date.now(),
		};
		chatData.messages.push(userPrompt);

		// Request response from Gemini
		const result = await model.generateContent({
			contents: [{ role: 'user', parts: [{ text: prompt }] }],
		});

		const messageContent = result?.response?.text();

		if (!messageContent?.trim()) {
			console.error('Empty response from Gemini model.');
			return NextResponse.json(
				{ success: false, message: 'No response generated from Gemini API' },
				{ status: 500 }
			);
		}

		const assistantMessage = {
			role: 'assistant',
			content: messageContent.trim(),
			timestamp: Date.now(),
		};

		// Push response and save
		chatData.messages.push(assistantMessage);
		await chatData.save();

		return NextResponse.json(
			{ success: true, data: assistantMessage },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Chat AI API Error: ', error);
		return NextResponse.json(
			{ success: false, error: error.message || 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
