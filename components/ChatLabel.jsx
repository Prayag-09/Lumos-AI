'use client';

import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const menuVariants = {
	hidden: { opacity: 0, y: -10, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.3, type: 'spring', stiffness: 400, damping: 20 },
	},
	exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
};

const glowVariants = {
	rest: { boxShadow: '0 0 5px rgba(255, 215, 0, 0.2)' },
	hover: {
		boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
		scale: 1.02,
		transition: { duration: 0.3 },
	},
};

const ChatLabel = ({ openMenu, setOpenMenu, id, name }) => {
	const { fetchUsersChats, chats, setSelectedChat } = useAppContext();
	const [isDeleting, setIsDeleting] = useState(false);
	const [renameMode, setRenameMode] = useState(false);
	const [newName, setNewName] = useState(name);

	const selectChat = () => {
		const chatData = chats.find((chat) => chat._id === id);
		if (chatData) setSelectedChat(chatData);
		else toast.error('Chat not found');
	};

	const handleRename = async (e) => {
		e.preventDefault();
		if (!newName.trim()) {
			toast.error('Chat name cannot be empty');
			return;
		}
		try {
			const { data } = await axios.post('/api/chat/rename', {
				chatId: id,
				name: newName.trim(),
			});
			if (data.success) {
				toast.success(data.message);
				fetchUsersChats();
				setRenameMode(false);
				setOpenMenu({ id: 0, open: false });
			} else toast.error(data.message);
		} catch (err) {
			toast.error(err.message);
		}
	};

	const deleteHandler = async (e) => {
		e.stopPropagation();
		if (!window.confirm('Are you sure you want to delete this chat?')) return;
		try {
			setIsDeleting(true);
			const { data } = await axios.post('/api/chat/delete', { chatId: id });
			if (data.success) {
				fetchUsersChats();
				toast.success(data.message);
				setOpenMenu({ id: 0, open: false });
			} else toast.error(data.message);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setIsDeleting(false);
		}
	};

	const toggleMenu = (e) => {
		e.stopPropagation();
		setOpenMenu((prev) => ({
			id,
			open: prev.id === id ? !prev.open : true,
		}));
		setRenameMode(false); // Close rename mode if menu reopens
	};

	return (
		<motion.div
			className='relative flex items-center justify-between p-3 text-[#E6E6FA]/90 rounded-xl cursor-pointer transition-all z-20 bg-gradient-to-r from-[#1A1C26]/80 to-[#2A2D3A]/80 border-2 border-[#FFD700]/30 hover:border-[#FFD700]/50 shadow-md shadow-[#FFD700]/10 group'
			onClick={selectChat}
			whileHover='hover'
			whileTap={{ scale: 0.98 }}
			variants={glowVariants}
			initial='rest'>
			<motion.p
				className='truncate font-lumos text-md font-semibold text-[#E6E6FA]'
				initial={{ opacity: 0, x: -10 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.3, ease: 'easeOut' }}>
				{name || 'Unnamed Chat'}
			</motion.p>

			{/* Menu button */}
			<div className='relative flex items-center justify-center h-7 w-7 z-50'>
				<motion.button
					onClick={toggleMenu}
					className='h-7 w-7 flex items-center justify-center rounded-full bg-[#1A1C26]/50 hover:bg-[#FFD700]/20 opacity-0 group-hover:opacity-100 focus:opacity-100 border border-[#FFD700]/30'
					aria-label='Chat options'
					whileHover={{ scale: 1.1, rotate: 5 }}
					whileTap={{ scale: 0.9 }}>
					<Image
						src={assets.three_dots}
						alt='Chat options menu'
						width={16}
						height={16}
						className='w-4 h-4'
					/>
				</motion.button>

				{/* Dropdown with inline rename */}
				<AnimatePresence>
					{openMenu.id === id && openMenu.open && (
						<motion.div
							className='absolute right-0 top-10 bg-[#1A1C26]/90 rounded-xl w-44 p-4 shadow-xl border-2 border-[#FFD700]/40 z-[200] backdrop-blur-sm space-y-3'
							initial='hidden'
							animate='visible'
							exit='exit'
							variants={menuVariants}
							onClick={(e) => e.stopPropagation()}>
							{renameMode ? (
								<form onSubmit={handleRename} className='flex gap-2'>
									<input
										type='text'
										value={newName}
										onChange={(e) => setNewName(e.target.value)}
										autoFocus
										className='w-full px-3 py-1 rounded bg-[#2A2D3A] border border-[#FFD700]/20 text-[#E6E6FA]'
									/>
									<button
										type='submit'
										className='bg-yellow-500 px-2 py-1 rounded text-black hover:bg-yellow-600'>
										Save
									</button>
								</form>
							) : (
								<>
									<motion.button
										onClick={() => setRenameMode(true)}
										className='flex items-center gap-3 w-full hover:bg-[#2A2D3A]/80 px-3 py-2 rounded-lg text-[#E6E6FA] text-sm font-lumos border-b border-[#FFD700]/20'
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}>
										<Image
											src={assets.pencil_icon}
											alt='Rename chat'
											width={16}
											height={16}
										/>
										<span>Rename</span>
									</motion.button>
									<motion.button
										onClick={deleteHandler}
										className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[#E6E6FA] text-sm font-lumos ${
											isDeleting
												? 'opacity-50 cursor-not-allowed'
												: 'hover:bg-[#2A2D3A]/80'
										}`}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										disabled={isDeleting}>
										<Image
											src={assets.delete_icon}
											alt='Delete chat'
											width={16}
											height={16}
										/>
										<span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
									</motion.button>
								</>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Subtle glow overlay */}
			<motion.div
				className='absolute inset-0 rounded-xl bg-[#FFD700]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
				initial={{ opacity: 0 }}
				animate={{ opacity: 0 }}
				whileHover={{ opacity: 1 }}
			/>
		</motion.div>
	);
};

export default ChatLabel;
