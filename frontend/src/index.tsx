import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { DAppProvider, Config, Goerli } from '@usedapp/core';
import './styles/index.css';
import App from './App';

export const plyTokenAddress = '0x3100D1cdc128e4A4bb53209865B5Be264d39e2E1';
export const vendorAddress = '0xAc4e66c89D9000A5788fDf2a3545fa35dD18a25E';

const config: Config = {
	readOnlyChainId: Goerli.chainId,
	readOnlyUrls: {
		[Goerli.chainId]:
			'https://eth-goerli.alchemyapi.io/v2/AxnmGEYn7VDkC4KqfNSFbSW9pHFR7PDO',
	},
};

ReactDOM.render(
	<StrictMode>
		<DAppProvider config={config}>
			<App />
		</DAppProvider>
	</StrictMode>,
	document.getElementById('root')
);
