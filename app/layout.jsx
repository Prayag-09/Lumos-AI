import { Inter } from 'next/font/google';
import './globals.css';
import './prism.css';
import { ClerkProvider } from '@clerk/nextjs';
import { AppContextProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';
import { dark } from '@clerk/themes';
import AudioController from '@/components/AudioController';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'swap',
});

export default function RootLayout({ children }) {
	return (
		<ClerkProvider appearance={{ baseTheme: dark }}>
			<AppContextProvider>
				<html lang='en' suppressHydrationWarning>
					<body
						className={`${inter.className} antialiased bg-[#0F1419] text-[#E6E6FA] min-h-screen flex flex-col overflow-x-hidden`}>
						<Toaster position='top-right' />
						<main
							aria-label='Lumos AI Main Content'
							className='flex-grow w-full'>
							{children}
						</main>
						<AudioController />
					</body>
				</html>
			</AppContextProvider>
		</ClerkProvider>
	);
}
