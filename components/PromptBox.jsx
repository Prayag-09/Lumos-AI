'use client';

import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useClerk } from '@clerk/nextjs';

const formVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const buttonVariants = {
	idle: { scale: 1 },
	loading: {
		scale: [1, 1.05, 1],
		transition: { duration: 0.6, repeat: Infinity },
	},
};

const PromptBox = ({ setIsLoading, isLoading }) => {
	const [prompt, setPrompt] = useState('');
	const { user, chats, setChats, selectedChat, setSelectedChat } =
		useAppContext();
	const textareaRef = useRef(null);
	const { openSignIn } = useClerk();

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
		const trimmedPrompt = prompt.trim();

		if (!user) {
			toast.error('Please sign in to continue');
			openSignIn({ redirectUrl: '/' });
			return;
		}
		if (isLoading) {
			toast.error('Please wait for the current response');
			return;
		}
		if (!trimmedPrompt) {
			toast.error('Prompt cannot be empty');
			return;
		}

		setIsLoading(true);
		setPrompt('');

		let currentChat = selectedChat;

		// Create chat if one does not exist
		if (!currentChat) {
			try {
				const { data } = await axios.post('/api/chat/create');
				if (data.success && data.chat) {
					setChats((prev) => [...prev, data.chat]);
					setSelectedChat(data.chat);
					currentChat = data.chat;
				} else {
					toast.error('Could not start a new chat');
					setIsLoading(false);
					return;
				}
			} catch (err) {
				toast.error('Error starting a new chat');
				setIsLoading(false);
				return;
			}
		}

		const userMessage = {
			role: 'user',
			content: trimmedPrompt,
			timestamp: Date.now(),
		};

		setChats((prev) =>
			prev.map((chat) =>
				chat._id === currentChat._id
					? { ...chat, messages: [...chat.messages, userMessage] }
					: chat
			)
		);
		setSelectedChat((prev) => ({
			...prev,
			messages: [...(prev?.messages || []), userMessage],
		}));

		try {
			const { data } = await axios.post('/api/chat/ai', {
				chatId: currentChat._id,
				prompt: trimmedPrompt,
			});

			if (!data.success || !data.data?.content) {
				toast.error(data.message || 'No response from assistant');
				setIsLoading(false);
				return;
			}

			const tokens = data.data.content.split(' ');
			const assistantPlaceholder = {
				role: 'assistant',
				content: '',
				timestamp: Date.now(),
			};

			setChats((prev) =>
				prev.map((chat) =>
					chat._id === currentChat._id
						? { ...chat, messages: [...chat.messages, assistantPlaceholder] }
						: chat
				)
			);
			setSelectedChat((prev) => ({
				...prev,
				messages: [...prev.messages, assistantPlaceholder],
			}));

			tokens.forEach((_, i) => {
				setTimeout(() => {
					const partialMessage = {
						role: 'assistant',
						content: tokens.slice(0, i + 1).join(' '),
						timestamp: Date.now(),
					};
					setSelectedChat((prev) => ({
						...prev,
						messages: [...prev.messages.slice(0, -1), partialMessage],
					}));
					if (i === tokens.length - 1) setIsLoading(false);
				}, i * 80);
			});
		} catch (error) {
			toast.error('Something went wrong');
			setIsLoading(false);
		}
	};

	const hasMessages = selectedChat?.messages?.length > 0;

	return (
		<motion.form
			onSubmit={sendPrompt}
			className={`w-full ${
				hasMessages
					? 'max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl'
					: 'max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl'
			} bg-[#1A1C26] p-2 sm:p-4 rounded-3xl mt-2 sm:mt-4 shadow-lg border border-[#FFD700]/20`}
			initial='hidden'
			animate='visible'
			variants={formVariants}>
			<textarea
				ref={textareaRef}
				onKeyDown={handleKeyDown}
				className='outline-none w-full resize-none overflow-hidden break-words bg-transparent text-[#E6E6FA] placeholder-[#E6E6FA]/60 font-lumos text-sm sm:text-base md:text-lg max-h-40'
				rows={2}
				placeholder='Cast a spell with Lumos...'
				required
				onChange={(e) => setPrompt(e.target.value)}
				value={prompt}
				aria-label='Enter your prompt'
			/>

			<div className='flex items-center justify-between text-xs sm:text-sm mt-2 flex-wrap gap-2'>
				<div className='flex items-center gap-1 sm:gap-2'>
					<motion.button
						type='button'
						className='flex items-center gap-1 border border-[#FFD700]/40 px-2 py-1 rounded-full cursor-pointer hover:bg-[#2A2D3A] text-[#E6E6FA]'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						<Image
							src={assets.deepthink_icon}
							alt='Wisdom'
							width={16}
							height={16}
						/>
						<span className='hidden xs:inline'>Wisdom ✨</span>
					</motion.button>
					<motion.button
						type='button'
						className='flex items-center gap-1 border border-[#FFD700]/40 px-2 py-1 rounded-full cursor-pointer hover:bg-[#2A2D3A] text-[#E6E6FA]'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						<Image
							src={assets.search_icon}
							alt='Search'
							width={16}
							height={16}
						/>
						<span className='hidden xs:inline'>Search</span>
					</motion.button>
				</div>

				<div className='flex items-center gap-2'>
					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<Image
							className='w-4 sm:w-5 h-4 sm:h-5 cursor-pointer opacity-50 hover:opacity-100'
							src={assets.pin_icon}
							alt='Pin'
							width={16}
							height={16}
						/>
					</motion.div>
					<motion.button
						type='submit'
						className={`${
							prompt && !isLoading
								? 'bg-[#FFD700]'
								: isLoading
								? 'bg-[#FFD700]/60'
								: 'bg-[#2A2D3A]'
						} rounded-full p-2 cursor-pointer`}
						disabled={isLoading}
						variants={buttonVariants}
						animate={isLoading ? 'loading' : 'idle'}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}>
						<Image
							className='w-4 h-4'
							src={
								prompt && !isLoading
									? assets.arrow_icon
									: assets.arrow_icon_dull
							}
							alt='Send'
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
