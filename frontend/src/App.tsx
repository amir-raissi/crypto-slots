import React from 'react';
import SlotMachine from 'react-slot-machine-gen';
import Slots from './assets/slots.jpg';
import './styles/App.css';

function App() {
	const [play, setPlay] = React.useState(false);
	const height = 1181;
	const total = 10;
	const individualHeight = height / total;
	const centerOffset = individualHeight / 2;
	const symbols: any[] = [];
	for (let i = 0; i < total; i++) {
		symbols.push({
			title: 'nice',
			position: centerOffset + individualHeight * i,
			weight: 1,
		});
	}
	const reels = [
		{
			imageSrc: Slots,
			symbols,
		},
	];
	return (
		// <div style={{ background: 'gray' }}>
		<div style={{ background: './assets/slots.jpg' }}>
			<p>Main Page</p>
			<button id="play-button" onClick={() => setPlay(!play)}>
				Play
			</button>
			<SlotMachine reels={reels} play={play} options={{ reelHeight: height }} />
		</div>
	);
}

export default App;
