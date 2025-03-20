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
		<div className='relative overflow-hidden'>
			{/* Floating Snitch */}
			<Image
				src='https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjloNTg4NzZxaTBrN2c5M3BneGhxOTBycWI1a2JmejQ5cmF6eGJxYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7whxLJtwE80Ny/giphy.gif'
				alt='Golden Snitch'
				width={80}
				height={80}
				className='absolute top-10 right-10 opacity-80 animate-pulse z-0'
			/>

			<div className='flex h-screen relative z-10'>
				<Sidebar expand={expand} setExpand={setExpand} />
				<div className='flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-gradient-to-b from-[#0f0f1a] via-[#1A1C26] to-[#2a2c3b] text-[#E6E6FA] relative'>
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
							className='text-center flex flex-col items-center'
							initial='hidden'
							animate='visible'
							variants={welcomeVariants}>
							<Image
								src='https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWxiaDZ5Mjh4YmdxcnpmZ2NsbXlpYmpnZ3FtZmc4bHNlcmpwdDhrYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/LGe9GzmIFm85iQQkEI/giphy.gif'
								alt='Hogwarts Castle'
								width={300}
								height={300}
								className='mb-4'
							/>
							<h1 className='text-3xl font-bold text-[#FFD700] font-lumos'>
								"Lumos Maxima!"
							</h1>
							<p className='text-md mt-2 text-[#E6E6FA]/80 italic'>
								Illuminate your coding magic. How may I assist, wizard?
							</p>
						</motion.div>
					) : (
						<div
							ref={containerRef}
							className='relative flex flex-col items-center justify-start w-full mt-20 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#FFD700]/30 scrollbar-track-[#1A1C26]'>
							{/* Chat Name Header Marauder's Map Style */}
							<p className='fixed top-8 bg-[#1A1C26]/90 border-2 border-dotted border-[#FFD700] py-2 px-4 rounded-full font-extrabold text-[#FFD700] shadow-lg'>
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
										className='w-full max-w-3xl'>
										<Message role={msg.role} content={msg.content} />
									</motion.div>
								))}
							</AnimatePresence>

							{/* Wand Spark Loading Indicator */}
							{isLoading && (
								<motion.div
									className='flex gap-4 max-w-3xl w-full py-3'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}>
									<Image
										className='h-9 w-9 p-1 border border-[#E6E6FA]/15 rounded-full'
										src={assets.logo_icon}
										alt='Lumos Logo'
										width={36}
										height={36}
									/>
									<Image
										src='https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif'
										alt='Wand Spark Loading'
										width={60}
										height={60}
									/>
								</motion.div>
							)}
						</div>
					)}

					<div className='w-full max-w-3xl mt-4'>
						<div className='transition-all focus-within:ring-2 focus-within:ring-yellow-400 rounded-xl'>
							<PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
						</div>
					</div>

					<p className='text-xs absolute bottom-1 text-[#E6E6FA]/50'>
						⚡ Powered by magic. Use responsibly, wizard!
					</p>
				</div>
			</div>
		</div>
	);
}
