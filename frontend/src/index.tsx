import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { DAppProvider, Config, Goerli } from '@usedapp/core';
import './styles/index.css';
import App from './App';

export const plyTokenAddress = '0x5da3AB6Ed9B5311fEbe99d351Df553925fec6787';
export const vendorAddress = '0x6a6f7B811f2402d466798AFBeaC44b5ebbAe8489';

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
