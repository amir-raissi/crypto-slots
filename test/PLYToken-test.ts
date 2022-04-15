import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('PLYToken Contract', function () {
	let PLYToken, token: any;
	let owner: any, address1: any, address2: any;

	beforeEach(async () => {
		[owner, address1, address2] = await ethers.getSigners();
		PLYToken = await ethers.getContractFactory('PLYToken');
		token = await PLYToken.deploy();
		await token.deployed();
	});

	it('Should assign total supply to msg.sender', async () => {
		const ownerBal = await token.balanceOf(owner.address);
		expect(await token.totalSupply()).to.equal(ownerBal);
	});

	it('Should be transferable', async () => {
		await token.transfer(address1.address, 50);
		const address1Bal = await token.balanceOf(address1.address);
		expect(address1Bal).to.equal(50);
	});

	it('Should fail to transfer if participant balence is insufficent', async () => {
		await expect(
			token.connect(address1).transfer(owner.address, 1)
		).to.be.revertedWith('ERC20: transfer amount exceeds balance');
	});
});
