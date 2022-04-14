import { expect, use } from 'chai';
import { ethers } from 'hardhat';
import { solidity } from 'ethereum-waffle';
import { BigNumber, BigNumberish } from 'ethers';

use(solidity);

describe('Vendor Contract', function () {
	let PLYToken, token: any;
	let owner: any, address1: any, address2: any;
	let Vendor, vendor: any;

	let vendorTokenSupply: BigNumber, tokensPerEth: number;

	beforeEach(async () => {
		[owner, address1, address2] = await ethers.getSigners();

		PLYToken = await ethers.getContractFactory('PLYToken');
		token = await PLYToken.deploy();
		// await token.deployed();

		Vendor = await ethers.getContractFactory('Vendor');
		vendor = await Vendor.deploy(token.address);

		await token.transfer(vendor.address, 1000000);
		await vendor.transferOwnership(owner.address);

		vendorTokenSupply = await token.balanceOf(vendor.address);
		tokensPerEth = await vendor.tokensPerEth();
	});

	it('Has a balence of PLYToken', () => {
		expect(vendorTokenSupply).to.equal(1000000);
	});

	it('Allow users to buy a token for ETH, success', async () => {
		const amount = ethers.utils.parseEther('1');
		await expect(vendor.connect(address1).buyTokens({ value: amount }))
			.to.emit(vendor, 'BuyTokens')
			.withArgs(address1.address, amount, tokensPerEth);

		const userBal = await token.balanceOf(address1.address);
		expect(userBal).to.equal(tokensPerEth);

		const vendorTokenBal = await token.balanceOf(vendor.address);
		expect(vendorTokenBal).to.equal(vendorTokenSupply.sub(100));

		const vendorEthBal = await ethers.provider.getBalance(vendor.address);
		expect(vendorEthBal).to.equal(amount);
	});
});
