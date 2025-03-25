'use client';

import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth, useClerk, UserButton } from '@clerk/nextjs';
import { useAppContext } from '@/context/AppContext';
import ChatLabel from './ChatLabel';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for sidebar expansion
const sidebarVariants = {
	expanded: {
		width: '14rem', // Base width (will be overridden by CSS for smaller screens)
		padding: '0.75rem',
	},
	collapsed: {
		width: '4.5rem',
		padding: '0.5rem',
	},
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
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoadingChats, setIsLoadingChats] = useState(true);
	const sidebarRef = useRef(null);
	const searchInputRef = useRef(null);

	// Close sidebar on mobile when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				expand &&
				window.innerWidth < 768 &&
				sidebarRef.current &&
				!sidebarRef.current.contains(e.target)
			) {
				setExpand(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [expand, setExpand]);

	// Simulate loading chats (replace with actual API call if needed)
	useEffect(() => {
		const timer = setTimeout(() => setIsLoadingChats(false), 1000);
		return () => clearTimeout(timer);
	}, []);

	// Filter chats based on search query
	const filteredChats = useMemo(() => {
		if (!searchQuery) return chats;
		return chats.filter((chat) =>
			chat.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [chats, searchQuery]);

	// Focus search input when sidebar expands
	useEffect(() => {
		if (expand && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [expand]);

	return (
		<motion.div
			className='sidebar flex flex-col justify-between h-screen max-md:fixed max-md:z-50 bg-[#1A1C26] text-[#E6E6FA] shadow-lg shadow-[#FFD700]/10 relative'
			animate={expand ? 'expanded' : 'collapsed'}
			variants={sidebarVariants}
			initial={false}
			transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
			ref={sidebarRef}
			tabIndex={0}
			role='navigation'
			aria-label='Sidebar navigation'>
			{/* Top Section */}
			<div>
				{/* Header with Logo and Toggle */}
				<div
					className={`flex items-center px-2 sm:px-3 ${
						expand ? 'justify-between' : 'flex-col gap-2 items-center'
					}`}>
					<motion.div
						variants={logoVariants}
						initial='hidden'
						animate='visible'>
						<Image
							className='rounded-full border-2 border-[#FFD700]/40 hover:border-[#FFD700]/60 transition-all duration-300'
							src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGZtanhzY2tpdWpteTh2Z2NodWJ2dzBya2d2c2R1anFydWdsZzhweSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/dgzRXtAF6gTd0xXMJx/giphy.gif'
							alt='Lumos AI Logo'
							width={expand ? 40 : 36}
							height={expand ? 40 : 36}
							priority
						/>
					</motion.div>

					{/* Lumos Logo Text */}
					{expand && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}>
							<span className='text-[#FFD700] font-lumos text-lg sm:text-xl md:text-2xl tracking-wide'>
								Lumos AI ✨
							</span>
						</motion.div>
					)}

					{/* Sidebar Toggle Button */}
					<motion.div
						className='group relative flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 hover:bg-[#2A2D3A]/50 rounded-lg cursor-pointer transition-colors duration-200 z-50'
						onClick={() => setExpand(!expand)}
						onMouseEnter={() => setShowTooltip('toggle')}
						onMouseLeave={() => setShowTooltip(null)}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						role='button'
						aria-label={expand ? 'Close sidebar' : 'Open sidebar'}>
						<Image
							src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
							alt={expand ? 'Close sidebar' : 'Open sidebar'}
							className='w-4 h-4 sm:w-5 sm:h-5'
							width={expand ? 16 : 20}
							height={expand ? 16 : 20}
						/>

						{/* Tooltip */}
						<AnimatePresence>
							{showTooltip === 'toggle' && (
								<motion.div
									className={`absolute w-max bg-[#0F1419] text-[#E6E6FA] text-xs px-2 py-1 rounded-lg shadow-lg pointer-events-none z-50 ${
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
					className={`mt-3 flex items-center justify-center cursor-pointer mx-2 sm:mx-3 ${
						expand
							? 'bg-[#FFD700] hover:bg-[#FFEB3B] rounded-lg gap-2 py-1.5 px-2 sm:py-2 sm:px-3 text-[#1A1C26] shadow-sm shadow-[#FFD700]/20'
							: 'group relative h-8 w-8 sm:h-9 sm:w-9 mx-auto hover:bg-[#2A2D3A]/50 rounded-lg'
					}`}
					onClick={createNewChat}
					onMouseEnter={() => !expand && setShowTooltip('newChat')}
					onMouseLeave={() => !expand && setShowTooltip(null)}
					whileHover={{
						scale: 1.05,
						boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
					}}
					whileTap={{ scale: 0.95 }}
					role='button'
					aria-label='Create new chat'>
					<motion.div
						initial={{ rotate: 0 }}
						animate={{ rotate: expand ? 360 : 0 }}
						transition={{ duration: 0.6, ease: 'easeInOut' }}>
						<Image
							src={expand ? assets.chat_icon : assets.chat_icon_dull}
							alt='New chat'
							className={
								expand
									? 'w-4 h-4 sm:w-5 sm:h-5 filter invert'
									: 'w-5 h-5 sm:w-6 sm:h-6'
							}
							width={expand ? 16 : 20}
							height={expand ? 16 : 20}
						/>
					</motion.div>
					{expand && (
						<motion.p
							className='text-xs sm:text-sm font-medium font-lumos tracking-wide'
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
								className='absolute w-max bg-[#0F1419] text-[#E6E6FA] text-xs px-2 py-1 rounded-lg shadow-lg pointer-events-none z-50 -top-9 left-10'
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
					className={`mt-3 px-2 sm:px-3 py-1 text-[#E6E6FA]/80 ${
						expand ? 'block' : 'hidden'
					} recent-chats-container`}
					initial={{ opacity: 0 }}
					animate={{ opacity: expand ? 1 : 0 }}
					transition={{ duration: 0.4, delay: 0.2 }}>
					{/* Search Bar */}
					<motion.div
						className='relative mb-2'
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.2 }}>
						<input
							type='text'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder='Search chats...'
							className='w-full px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg bg-[#2A2D3A]/50 border border-[#FFD700]/20 text-[#E6E6FA] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all duration-200'
							ref={searchInputRef}
							aria-label='Search chats'
						/>
						<Image
							src={assets.search_icon}
							alt='Search'
							className='absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 opacity-50'
							width={12}
							height={12}
						/>
					</motion.div>

					<motion.p
						className='text-sm sm:text-base font-medium text-[#E6E6FA]/80 mb-1 sm:mb-2 font-lumos tracking-wide'
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.2 }}>
						Recent Chats
					</motion.p>
					<hr className='border-[#FFD700]/20 mb-1 sm:mb-2' />
					<div className='space-y-1 sm:space-y-2 max-h-[40vh] sm:max-h-[45vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#FFD700]/50 hover:scrollbar-thumb-[#FFD700]/70 scrollbar-track-transparent pr-1 sm:pr-2 scroll-smooth'>
						{isLoadingChats ? (
							<motion.p
								className='text-xs sm:text-sm text-[#E6E6FA]/40 italic font-lumos animate-pulse'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
								aria-live='polite'>
								Loading chats...
							</motion.p>
						) : filteredChats.length > 0 ? (
							filteredChats.map((chat, i) => (
								<motion.div
									key={chat._id}
									custom={i}
									initial='hidden'
									animate='visible'
									exit='hidden'
									variants={fadeInVariants}
									layout
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className='w-[90%] absolute z-[999]'>
									<ChatLabel
										name={chat.name}
										id={chat._id}
										openMenu={openMenu}
										setOpenMenu={setOpenMenu}
										expand={expand}
									/>
								</motion.div>
							))
						) : (
							<motion.p
								className='text-xs sm:text-sm text-[#E6E6FA]/40 italic font-lumos'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3, delay: 0.3 }}
								aria-live='polite'>
								{searchQuery ? 'No matching chats' : 'No recent chats'}
							</motion.p>
						)}
					</div>
				</motion.div>
			</div>

			{/* Bottom Section */}
			<motion.div
				className='pb-2 sm:pb-3 px-2 sm:px-3 border-t border-[#FFD700]/10'
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.3 }}>
				{/* Get App Button */}
				<motion.div
					className={`flex items-center cursor-pointer group relative mt-1 sm:mt-2 ${
						expand
							? 'gap-2 text-[#E6E6FA]/80 text-xs sm:text-sm py-1.5 px-2 sm:py-2 sm:px-3 border border-[#FFD700]/20 rounded-lg hover:bg-[#2A2D3A]/50 transition-colors duration-200'
							: 'h-8 w-8 sm:h-9 sm:w-9 mx-auto hover:bg-[#2A2D3A]/50 rounded-lg'
					}`}
					onMouseEnter={() => setShowTooltip('getApp')}
					onMouseLeave={() => setShowTooltip(null)}
					whileHover={{
						scale: 1.05,
						boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
					}}
					whileTap={{ scale: 0.95 }}
					role='button'
					aria-label='Get Lumos AI App'>
					<motion.div
						initial={{ rotate: 0 }}
						animate={{ rotate: expand ? 360 : 0 }}
						transition={{ duration: 0.6, ease: 'easeInOut' }}>
						<Image
							src={expand ? assets.phone_icon : assets.phone_icon_dull}
							alt='Get Lumos AI App'
							className={
								expand
									? 'w-4 h-4 sm:w-5 sm:h-5'
									: 'w-5 h-5 sm:w-6 sm:h-6 mx-auto'
							}
							width={expand ? 16 : 20}
							height={expand ? 16 : 20}
						/>
					</motion.div>
					{expand && (
						<motion.div
							className='flex items-center gap-1 sm:gap-2'
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: 0.1 }}>
							<span className='text-xs sm:text-base font-medium font-lumos'>
								Get App
							</span>
							<Image
								src={assets.new_icon}
								alt='New'
								className='w-3 h-3 sm:w-4 sm:h-4'
								width={12}
								height={12}
							/>
						</motion.div>
					)}

					{/* QR Code Tooltip */}
					<AnimatePresence>
						{showTooltip === 'getApp' && (
							<motion.div
								className={`absolute w-max bg-[#0F1419] text-[#E6E6FA] text-xs p-2 rounded-lg shadow-lg z-50 ${
									expand
										? '-top-36 sm:-top-40'
										: '-top-36 sm:-top-40 -right-28 sm:-right-32'
								}`}
								initial='hidden'
								animate='visible'
								exit='hidden'
								variants={tooltipVariants}>
								<Image
									src={assets.qrcode}
									alt='QR Code for Lumos AI App'
									className='w-20 h-20 sm:w-24 sm:h-24 mb-1 rounded-md'
									width={80}
									height={80}
								/>
								<p className='font-lumos text-xs sm:text-sm'>
									Scan to get Lumos AI App
								</p>
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
					className={`flex items-center mt-1 sm:mt-2 p-1 sm:p-2 text-[#E6E6FA]/60 hover:bg-[#2A2D3A]/50 rounded-lg transition-colors duration-200 cursor-pointer ${
						expand ? 'gap-1 sm:gap-2' : 'justify-center'
					}`}
					whileHover={{
						scale: 1.05,
						boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
					}}
					whileTap={{ scale: 0.95 }}
					role='button'
					aria-label='User profile'>
					{user ? (
						<UserButton />
					) : (
						<motion.div
							whileHover={{ rotate: 5 }}
							transition={{ duration: 0.2 }}
							onClick={() => openSignIn({ redirectUrl: '/' })}>
							<Image
								src={assets.profile_icon}
								alt='User Profile'
								className='w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[#FFD700]/20 hover:border-[#FFD700]/50 transition-all duration-200'
								width={20}
								height={20}
							/>
						</motion.div>
					)}
					{expand && (
						<motion.span
							className='text-xs sm:text-sm font-medium font-lumos'
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

export default React.memo(Sidebar);
