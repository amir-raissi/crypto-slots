import React from 'react';
import SlotMachine from 'react-slot-machine-gen';
import Slots from '../assets/slots.jpg';
import Button from '@mui/material/Button';

function SlotContainer() {
	const [play, setPlay] = React.useState(false);
	const [spinning, setSpinning] = React.useState(false);
	const icons: string[] = [
		'bell',
		'cash',
		'orange',
		'lemon',
		'grapes',
		'cherries',
		'7',
		'cherries',
		'orange',
		'bar',
	];

	// hardcoded height of slot image
	const height = 1181;
	const total = icons.length;
	const individualHeight = height / total;
	const centerOffset = individualHeight / 2;
	const symbols: any[] = [];
	for (let i = 0; i < total; i++) {
		symbols.push({
			title: icons[i],
			position: centerOffset + individualHeight * i,
			weight: 1,
		});
	}
	const reels = [
		{
			imageSrc: Slots,
			symbols,
		},
		{
			imageSrc: Slots,
			symbols,
		},
		{
			imageSrc: Slots,
			symbols,
		},
	];
	const handleResult = (results) => {
		setSpinning(false);
		console.log(results.map((r) => r.title));
	};
	return (
		<div className="container--slots">
			<Button
				className="button--slots"
				variant="contained"
				disabled={spinning}
				onClick={() => {
					setSpinning(true);
					setPlay(!play);
				}}
			>
				{spinning ? 'Good luck!' : 'Play'}
			</Button>
			<SlotMachine
				reels={reels}
				play={play}
				options={{ reelHeight: height, reelWidth: 100 }}
				callback={(e) => handleResult(e)}
			/>
		</div>
	);
}

export default SlotContainer;
