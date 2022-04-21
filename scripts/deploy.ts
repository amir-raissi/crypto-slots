// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import * as hre from 'hardhat';
import * as fs from 'fs';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');

	// We get the contract to deploy

	const PLYToken = await hre.ethers.getContractFactory('PLYToken');
	const token = await PLYToken.deploy();

	await token.deployed();

	console.log('PLYToken deployed to:', token.address);

	const Vendor = await hre.ethers.getContractFactory('Vendor');
	const vendor = await Vendor.deploy(token.address);

	console.log('Vendor deployed to:', vendor.address);

	exportFrontendFiles();
}

function exportFrontendFiles() {
	const abiDir = __dirname + '/../frontend/src/abis';

	if (!fs.existsSync(abiDir)) {
		fs.mkdirSync(abiDir);
	}

	const tokenArtifact = hre.artifacts.readArtifactSync('PLYToken');
	const vendorArtifact = hre.artifacts.readArtifactSync('Vendor');

	fs.writeFileSync(
		abiDir + '/PLYToken.json',
		JSON.stringify(tokenArtifact, null, 2)
	);

	fs.writeFileSync(
		abiDir + '/Vendor.json',
		JSON.stringify(vendorArtifact, null, 2)
	);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
