'use client';
import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioController() {
	const audioRef = useRef(null);
	const [isMuted, setIsMuted] = useState(true);
	const [hasStarted, setHasStarted] = useState(false);

	const startAudio = () => {
		if (audioRef.current && !hasStarted) {
			audioRef.current.muted = false;
			audioRef.current.volume = 0.4;
			audioRef.current
				.play()
				.catch((err) => console.log('Autoplay blocked:', err));
			setHasStarted(true);
			setIsMuted(false);
		}
	};

	const toggleMute = () => {
		if (audioRef.current) {
			const newMuteState = !isMuted;
			audioRef.current.muted = newMuteState;
			setIsMuted(newMuteState);
		}
	};

	return (
		<>
			<audio ref={audioRef} src='/music.mp3' loop preload='none' />{' '}
			{/* Don't preload */}
			<button
				onClick={!hasStarted ? startAudio : toggleMute}
				aria-label={
					!hasStarted
						? 'Start background music'
						: isMuted
						? 'Unmute background music'
						: 'Mute background music'
				}
				className='fixed bottom-5 right-5 bg-black/60 hover:bg-black/80 transition rounded-full p-3 z-[9999] backdrop-blur-md shadow-md border border-yellow-400'>
				{!hasStarted ? (
					<VolumeX color='white' />
				) : isMuted ? (
					<VolumeX color='white' />
				) : (
					<Volume2 color='white' />
				)}
			</button>
		</>
	);
}
