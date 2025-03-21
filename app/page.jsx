'use client';

import { assets } from '@/assets/assets';
import Message from '@/components/Message';
import PromptBox from '@/components/PromptBox';
import Sidebar from '@/components/Sidebar';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const welcomeVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

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

	useEffect(() => {
		if (selectedChat) {
			setMessages(selectedChat.messages || []);
		} else {
			setMessages([]);
		}
	}, [selectedChat]);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: containerRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [messages]);

	return (
		<div className='relative w-full h-[100dvh] overflow-hidden'>
			{/* Click-away overlay for sidebar on mobile */}
			{expand && (
				<div
					className='fixed inset-0 z-40 md:hidden bg-black/40'
					onClick={() => setExpand(false)}
				/>
			)}

			{/* Floating Golden Snitch */}
			<Image
				src='https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjloNTg4NzZxaTBrN2c5M3BneGhxOTBycWI1a2JmejQ5cmF6eGJxYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7whxLJtwE80Ny/giphy.gif'
				alt='Golden Snitch'
				width={0}
				height={0}
				sizes='(max-width: 400px) 30px, (max-width: 640px) 40px, (max-width: 1024px) 60px, 80px'
				className='absolute top-4 right-4 opacity-80 animate-pulse w-8 sm:w-10 md:w-16 lg:w-20 h-auto max-w-[50px] z-0'
			/>

			<div className='flex w-full h-full relative z-10 overflow-hidden'>
				<Sidebar expand={expand} setExpand={setExpand} />

				<div className='flex-1 flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-[#0f0f1a] via-[#1A1C26] to-[#2a2c3b] text-[#E6E6FA] relative overflow-hidden'>
					{/* Mobile Header */}
					<div className='md:hidden absolute top-4 left-0 right-0 px-3 flex items-center justify-between w-full z-20'>
						<Image
							onClick={() => setExpand(!expand)}
							className='rotate-180 cursor-pointer hover:opacity-80 transition-opacity w-5 h-5'
							src={assets.menu_icon}
							alt='Menu'
							width={20}
							height={20}
						/>
						<Image
							className='opacity-70 w-5 h-5'
							src={assets.chat_icon}
							alt='Chat Icon'
							width={20}
							height={20}
						/>
					</div>

					{/* Welcome screen or chat content */}
					{Array.isArray(messages) && messages.length === 0 ? (
						<motion.div
							className='text-center flex flex-col items-center px-2'
							initial='hidden'
							animate='visible'
							variants={welcomeVariants}>
							<Image
								src='https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWxiaDZ5Mjh4YmdxcnpmZ2NsbXlpYmpnZ3FtZmc4bHNlcmpwdDhrYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/LGe9GzmIFm85iQQkEI/giphy.gif'
								alt='Hogwarts Castle'
								width={0}
								height={0}
								sizes='(max-width: 640px) 70vw, (max-width: 1024px) 60vw, 300px'
								className='mb-3 w-44 sm:w-56 md:w-72 lg:w-80 h-auto'
							/>
							<h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-[#FFD700] font-lumos'>
								"Lumos Maxima!"
							</h1>
							<p className='text-xs sm:text-sm mt-1 text-[#E6E6FA]/80 italic'>
								Illuminate your coding magic. How may I assist, wizard?
							</p>
						</motion.div>
					) : (
						<div
							ref={containerRef}
							className='relative flex flex-col items-center w-full mt-16 max-h-[calc(100dvh-220px)] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-[#FFD700]/30 scrollbar-track-[#1A1C26] snap-y snap-mandatory'>
							<p className='fixed top-6 bg-[#1A1C26]/90 border border-dotted border-[#FFD700] py-1 px-3 rounded-full font-bold text-[#FFD700] shadow-md text-xs max-w-[90%] truncate z-30 text-center'>
								{selectedChat?.name || 'Mischief Managed'}
							</p>

							<AnimatePresence>
								{messages.map((msg, index) => (
									<motion.div
										key={index}
										initial='hidden'
										animate='visible'
										exit='hidden'
										variants={messageVariants}
										className='w-full max-w-2xl px-2 snap-start'>
										<Message role={msg.role} content={msg.content} />
									</motion.div>
								))}
							</AnimatePresence>

							{/* Loading wand animation */}
							{isLoading && (
								<motion.div
									className='flex gap-2 max-w-2xl w-full py-2 items-center px-2'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}>
									<Image
										className='h-7 w-7 p-1 border border-[#E6E6FA]/15 rounded-full'
										src={assets.logo_icon}
										alt='Lumos Logo'
										width={28}
										height={28}
									/>
									<Image
										src='https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif'
										alt='Wand Loading'
										width={32}
										height={32}
										className='w-6 h-6 sm:w-8 sm:h-8'
									/>
								</motion.div>
							)}
						</div>
					)}

					{/* PromptBox input */}
					<div className='w-full max-w-2xl px-2 mt-3'>
						<PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
					</div>

					<p className='text-xs sm:text-sm absolute bottom-2 text-[#E6E6FA]/50 text-center w-full px-2'>
						⚡ Powered by magic. Use responsibly, wizard!
					</p>
				</div>
			</div>
		</div>
	);
}
