'use client';
import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	useMemo,
} from 'react';
import toast from 'react-hot-toast';

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
	const { user } = useUser();
	const { getToken } = useAuth();

	const [chats, setChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [loadingChats, setLoadingChats] = useState(false);

	const fetchUsersChats = useCallback(async () => {
		if (!user) return;
		try {
			setLoadingChats(true);
			const token = await getToken();
			const { data } = await axios.get('/api/chat/get', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (data.success) {
				const sortedChats = data.data.sort(
					(a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
				);

				setChats(sortedChats);
				// Only select chat if there are existing chats
				if (sortedChats.length > 0) {
					setSelectedChat(sortedChats[0]);
				}
			} else {
				toast.error(data.message || 'Failed to load chats.');
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					error.message ||
					'An unexpected error occurred while fetching chats.'
			);
		} finally {
			setLoadingChats(false);
		}
	}, [getToken, user]);

	const createNewChat = useCallback(async () => {
		try {
			if (!user) {
				toast.error('Please log in to create a chat.');
				return null;
			}
			const token = await getToken();

			const { data } = await axios.post(
				'/api/chat/create',
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (data.success && data.chat) {
				setChats((prev) => [data.chat, ...prev]);
				setSelectedChat(data.chat);
				return data.chat;
			} else {
				toast.error(data.message || 'Chat creation failed');
				return null;
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					error.message ||
					'An unexpected error occurred while creating chat.'
			);
			return null;
		}
	}, [getToken, user]);

	useEffect(() => {
		if (user) {
			fetchUsersChats();
		}
	}, [user, fetchUsersChats]);

	const contextValue = useMemo(
		() => ({
			user,
			chats,
			setChats,
			selectedChat,
			setSelectedChat,
			fetchUsersChats,
			createNewChat,
			loadingChats,
		}),
		[user, chats, selectedChat, fetchUsersChats, createNewChat, loadingChats]
	);

	return (
		<AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
	);
};
