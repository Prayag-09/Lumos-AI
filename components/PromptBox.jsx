import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const PromptBox = ({ setIsLoading, isLoading }) => {
	const [prompt, setPrompt] = useState('');
	const { user, chats, setChats, selectedChat, setSelectedChat } =
		useAppContext();

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendPrompt(e);
		}
	};

	const sendPrompt = async (e) => {
		const promptCopy = prompt;

		try {
			e.preventDefault();
			if (!user) return toast.error('Login to send message');
			if (isLoading)
				return toast.error('Wait for the previous prompt response');

			setIsLoading(true);
			setPrompt('');

			const userPrompt = {
				role: 'user',
				content: prompt,
				timestamp: Date.now(),
			};

			setChats((prevChats) =>
				prevChats.map((chat) =>
					chat._id === selectedChat._id
						? { ...chat, messages: [...chat.messages, userPrompt] }
						: chat
				)
			);

			setSelectedChat((prev) => ({
				...prev,
				messages: [...prev.messages, userPrompt],
			}));

			const { data } = await axios.post('/api/chat/ai', {
				chatId: selectedChat._id,
				prompt,
			});

			if (data.success) {
				setChats((prevChats) =>
					prevChats.map((chat) =>
						chat._id === selectedChat._id
							? { ...chat, messages: [...chat.messages, data.data] }
							: chat
					)
				);

				const message = data.data.content;
				const messageTokens = message.split(' ');
				let assistantMessage = {
					role: 'assistant',
					content: '',
					timestamp: Date.now(),
				};

				setSelectedChat((prev) => ({
					...prev,
					messages: [...prev.messages, assistantMessage],
				}));

				for (let i = 0; i < messageTokens.length; i++) {
					setTimeout(() => {
						assistantMessage.content = messageTokens.slice(0, i + 1).join(' ');
						setSelectedChat((prev) => {
							const updatedMessages = [
								...prev.messages.slice(0, -1),
								assistantMessage,
							];
							return { ...prev, messages: updatedMessages };
						});
					}, i * 100);
				}
			} else {
				toast.error(data.message);
				setPrompt(promptCopy);
			}
		} catch (error) {
			toast.error(error.message);
			setPrompt(promptCopy);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={sendPrompt}
			className={`w-full ${
				selectedChat?.messages.length > 0 ? 'max-w-3xl' : 'max-w-2xl'
			} bg-[#1A1C26] p-4 rounded-3xl mt-4 transition-all shadow-lg border border-[#FFD700]/20`}>
			<textarea
				onKeyDown={handleKeyDown}
				className='outline-none w-full resize-none overflow-hidden break-words bg-transparent text-[#E6E6FA] placeholder-[#E6E6FA]/60 font-lumos'
				rows={2}
				placeholder='Cast a spell with Lumos...'
				required
				onChange={(e) => setPrompt(e.target.value)}
				value={prompt}
			/>

			<div className='flex items-center justify-between text-sm'>
				<div className='flex items-center gap-2'>
					<p className='flex items-center gap-2 text-xs border border-[#FFD700]/40 px-2 py-1 rounded-full cursor-pointer hover:bg-[#2A2D3A] transition text-[#E6E6FA]'>
						<Image
							className='h-5'
							src={assets.scroll_icon || assets.deepthink_icon}
							alt=''
						/>
						DeepThink (R1)
					</p>
					<p className='flex items-center gap-2 text-xs border border-[#FFD700]/40 px-2 py-1 rounded-full cursor-pointer hover:bg-[#2A2D3A] transition text-[#E6E6FA]'>
						<Image
							className='h-5'
							src={assets.wand_icon || assets.search_icon}
							alt=''
						/>
						Search
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<Image
						className='w-4 cursor-pointer opacity-60 hover:opacity-100 transition'
						src={assets.pin_icon}
						alt=''
					/>
					<button
						className={`${
							prompt ? 'bg-[#FFD700] animate-glow' : 'bg-[#2A2D3A]'
						} rounded-full p-2 cursor-pointer`}>
						<Image
							className='w-3.5 aspect-square'
							src={
								prompt
									? assets.wand_icon || assets.arrow_icon
									: assets.arrow_icon_dull
							}
							alt=''
						/>
					</button>
				</div>
			</div>
		</form>
	);
};

export default PromptBox;
