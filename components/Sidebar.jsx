'use client';

import { assets } from '@/assets/assets';
import Image from 'next/image';

import React, { useState, useEffect } from 'react';
import { useAuth, useClerk, UserButton } from '@clerk/nextjs';
import { useAppContext } from '@/context/AppContext';
import ChatLabel from './ChatLabel';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for sidebar expansion
const sidebarVariants = {
	expanded: { width: '16rem', padding: '0.75rem' },
	collapsed: { width: '8rem', padding: '0.5rem' },
};

// Animation variants for tooltip
const tooltipVariants = {
	hidden: { opacity: 0, y: -10, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.3, type: 'spring', stiffness: 400, damping: 20 },
	},
	exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
};

// Animation variants for elements fading in
const fadeInVariants = {
	hidden: { opacity: 0, x: -15 },
	visible: (i) => ({
		opacity: 1,
		x: 0,
		transition: { duration: 0.4, delay: i * 0.1, ease: 'easeOut' },
	}),
};

// Animation for logo
const logoVariants = {
	hidden: { scale: 0.8, opacity: 0, rotate: -10 },
	visible: {
		scale: 1,
		opacity: 1,
		rotate: 0,
		transition: { duration: 0.5, type: 'spring', stiffness: 200, damping: 15 },
	},
};

const Sidebar = ({ expand, setExpand }) => {
	const { userId, isLoaded } = useAuth();
	const { openSignIn } = useClerk();
	const { user, chats, createNewChat } = useAppContext();
	const [openMenu, setOpenMenu] = useState({ id: 0, open: false });
	const [showTooltip, setShowTooltip] = useState(null);

	useEffect(() => {
		if (isLoaded && !userId) {
			openSignIn();
		}
	}, [isLoaded, userId, openSignIn]);
	return (
		<motion.div
			className='flex flex-col justify-between bg-[#1A1C26] bg-cover bg-blend-overlay pt-4 max-md:absolute max-md:h-screen max-md:overflow-hidden shadow-lg shadow-[#FFD700]/10 z-50'
			animate={expand ? 'expanded' : 'collapsed'}
			variants={sidebarVariants}
			initial={false}
			transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
			<div>
				<div
					className={`flex items-center px-3 ${
						expand ? 'flex-row gap-3' : 'flex-col gap-3 items-center'
					}`}>
					<motion.div
						variants={logoVariants}
						initial='hidden'
						animate='visible'>
						<Image
							className={`rounded-full border-4 border-[#FFD700]/50 hover:border-[#FFD700]/70 transition-all duration-300 shadow-xl shadow-[#FFD700]/30
	${expand ? 'w-16 h-16' : 'w-20 h-20'}`}
							src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGZtanhzY2tpdWpteTh2Z2NodWJ2dzBya2d2c2R1anFydWdsZzhweSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/dgzRXtAF6gTd0xXMJx/giphy.gif'
							alt='Lumos AI Logo'
							width={0}
							height={0}
							priority
						/>
					</motion.div>

					{/* Lumos Logo */}
					<motion.div
						className={`text-center ${expand ? 'block' : 'hidden'}`}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}>
						<span className='text-[#FFD700] font-lumos text-5xl md:text-3xl tracking-wider drop-shadow-lg'>
							Lumos AI ✨
						</span>
					</motion.div>

					{/* Sidebar Toggle Button */}
					<motion.div
						className='group relative flex items-center justify-center cursor-pointer hover:bg-[#2A2D3A] rounded-lg transition-colors duration-200 z-50'
						onClick={() => setExpand(!expand)}
						onMouseEnter={() => setShowTooltip('toggle')}
						onMouseLeave={() => setShowTooltip(null)}
						whileHover={{ scale: 1.2, rotate: 5 }}
						whileTap={{ scale: 0.95 }}
						style={{
							width: expand ? '3.5rem' : '3rem',
							height: expand ? '3.5rem' : '3rem',
						}}>
						<Image
							src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
							alt={expand ? 'Close sidebar' : 'Open sidebar'}
							className={expand ? 'w-10 h-10' : 'w-8 h-8'}
							width={expand ? 40 : 32}
							height={expand ? 40 : 32}
						/>
						<Image
							src={assets.menu_icon}
							alt={expand ? 'Close sidebar' : 'Open sidebar'}
							className='w-5 h-5 md:hidden'
							width={20}
							height={20}
						/>

						{/* Tooltip */}
						<AnimatePresence>
							{showTooltip === 'toggle' && (
								<motion.div
									className={`absolute w-max bg-[#0F1419] text-[#E6E6FA] text-xs px-2 py-1 rounded-lg shadow-lg pointer-events-none z-10 ${
										expand ? 'left-1/2 -translate-x-1/2 top-9' : 'left-0 -top-9'
									}`}
									initial='hidden'
									animate='visible'
									exit='hidden'
									variants={tooltipVariants}>
									{expand ? 'Close sidebar' : 'Open sidebar'}
									<div
										className={`w-2 h-2 absolute bg-[#0F1419] rotate-45 ${
											expand
												? 'left-1/2 -top-1 -translate-x-1/2'
												: 'left-4 -bottom-1'
										}`}
									/>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</div>

				{/* New Chat Button */}
				<motion.div
					className={`mt-4 flex items-center justify-center cursor-pointer mx-3 ${
						expand
							? 'bg-[#FFD700] hover:bg-[#FFEB3B] rounded-lg gap-2 p-2 w-max text-[#1A1C26] shadow-sm shadow-[#FFD700]/20'
							: 'group relative h-8 w-8 mx-auto hover:bg-[#2A2D3A] rounded-lg'
					}`}
					onClick={createNewChat}
					onMouseEnter={() => !expand && setShowTooltip('newChat')}
					onMouseLeave={() => !expand && setShowTooltip(null)}
					whileHover={{
						scale: 1.05,
						boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
					}}
					whileTap={{ scale: 0.95 }}>
					<motion.div
						initial={{ rotate: 0 }}
						animate={{ rotate: expand ? 360 : 0 }}
						transition={{ duration: 0.6, ease: 'easeInOut' }}>
						<Image
							src={expand ? assets.chat_icon : assets.chat_icon_dull}
							alt='New chat'
							className={expand ? 'w-6 h-6 filter invert' : 'w-10 h-10'}
							width={expand ? 24 : 40}
							height={expand ? 24 : 40}
						/>
					</motion.div>
					{expand && (
						<motion.p
							className='text-sm font-lumos tracking-wide'
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: 0.1 }}>
							New Chat
						</motion.p>
					)}

					{/* Tooltip for Collapsed State */}
					<AnimatePresence>
						{!expand && showTooltip === 'newChat' && (
							<motion.div
								className='absolute w-max bg-[#0F1419] text-[#E6E6FA] text-xs px-2 py-1 rounded-lg shadow-lg pointer-events-none z-10 -top-9 left-10'
								initial='hidden'
								animate='visible'
								exit='hidden'
								variants={tooltipVariants}>
								New Chat
								<div className='w-2 h-2 absolute bg-[#0F1419] rotate-45 left-4 -bottom-1' />
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Recent Chats */}
				<motion.div
					className={`mt-6 px-3 py-1 text-[#E6E6FA]/80 ${
						expand ? 'block' : 'hidden'
					} z-20`} // Reduced padding
					initial={{ opacity: 0 }}
					animate={{ opacity: expand ? 1 : 0 }}
					transition={{ duration: 0.4, delay: 0.2 }}>
					<motion.p
						className='text-base font-medium text-[#E6E6FA]/80 mb-2 font-lumos tracking-wide'
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.2 }}>
						Recent Chats
					</motion.p>
					<div className='space-y-2 max-h-[50vh] overflow-y-visible pr-1'>
						{' '}
						{/* Reduced space-y-6 to space-y-2 */}
						{chats.length > 0 ? (
							chats.map((chat, i) => (
								<motion.div
									key={chat._id}
									custom={i}
									initial='hidden'
									animate='visible'
									variants={fadeInVariants}
									className='relative group ]'>
									<ChatLabel
										name={chat.name}
										id={chat._id}
										openMenu={openMenu}
										setOpenMenu={setOpenMenu}
									/>
								</motion.div>
							))
						) : (
							<motion.p
								className='text-xs text-[#E6E6FA]/40 italic font-lumos'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3, delay: 0.3 }}>
								No recent chats
							</motion.p>
						)}
					</div>
				</motion.div>
			</div>

			{/* Bottom Section */}
			<motion.div
				className='pb-3 px-3 border-t border-[#FFD700]/10' // Reduced padding
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.3 }}>
				{/* Get App Button */}
				<motion.div
					className={`flex items-center cursor-pointer group relative ${
						expand
							? 'gap-2 text-[#E6E6FA]/80 text-sm p-2 border border-[#FFD700]/20 rounded-lg hover:bg-[#2A2D3A] transition-colors duration-200'
							: 'h-8 w-8 mx-auto hover:bg-[#2A2D3A] rounded-lg'
					}`}
					onMouseEnter={() => setShowTooltip('getApp')}
					onMouseLeave={() => setShowTooltip(null)}
					whileHover={{
						scale: 1.05,
						boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
					}}
					whileTap={{ scale: 0.95 }}>
					<motion.div
						initial={{ rotate: 0 }}
						animate={{ rotate: expand ? 360 : 0 }}
						transition={{ duration: 0.6, ease: 'easeInOut' }}>
						<Image
							src={expand ? assets.phone_icon : assets.phone_icon_dull}
							alt='Get LumosAI'
							className={expand ? 'w-6 h-6' : 'w-10 h-10 mx-auto'}
							width={expand ? 24 : 40}
							height={expand ? 24 : 40}
						/>
					</motion.div>
					{expand && (
						<motion.div
							className='flex items-center gap-2'
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: 0.1 }}>
							<span className='text-base font-lumos'>Get App</span>
							<Image
								src={assets.new_icon}
								alt='New'
								className='w-10 h-10'
								width={20}
								height={20}
							/>
						</motion.div>
					)}

					{/* QR Code Tooltip */}
					<AnimatePresence>
						{showTooltip === 'getApp' && (
							<motion.div
								className={`absolute w-max bg-[#0F1419] text-[#E6E6FA] text-xs p-2 rounded-lg shadow-lg z-10 ${
									expand ? '-top-40' : '-top-40 -right-32'
								}`}
								initial='hidden'
								animate='visible'
								exit='hidden'
								variants={tooltipVariants}>
								<Image
									src={assets.qrcode}
									alt='QR Code for Lumos AI App'
									className='w-24 h-24 mb-1 rounded-md'
									width={96}
									height={96}
								/>
								<p className='font-lumos text-xs'>Scan to get Lumos AI App</p>
								<div
									className={`w-2 h-2 absolute bg-[#0F1419] rotate-45 ${
										expand
											? 'left-1/2 -bottom-1 -translate-x-1/2'
											: 'left-4 -bottom-1'
									}`}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Profile Section */}
				<motion.div
					className={`flex items-center mt-2 p-2 text-[#E6E6FA]/60 hover:bg-[#2A2D3A] rounded-lg transition-colors duration-200 cursor-pointer ${
						expand ? 'gap-2' : 'justify-center'
					}`}
					whileHover={{
						scale: 1.05,
						boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
					}}
					whileTap={{ scale: 0.95 }}>
					{user ? (
						<UserButton />
					) : (
						<motion.div
							whileHover={{ rotate: 5 }}
							transition={{ duration: 0.2 }}
							onClick={openSignIn}>
							<Image
								src={assets.profile_icon}
								alt='User Profile'
								className={expand ? 'w-8 h-8' : 'w-8 h-8'}
								width={expand ? 32 : 40}
								height={expand ? 32 : 40}
							/>
						</motion.div>
					)}
					{expand && (
						<motion.span
							className='text-base font-lumos'
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: 0.1 }}>
							My Profile
						</motion.span>
					)}
				</motion.div>
			</motion.div>
		</motion.div>
	);
};

export default Sidebar;
