'use client';

import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const menuVariants = {
	hidden: { opacity: 0, y: -5, x: 10, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		x: 0,
		scale: 1,
		transition: { duration: 0.2, ease: 'easeOut' },
	},
	exit: {
		opacity: 0,
		y: -5,
		x: 10,
		scale: 0.95,
		transition: { duration: 0.15 },
	},
};

const ChatLabel = ({ openMenu, setOpenMenu, id, name }) => {
	const { fetchUsersChats, chats, setSelectedChat } = useAppContext();
	const [renameMode, setRenameMode] = useState(false);
	const [newName, setNewName] = useState(name);
	const [isDeleting, setIsDeleting] = useState(false);

	const selectChat = () => {
		const chat = chats.find((c) => c._id === id);
		if (chat) setSelectedChat(chat);
	};

	const toggleMenu = (e) => {
		e.stopPropagation();
		setOpenMenu((prev) => ({
			id,
			open: prev.id === id ? !prev.open : true,
		}));
		setRenameMode(false);
	};

	const handleRename = async (e) => {
		e.preventDefault();
		if (!newName.trim()) {
			toast.error('Chat name cannot be empty.');
			return;
		}
		try {
			const { data } = await axios.post('/api/chat/rename', {
				chatId: id,
				name: newName.trim(),
			});
			if (data.success) {
				toast.success('Chat renamed!');
				fetchUsersChats();
				setRenameMode(false);
				setOpenMenu({ id: 0, open: false });
			}
		} catch {
			toast.error('Rename failed.');
		}
	};

	const handleDelete = async (e) => {
		e.stopPropagation();
		if (!window.confirm('Are you sure you want to delete this chat?')) return;
		try {
			setIsDeleting(true);
			const { data } = await axios.post('/api/chat/delete', { chatId: id });
			if (data.success) {
				toast.success('Chat deleted.');
				fetchUsersChats();
				setOpenMenu({ id: 0, open: false });
			}
		} catch {
			toast.error('Delete failed.');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<motion.div
			className='relative flex items-center justify-between p-2 sm:p-3 bg-[#1A1C26] rounded-md cursor-pointer hover:bg-[#2A2D3A] transition-colors'
			onClick={selectChat}>
			<p className='truncate text-[#E6E6FA] font-lumos text-sm sm:text-base md:text-lg font-medium'>
				{name || 'Untitled Chat'}
			</p>

			<div className='relative z-30'>
				<motion.button
					onClick={toggleMenu}
					className='h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-full hover:bg-[#2A2D3A] transition-colors'
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					aria-label='Chat options'>
					<Image
						src={assets.three_dots}
						alt='Options'
						width={14}
						height={14}
						className='w-3.5 h-3.5 sm:w-4 sm:h-4'
					/>
				</motion.button>

				<AnimatePresence>
					{openMenu.id === id && openMenu.open && (
						<motion.div
							className='absolute right-0 top-10 origin-top-right bg-[#1C1F2B] border border-gray-700 rounded-lg p-2 w-44 min-w-max shadow-xl z-50'
							initial='hidden'
							animate='visible'
							exit='exit'
							variants={menuVariants}
							onClick={(e) => e.stopPropagation()}>
							{renameMode ? (
								<form onSubmit={handleRename} className='flex gap-1'>
									<input
										type='text'
										value={newName}
										onChange={(e) => setNewName(e.target.value)}
										autoFocus
										className='w-full absolute text-xs sm:text-sm px-2 py-1 rounded bg-[#2A2D3A] border border-gray-600 text-[#E6E6FA] focus:outline-none focus:ring-1 focus:ring-yellow-400'
										placeholder='Enter new name...'
									/>
									<button
										type='submit'
										className='bg-yellow-400 px-2 py-1 rounded text-black text-xs sm:text-sm hover:bg-yellow-500 transition-colors'>
										Save
									</button>
								</form>
							) : (
								<>
									<button
										onClick={() => setRenameMode(true)}
										className='w-full text-left text-xs sm:text-sm px-2 py-1 hover:bg-[#2A2D3A] rounded text-[#E6E6FA] transition-colors'>
										Rename
									</button>
									<button
										onClick={handleDelete}
										className={`w-full text-left text-xs sm:text-sm px-2 py-1 hover:bg-[#2A2D3A] rounded transition-colors ${
											isDeleting ? 'text-gray-400' : 'text-red-400'
										}`}
										disabled={isDeleting}>
										{isDeleting ? 'Deleting...' : 'Delete'}
									</button>
								</>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
};

export default ChatLabel;
