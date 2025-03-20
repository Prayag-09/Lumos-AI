'use client';

import { assets } from '@/assets/assets';
import Message from '@/components/Message';
import PromptBox from '@/components/PromptBox';
import Sidebar from '@/components/Sidebar';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for welcome message
const welcomeVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

// Animation variants for messages
const messageVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
	const [expand, setExpand] = useState(false);
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { selectedChat } = useAppContext();
	const containerRef = useRef(null);

	// Update messages when selectedChat changes
	useEffect(() => {
		if (selectedChat) {
			setMessages(selectedChat.messages || []); // ✅ Safe fallback
		} else {
			setMessages([]);
		}
	}, [selectedChat]);

	// Auto-scroll to the bottom when messages change
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: containerRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [messages]);

	return (
		<div className='relative'>
			<div className='flex h-screen'>
				<Sidebar expand={expand} setExpand={setExpand} />
				<div className='flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#1A1C26] text-[#E6E6FA] relative'>
					{/* Mobile Header */}
					<div className='md:hidden absolute px-4 top-6 flex items-center justify-between w-full'>
						<Image
							onClick={() => setExpand(!expand)}
							className='rotate-180 cursor-pointer hover:opacity-80 transition-opacity'
							src={assets.menu_icon}
							alt='Menu'
							width={24}
							height={24}
						/>
						<Image
							className='opacity-70'
							src={assets.chat_icon}
							alt='Chat Icon'
							width={24}
							height={24}
						/>
					</div>

					{/* Welcome Message or Chat Content */}
					{Array.isArray(messages) && messages.length === 0 ? (
						<motion.div
							className='text-center'
							initial='hidden'
							animate='visible'
							variants={welcomeVariants}>
							<div className='flex items-center gap-3'>
								<Image
									src={assets.logo_icon}
									alt='Lumos AI Logo'
									className='h-16 w-16'
									width={64}
									height={64}
								/>
								<h1 className='text-2xl font-medium font-lumos text-[#FFD700]'>
									Welcome to Lumos AI
								</h1>
							</div>
							<p className='text-sm mt-2 text-[#E6E6FA]/80'>
								Cast a spell to start coding—how can I assist you today?
							</p>
						</motion.div>
					) : (
						<div
							ref={containerRef}
							className='relative flex flex-col items-center justify-start w-full mt-20 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#FFD700]/30 scrollbar-track-[#1A1C26]'>
							{/* Chat Name Header */}
							<p className='fixed top-8 border border-[#FFD700]/20 hover:border-[#FFD700]/50 py-1 px-2 rounded-lg font-semibold bg-[#1A1C26]/80 backdrop-blur-sm mb-6'>
								{selectedChat?.name || 'Untitled Chat'}
							</p>

							{/* Messages */}
							<AnimatePresence>
								{messages.map((msg, index) => (
									<motion.div
										key={index}
										initial='hidden'
										animate='visible'
										exit='hidden'
										variants={messageVariants}
										className='w-full max-w-3xl'>
										<Message role={msg.role} content={msg.content} />
									</motion.div>
								))}
							</AnimatePresence>

							{/* Loading Indicator */}
							{isLoading && (
								<motion.div
									className='flex gap-4 max-w-3xl w-full py-3'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}>
									<Image
										className='h-9 w-9 p-1 border border-[#E6E6FA]/15 rounded-full'
										src={assets.logo_icon}
										alt='Lumos AI Logo'
										width={36}
										height={36}
									/>
									<div className='loader flex justify-center items-center gap-1'>
										<div className='w-1 h-1 rounded-full bg-[#FFD700] animate-bounce [animation-delay:0ms]'></div>
										<div className='w-1 h-1 rounded-full bg-[#FFD700] animate-bounce [animation-delay:150ms]'></div>
										<div className='w-1 h-1 rounded-full bg-[#FFD700] animate-bounce [animation-delay:300ms]'></div>
									</div>
								</motion.div>
							)}
						</div>
					)}

					{/* Prompt Box */}
					<div className='w-full max-w-3xl mt-4'>
						<PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
					</div>

					{/* Disclaimer */}
					<p className='text-xs absolute bottom-1 text-[#E6E6FA]/50'>
						AI-generated content, for reference only
					</p>
				</div>
			</div>
		</div>
	);
}
