'use client';

import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Markdown from 'react-markdown';
import Prism from 'prismjs';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Message fade-in animation
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
			className='flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl text-xs sm:text-sm md:text-base font-inter'
			initial='hidden'
			animate='visible'
			variants={messageVariants}>
			<div
				className={`flex flex-col w-full mb-6 sm:mb-8 ${
					role === 'user' ? 'items-end' : 'items-start'
				}`}>
				<div
					className={`relative group flex max-w-full sm:max-w-2xl py-2 sm:py-3 rounded-xl ${
						role === 'user'
							? 'bg-[#414158] px-4 sm:px-5 shadow-md shadow-[#FFD700]/10'
							: 'gap-2 sm:gap-3 px-3 sm:px-4 bg-[#1A1C26] shadow shadow-[#FFD700]/10'
					}`}>
					{/* Hover Controls */}
					<motion.div
						className={`absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
							role === 'user'
								? '-left-14 sm:-left-16 top-2 sm:top-2.5'
								: 'left-8 sm:left-10 -bottom-5 sm:-bottom-6'
						}`}>
						<div className='flex items-center gap-1 sm:gap-2 opacity-80'>
							<motion.div
								whileHover={{ scale: 1.3, rotate: 6 }}
								whileTap={{ scale: 0.9 }}>
								<Image
									onClick={copyMessage}
									src={assets.copy_icon}
									alt='Copy message'
									aria-label='Copy message'
									className='w-3.5 sm:w-4 cursor-pointer hover:opacity-100'
									width={14}
									height={14}
								/>
							</motion.div>

							{role === 'user' ? (
								<motion.div
									whileHover={{ scale: 1.2, rotate: 5 }}
									whileTap={{ scale: 0.9 }}>
									<Image
										src={assets.pencil_icon}
										alt='Edit message'
										aria-label='Edit message'
										className='w-3.5 sm:w-4 cursor-pointer hover:opacity-100'
										width={14}
										height={14}
									/>
								</motion.div>
							) : (
								<>
									{[
										{
											icon: assets.regenerate_icon,
											label: 'Regenerate response',
										},
										{ icon: assets.like_icon, label: 'Like response' },
										{ icon: assets.dislike_icon, label: 'Dislike response' },
									].map(({ icon, label }, i) => (
										<motion.div
											key={i}
											whileHover={{ scale: 1.2, rotate: 5 }}
											whileTap={{ scale: 0.9 }}>
											<Image
												src={icon}
												alt={label}
												aria-label={label}
												className='w-3.5 sm:w-4 cursor-pointer hover:opacity-100'
												width={14}
												height={14}
											/>
										</motion.div>
									))}
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
								className='h-8 w-8 sm:h-10 sm:w-10 p-1 rounded-full shadow-md shadow-[#FFD700]/20'
								width={32}
								height={32}
							/>
							<div className='space-y-3 sm:space-y-4 w-full overflow-x-auto prose prose-invert font-inter'>
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
