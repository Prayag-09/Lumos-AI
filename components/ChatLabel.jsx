'use client';

import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const menuVariants = {
	hidden: { opacity: 0, y: -5, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.2 },
	},
	exit: { opacity: 0, y: -5, scale: 0.95, transition: { duration: 0.15 } },
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
		} catch (err) {
			toast.error('Rename failed.');
		}
	};

	const handleDelete = async (e) => {
		e.stopPropagation();
		if (!window.confirm('Delete this chat?')) return;
		try {
			setIsDeleting(true);
			const { data } = await axios.post('/api/chat/delete', { chatId: id });
			if (data.success) {
				toast.success('Chat deleted.');
				fetchUsersChats();
				setOpenMenu({ id: 0, open: false });
			}
		} catch (err) {
			toast.error('Delete failed.');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<motion.div
			className='relative flex items-center justify-between p-3 bg-[#1A1C26] rounded-md cursor-pointer hover:bg-[#2A2D3A] select-none'
			onClick={selectChat}>
			<p className='truncate  text-[#E6E6FA] font-lumos text-lg font-bold'>
				{name || 'Untitled Chat'}
			</p>

			<div className='relative'>
				<motion.button
					onClick={toggleMenu}
					className='h-7 w-7 flex items-center justify-center rounded-full hover:bg-[#2A2D3A]'
					whileHover={{ scale: 1.15 }}
					aria-label='Chat options'>
					<Image src={assets.three_dots} alt='Options' width={16} height={16} />
				</motion.button>

				<AnimatePresence>
					{openMenu.id === id && openMenu.open && (
						<motion.div
							className='absolute right-0 top-9 bg-[#1A1C26] border border-gray-700 rounded-md p-2 w-40 shadow-lg z-50 space-y-1'
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
										className='w-full text-xs px-2 py-1 rounded bg-[#2A2D3A] border border-gray-600 text-[#E6E6FA]'
										placeholder='New chat name...'
									/>
									<button
										type='submit'
										className='bg-yellow-400 px-2 py-1 rounded text-black text-xs hover:bg-yellow-500'>
										Save
									</button>
								</form>
							) : (
								<>
									<button
										onClick={() => setRenameMode(true)}
										className='w-full text-left text-sm px-2 py-1 hover:bg-[#2A2D3A] rounded text-[#E6E6FA]'>
										Rename
									</button>
									<button
										onClick={handleDelete}
										className={`w-full text-left text-sm px-2 py-1 hover:bg-[#2A2D3A] rounded ${
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
