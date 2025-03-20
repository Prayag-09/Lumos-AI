'use client';
import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from 'react';
import toast from 'react-hot-toast';

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
	const { user } = useUser();
	const { getToken } = useAuth();

	const [chats, setChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);

	const fetchUsersChats = useCallback(async () => {
		try {
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

				if (sortedChats.length > 0) {
					setSelectedChat(sortedChats[0]);
				} else {
					// Auto-create if no chats
					const createdChat = await createNewChat();
					if (createdChat) setSelectedChat(createdChat);
				}
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	}, [getToken]);

	const createNewChat = useCallback(async () => {
		try {
			if (!user) return null;
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
				// Update state immediately
				setChats((prev) => [data.chat, ...prev]);
				setSelectedChat(data.chat);
				return data.chat;
			} else {
				toast.error(data.message || 'Chat creation failed');
			}
		} catch (error) {
			toast.error(error.message);
		}
	}, [getToken, user]);

	useEffect(() => {
		if (user) {
			fetchUsersChats();
		}
	}, [user, fetchUsersChats]);

	const value = {
		user,
		chats,
		setChats,
		selectedChat,
		setSelectedChat,
		fetchUsersChats,
		createNewChat,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
