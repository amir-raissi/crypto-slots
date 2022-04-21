import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { DAppProvider, Config, Goerli } from '@usedapp/core';
import './styles/index.css';
import App from './App';

export const plyTokenAddress = '0x8446090Ab76b8318094c91d5434c6385b1C12626';
export const vendorAddress = '0xe4c4857CbE79D01969175bD972Aff2800c16347f';

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
