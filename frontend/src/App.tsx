import React from 'react';
import SlotContainer from './components/SlotContainer';
import CustomNavbar from './components/CustomNavbar';
import './styles/App.css';

import { Mainnet, DAppProvider, Config } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';

const config: Config = {
	readOnlyChainId: Mainnet.chainId,
	readOnlyUrls: {
		[Mainnet.chainId]: getDefaultProvider('mainnet'),
	},
};

function App() {
	return (
		<div className="app">
			<DAppProvider config={config}>
				<CustomNavbar />
				<SlotContainer />
			</DAppProvider>
		</div>
	);
}

export default App;
