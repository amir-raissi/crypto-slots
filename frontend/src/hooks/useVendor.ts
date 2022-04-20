import { Contract, ethers } from 'ethers';
import { useCall, useContractFunction } from '@usedapp/core';
import * as vendorAbi from '../abis/Vendor.json';
import { vendorAddress } from '..';

export function useGetJackpotAmount() {
	const vendorContractInterface = new ethers.utils.Interface(
		JSON.stringify(vendorAbi.abi)
	);

	const { value, error } =
		useCall({
			contract: new Contract(vendorAddress, vendorContractInterface),
			method: 'getJackpotAmount',
			args: [],
		}) ?? {};

	if (error) {
		console.log(error);
		return 0;
	}
	return value?.[0];
}

export function useVendorContractMethod(methodName: string) {
	const vendorContractInterface = new ethers.utils.Interface(
		JSON.stringify(vendorAbi.abi)
	);

	const vendorContract = new Contract(vendorAddress, vendorContractInterface);
	const { state, send } = useContractFunction(vendorContract, methodName, {});

	return { state, send };
}
