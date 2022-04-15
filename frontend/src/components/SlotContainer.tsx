import React from 'react';
import SlotMachine from 'react-slot-machine-gen';
import Slots from '../assets/slots.jpg';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEtherBalance, useEthers } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';

function SlotContainer() {
	const { activateBrowserWallet, account, deactivate } = useEthers();
	const etherBalance = useEtherBalance(account);
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
	const height = 1241;
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

	const handlePlay = () => {
		setSpinning(true);
		setPlay(!play);
	};

	const actionButton = account ? (
		<div className='container--actions'>
			<Button
				className='button--slots'
				variant='contained'
				disabled={spinning}
				onClick={() => handlePlay()}
			>
				{spinning ? 'Good luck!' : 'Play'}
			</Button>
			<Button
				className='button--deactivate'
				variant='contained'
				color='error'
				onClick={() => deactivate()}
			>
				Disconnect
			</Button>
		</div>
	) : (
		<div className='container--connect'>
			<Button
				onClick={() => activateBrowserWallet()}
				variant='contained'
				color='info'
			>
				Connect Wallet
			</Button>
		</div>
	);
	return (
		<div className='container--slots'>
			<Card className='card' sx={{ minWidth: 275 }}>
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
						{account ? 'Account balance' : 'Welcome!'}
					</Typography>
					<Typography sx={{ mt: 1.5 }} variant='h3' component='div'>
						{!!etherBalance &&
							`${parseFloat(formatEther(etherBalance)).toFixed(4)} ETH`}
					</Typography>
				</CardContent>
				<CardActions>{actionButton}</CardActions>
			</Card>
			<SlotMachine
				reels={reels}
				play={play}
				options={{ reelHeight: height, reelWidth: 100, reelOffset: 20 }}
				callback={(e) => handleResult(e)}
			/>
		</div>
	);
}

export default SlotContainer;
