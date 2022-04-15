import React from 'react';
import SlotContainer from './components/SlotContainer';
import CustomNavbar from './components/CustomNavbar';
import './styles/App.css';

import { Goerli, DAppProvider, Config } from '@usedapp/core';

const config: Config = {
	readOnlyChainId: Goerli.chainId,
	readOnlyUrls: {
		[Goerli.chainId]:
			'https://eth-goerli.alchemyapi.io/v2/AxnmGEYn7VDkC4KqfNSFbSW9pHFR7PDO',
	},
};

function App() {
	return (
		<div className='app'>
			<DAppProvider config={config}>
				<CustomNavbar />
				<SlotContainer />
			</DAppProvider>
		</div>
	);
}

export default App;
