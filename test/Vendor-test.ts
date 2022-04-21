import { expect, use } from 'chai';
import { ethers, waffle } from 'hardhat';
import { solidity } from 'ethereum-waffle';
import { BigNumber, BigNumberish } from 'ethers';

use(solidity);

describe('Vendor Contract', function () {
	let PLYToken, token: any;
	let owner: any, address1: any, address2: any, address3: any;
	let Vendor, vendor: any;

	let vendorTokenSupply: BigNumber, tokensPerEth: number;

	beforeEach(async () => {
		[owner, address1, address2, address3] = await ethers.getSigners();

		PLYToken = await ethers.getContractFactory('PLYToken');
		token = await PLYToken.deploy();

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

	it('Reverts the Buy Function if less than .01 ETH is sent', async () => {
		const amount = ethers.utils.parseEther('0');
		await expect(
			vendor.connect(address1).buyTokens({
				value: amount,
			})
		).to.be.revertedWith('Send at least .01 ETH to buy some tokens');
	});

	it("Reverts the Buy Function if the Vendor Doesn't Have Enough tokens", async () => {
		const amount1 = ethers.utils.parseEther('9999');
		const amount2 = ethers.utils.parseEther('3');
		await vendor.connect(address3).buyTokens({ value: amount1 });
		await expect(
			vendor.connect(address2).buyTokens({
				value: amount2,
			})
		).to.be.revertedWith('Ran out of tokens');
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

	it('Allows for eth to be sent', async () => {
		const amount = ethers.utils.parseEther('1');
		const hash = await address1.sendTransaction({
			to: vendor.address,
			value: amount,
		});
		expect(await ethers.provider.getBalance(vendor.address)).to.equal(amount);
	});

	it('Gets The Current Balance of The Machine', async () => {
		const amount = ethers.utils.parseEther('1');
		await vendor.connect(address1).buyTokens({ value: amount });
		const vendorTokenBal = await vendor.getBalanceToken();
		expect(vendorTokenBal).to.equal(vendorTokenSupply.sub(100));
	});

	it('Allows the User to bet and spin', async () => {
		const amount = ethers.utils.parseEther('1');
		await vendor.connect(address1).buyTokens({ value: amount });
		await token.connect(address1).approve(vendor.address, 10);
		const game = await vendor.connect(address1).spin(1);
		expect(game).to.emit(vendor, 'Spin');
	});
});
