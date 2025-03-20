import { Inter } from 'next/font/google';
import './globals.css';
import './prism.css';
import { ClerkProvider } from '@clerk/nextjs';
import { AppContextProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';

// Configure the Inter font
const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'swap',
});

// Enhanced metadata for SEO and accessibility
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
		url: 'https://lumos-ai.example.com',
		siteName: 'Lumos AI',
		images: [
			{
				url: 'https://lumos-ai.example.com/og-image.jpg',
				width: 1200,
				height: 630,
				alt: 'Lumos AI - A magical coding assistant',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Lumos AI - Illuminate Your Code',
		description:
			'Discover Lumos AI, a magical coding assistant inspired by Harry Potter, powered by Gemini.',
		images: ['https://lumos-ai.example.com/twitter-image.jpg'],
	},
	icons: {
		icon: '/favicon.ico',
		apple: '/apple-touch-icon.png',
	},
};

export default function RootLayout({ children }) {
	return (
		<ClerkProvider>
			<AppContextProvider>
				<html lang='en' suppressHydrationWarning>
					<body
						className={`${inter.className} antialiased bg-[#0F1419] text-[#E6E6FA] min-h-screen flex flex-col`}>
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
						/>
						<main aria-label='Lumos AI Main Content' className='flex-grow'>
							{children}
						</main>
						<footer
							aria-label='Lumos AI Footer'
							className='py-4 text-center text-[#E6E6FA]/60 text-sm hover:text-[#FFD700] transition-colors duration-300'>
							© {new Date().getFullYear()} Lumos AI — Powered by Prayag
						</footer>
					</body>
				</html>
			</AppContextProvider>
		</ClerkProvider>
	);
}
