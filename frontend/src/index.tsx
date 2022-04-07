import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { DAppProvider, Config, Goerli } from '@usedapp/core';
import './styles/index.css';
import App from './App';

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
