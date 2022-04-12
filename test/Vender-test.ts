import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Vendor Contract', function () {
	let PLYToken, token: any;
	let owner: any, address1: any, address2: any;
    let Vendor, vendor: any;

	beforeEach(async () => {
        [owner, address1, address2] = await ethers.getSigners();
        PLYToken = await ethers.getContractFactory('PLYToken');
		token = await PLYToken.deploy();
		await token.deployed();

        Vendor = await ethers.getContractFactory('Vendor');
        vendor = await Vendor.deploy(owner.address);
        await vendor.deployed();
	});

	it('Contains an ETH To Token Exchange Rate', async () => {
        // Will change to refelct a variable exchange rate when we get there
        expect(await vendor.tokensPerEth()).to.equal(100);
	});

    it('Allow users to buy a token for ETH', async () => {
		const transactionHash = await address1.sendTransaction({
            to: owner.address,
            value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
          });
          const address1Bal = await token.balanceOf(address1.address);
          expect(address1Bal).to.equal(100); // Will need to be changes to reflect a variable exchange rate
	});
});
