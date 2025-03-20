'use client';

import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Animation variants for the form
const formVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: 'easeOut' },
	},
};

// Animation for button glow
const buttonVariants = {
	idle: { scale: 1 },
	loading: {
		scale: [1, 1.1, 1],
		transition: { duration: 0.8, repeat: Infinity },
	},
};

const PromptBox = ({ setIsLoading, isLoading }) => {
	const [prompt, setPrompt] = useState('');
	const { user, chats, setChats, selectedChat, setSelectedChat } =
		useAppContext();
	const textareaRef = useRef(null);

	// Auto-resize textarea based on content
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = 'auto'; // Reset height
			textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
		}
	}, [prompt]);

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendPrompt(e);
		}
	};

	const sendPrompt = async (e) => {
		e.preventDefault();
		const promptCopy = prompt.trim();

		try {
			if (!user) {
				toast.error('Login to send a message');
				return;
			}
			if (!selectedChat) {
				toast.error('No chat selected');
				return;
			}
			if (isLoading) {
				toast.error('Wait for the previous response');
				return;
			}
			if (!promptCopy) {
				toast.error('Prompt cannot be empty');
				return;
			}

			setIsLoading(true);
			setPrompt('');

			const userPrompt = {
				role: 'user',
				content: promptCopy,
				timestamp: Date.now(),
			};

			// Ensure selectedChat.messages is an array
			const selectedChatMessages = Array.isArray(selectedChat.messages)
				? selectedChat.messages
				: [];

			// Update chats and selectedChat with user prompt
			setChats((prevChats) =>
				prevChats.map((chat) => {
					const chatMessages = Array.isArray(chat.messages)
						? chat.messages
						: [];
					return chat._id === selectedChat._id
						? { ...chat, messages: [...chatMessages, userPrompt] }
						: chat;
				})
			);

			setSelectedChat((prev) => ({
				...prev,
				messages: [...selectedChatMessages, userPrompt],
			}));

			const { data } = await axios.post('/api/chat/ai', {
				chatId: selectedChat._id,
				prompt: promptCopy,
			});

			const message = data?.data?.content;
			if (!data.success || !message) {
				toast.error(data.message || 'No response from assistant');
				setPrompt(promptCopy);
				setIsLoading(false);
				return;
			}

			const assistantMessage = {
				role: 'assistant',
				content: '',
				timestamp: Date.now(),
			};

			// Add placeholder assistant message
			setChats((prevChats) =>
				prevChats.map((chat) => {
					const chatMessages = Array.isArray(chat.messages)
						? chat.messages
						: [];
					return chat._id === selectedChat._id
						? { ...chat, messages: [...chatMessages, assistantMessage] }
						: chat;
				})
			);

			setSelectedChat((prev) => ({
				...prev,
				messages: [...prev.messages, assistantMessage],
			}));

			// Stream the assistant's response
			const messageTokens = message.split(' ');
			messageTokens.forEach((_, i) => {
				setTimeout(() => {
					const partialMessage = {
						role: 'assistant',
						content: messageTokens.slice(0, i + 1).join(' '),
						timestamp: Date.now(),
					};
					setSelectedChat((prev) => ({
						...prev,
						messages: [...prev.messages.slice(0, -1), partialMessage],
					}));
					// Ensure loading state is reset after the last token
					if (i === messageTokens.length - 1) {
						setIsLoading(false);
					}
				}, i * 150);
			});
		} catch (error) {
			toast.error(error.message || 'An error occurred');
			setPrompt(promptCopy);
			setIsLoading(false);
		}
	};

	const hasMessages =
		selectedChat &&
		Array.isArray(selectedChat?.messages) &&
		selectedChat.messages.length > 0;

	return (
		<motion.form
			onSubmit={sendPrompt}
			className={`w-full ${
				hasMessages ? 'max-w-3xl' : 'max-w-2xl'
			} bg-[#1A1C26] p-4 rounded-3xl mt-4 transition-all shadow-lg border border-[#FFD700]/20`}
			initial='hidden'
			animate='visible'
			variants={formVariants}>
			<textarea
				ref={textareaRef}
				onKeyDown={handleKeyDown}
				className='outline-none w-full resize-none overflow-hidden break-words bg-transparent text-[#E6E6FA] placeholder-[#E6E6FA]/60 font-lumos text-base md:text-lg'
				rows={2}
				placeholder='Cast a spell with Lumos...'
				required
				onChange={(e) => setPrompt(e.target.value)}
				value={prompt}
				aria-label='Enter your prompt'
			/>

			<div className='flex items-center justify-between text-sm mt-3'>
				<div className='flex items-center gap-2'>
					<motion.button
						type='button'
						className='flex items-center gap-2 text-xs border border-[#FFD700]/40 px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#2A2D3A] transition text-[#E6E6FA] font-inter'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						aria-label='DeepThink mode'>
						<Image
							src={assets.scroll_icon || assets.deepthink_icon}
							alt='DeepThink mode'
							className='h-5 w-5'
							width={20}
							height={20}
						/>
						DeepThink (R1)
					</motion.button>
					<motion.button
						type='button'
						className='flex items-center gap-2 text-xs border border-[#FFD700]/40 px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#2A2D3A] transition text-[#E6E6FA] font-inter'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						aria-label='Search mode'>
						<Image
							src={assets.wand_icon || assets.search_icon}
							alt='Search mode'
							className='h-5 w-5'
							width={20}
							height={20}
						/>
						Search
					</motion.button>
				</div>

				<div className='flex items-center gap-3'>
					<motion.div
						whileHover={{ scale: 1.1, rotate: 5 }}
						whileTap={{ scale: 0.9 }}>
						<Image
							className='w-4 cursor-pointer opacity-60 hover:opacity-100 transition'
							src={assets.pin_icon}
							alt='Pin message'
							width={16}
							height={16}
							aria-label='Pin message'
						/>
					</motion.div>
					<motion.button
						type='submit'
						className={`${
							prompt && !isLoading
								? 'bg-[#FFD700] animate-glow'
								: isLoading
								? 'bg-[#FFD700]/60'
								: 'bg-[#2A2D3A]'
						} rounded-full p-2 cursor-pointer`}
						disabled={isLoading}
						variants={buttonVariants}
						animate={isLoading ? 'loading' : 'idle'}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						aria-label='Send prompt'>
						<Image
							className='w-4 h-4'
							src={
								prompt && !isLoading
									? assets.wand_icon || assets.arrow_icon
									: assets.arrow_icon_dull
							}
							alt='Send prompt'
							width={16}
							height={16}
						/>
					</motion.button>
				</div>
			</div>
		</motion.form>
	);
};

export default PromptBox;
