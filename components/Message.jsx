'use client';

import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Markdown from 'react-markdown';
import Prism from 'prismjs';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Animation for message bubble fade-in
const messageVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.3, ease: 'easeOut' },
	},
};

const Message = ({ role, content }) => {
	useEffect(() => {
		Prism.highlightAll();
	}, [content]);

	const copyMessage = () => {
		navigator.clipboard.writeText(content);
		toast.success('Message copied to clipboard');
	};

	return (
		<motion.div
			className='flex flex-col items-center w-full max-w-3xl text-sm font-inter'
			initial='hidden'
			animate='visible'
			variants={messageVariants}>
			<div
				className={`flex flex-col w-full mb-8 ${
					role === 'user' ? 'items-end' : 'items-start'
				}`}>
				<div
					className={`relative group flex max-w-2xl py-3 rounded-xl ${
						role === 'user'
							? 'bg-[#414158] px-5 shadow-md shadow-[#FFD700]/10'
							: 'gap-3 px-4 bg-[#1A1C26] shadow shadow-[#FFD700]/10'
					}`}>
					{/* Hover Controls */}
					<motion.div
						className={`absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
							role === 'user' ? '-left-16 top-2.5' : 'left-9 -bottom-6'
						}`}>
						<div className='flex items-center gap-2 opacity-80'>
							<motion.div
								whileHover={{ scale: 1.2, rotate: 5 }}
								whileTap={{ scale: 0.9 }}>
								<Image
									onClick={copyMessage}
									src={assets.copy_icon}
									alt='Copy message'
									className='w-4 cursor-pointer hover:opacity-100'
									width={16}
									height={16}
								/>
							</motion.div>

							{role === 'user' ? (
								<motion.div
									whileHover={{ scale: 1.2, rotate: 5 }}
									whileTap={{ scale: 0.9 }}>
									<Image
										src={assets.pencil_icon}
										alt='Edit message'
										className='w-4 cursor-pointer hover:opacity-100'
										width={16}
										height={16}
									/>
								</motion.div>
							) : (
								<>
									<motion.div
										whileHover={{ scale: 1.2, rotate: 5 }}
										whileTap={{ scale: 0.9 }}>
										<Image
											src={assets.regenerate_icon}
											alt='Regenerate response'
											className='w-4 cursor-pointer hover:opacity-100'
											width={16}
											height={16}
										/>
									</motion.div>
									<motion.div
										whileHover={{ scale: 1.2, rotate: 5 }}
										whileTap={{ scale: 0.9 }}>
										<Image
											src={assets.like_icon}
											alt='Like response'
											className='w-4 cursor-pointer hover:opacity-100'
											width={16}
											height={16}
										/>
									</motion.div>
									<motion.div
										whileHover={{ scale: 1.2, rotate: 5 }}
										whileTap={{ scale: 0.9 }}>
										<Image
											src={assets.dislike_icon}
											alt='Dislike response'
											className='w-4 cursor-pointer hover:opacity-100'
											width={16}
											height={16}
										/>
									</motion.div>
								</>
							)}
						</div>
					</motion.div>

					{/* Message Content */}
					{role === 'user' ? (
						<span className='text-white/90 break-words font-inter'>
							{content}
						</span>
					) : (
						<>
							<Image
								src={assets.logo_icon}
								alt='Bot logo'
								className='h-10 w-10 p-1 rounded-full shadow-md shadow-[#FFD700]/20'
								width={36}
								height={36}
							/>
							<div className='space-y-4 w-full overflow-x-auto prose prose-invert font-inter'>
								<Markdown>{content}</Markdown>
							</div>
						</>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default Message;
