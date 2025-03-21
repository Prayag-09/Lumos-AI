import { Inter } from 'next/font/google';
import './globals.css';
import './prism.css';
import { ClerkProvider } from '@clerk/nextjs';
import { AppContextProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';
import { dark } from '@clerk/themes';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'swap',
});

export const metadata = {
	title: {
		default: 'Lumos AI - Illuminate Your Code',
		template: '%s | Lumos AI',
	},
	description:
		'Lumos AI: A magical AI-powered coding assistant inspired by the Wizarding World, built with Gemini integration.',
	keywords: [
		'Lumos AI',
		'Harry Potter',
		'coding assistant',
		'AI',
		'Gemini',
		'programming',
	],
	openGraph: {
		title: 'Lumos AI - Illuminate Your Code',
		description:
			'Discover Lumos AI, a magical coding assistant inspired by Harry Potter, powered by Gemini.',
		url: 'https://lumos-maxima.vercel.app/',
		siteName: 'Lumos AI',
		locale: 'en_IN',
		type: 'website',
	},
	viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
	return (
		<ClerkProvider appearance={{ baseTheme: dark }}>
			<AppContextProvider>
				<html lang='en' suppressHydrationWarning>
					<body
						className={`${inter.className} antialiased bg-[#0F1419] text-[#E6E6FA] min-h-screen flex flex-col overflow-x-hidden`}>
						<Toaster
							position='top-right'
							toastOptions={{
								style: {
									background: '#1A1C26',
									color: '#FFD700',
									border: '1px solid #FFD700',
									borderRadius: '8px',
									fontFamily: 'Lumos, cursive',
									boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)',
									padding: '8px 12px',
									fontSize: '14px',
									maxWidth: '90vw',
									wordBreak: 'break-word',
								},
								success: {
									iconTheme: {
										primary: '#FFD700',
										secondary: '#1A1C26',
									},
								},
								error: {
									iconTheme: {
										primary: '#FF5555',
										secondary: '#1A1C26',
									},
								},
							}}
							containerStyle={{
								top: '16px',
								right: '16px',
								zIndex: 9999,
							}}
						/>
						<main
							aria-label='Lumos AI Main Content'
							className='flex-grow w-full'>
							{children}
						</main>
					</body>
				</html>
			</AppContextProvider>
		</ClerkProvider>
	);
}
