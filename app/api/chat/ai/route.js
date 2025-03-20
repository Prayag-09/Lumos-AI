import connectDB from '@/config/db';
import Chat from '@/models/Chat';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import model from '@/lib/gemini';

export const maxDuration = 60;

export async function POST(req) {
	try {
		const { userId } = getAuth(req);
		const { chatId, prompt } = await req.json();

		if (!userId) {
			return NextResponse.json({
				success: false,
				message: 'User not authenticated',
			});
		}

		if (!prompt || prompt.trim() === '') {
			return NextResponse.json({
				success: false,
				message: 'Prompt cannot be empty',
			});
		}

		await connectDB();
		const data = await Chat.findOne({ userId, _id: chatId });

		if (!data) {
			return NextResponse.json({
				success: false,
				message: 'Chat not found for this user',
			});
		}

		const userPrompt = {
			role: 'user',
			content: prompt,
			timestamp: Date.now(),
		};

		data.messages.push(userPrompt);

		// Gemini call
		const result = await model.generateContent({
			contents: [{ role: 'user', parts: [{ text: prompt }] }],
		});

		const messageContent = result.response.text();
		const message = {
			role: 'assistant',
			content: messageContent,
			timestamp: Date.now(),
		};

		data.messages.push(message);
		await data.save();

		return NextResponse.json({ success: true, data: message });
	} catch (error) {
		return NextResponse.json({ success: false, error: error.message });
	}
}
