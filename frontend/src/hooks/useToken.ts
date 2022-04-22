import { Contract, ethers } from 'ethers';
import { useCall, useContractFunction } from '@usedapp/core';
import * as PLYTokenAbi from '../abis/PLYToken.json';
import { plyTokenAddress } from '..';
import { vendorAddress } from '..';

export function useTokenBalance(address: string | any) {
	const PLYContractInterface = new ethers.utils.Interface(
		JSON.stringify(PLYTokenAbi.abi)
	);

	const { value, error } =
		useCall(
			address &&
				plyTokenAddress && {
					contract: new Contract(plyTokenAddress, PLYContractInterface),
					method: 'balanceOf',
					args: [address],
				}
		) ?? {};
	if (error) {
		console.error(error.message);
		return undefined;
	}
	return value?.[0];
}

export function useTokenAllowance(ownerAddress: string | any) {
	const PLYContractInterface = new ethers.utils.Interface(
		JSON.stringify(PLYTokenAbi.abi)
	);

	const { value, error } =
		useCall(
			ownerAddress &&
				vendorAddress &&
				plyTokenAddress && {
					contract: new Contract(plyTokenAddress, PLYContractInterface),
					method: 'allowance',
					args: [ownerAddress, vendorAddress],
				}
		) ?? {};
	if (error) {
		console.error(error.message);
		return undefined;
	}
	return value?.[0];
}

export function useTokenApprove(amount: number) {
	const PLYContractInterface = new ethers.utils.Interface(
		JSON.stringify(PLYTokenAbi.abi)
	);

	const { value, error } =
		useCall(
			vendorAddress &&
				amount &&
				plyTokenAddress && {
					contract: new Contract(plyTokenAddress, PLYContractInterface),
					method: 'approve',
					args: [vendorAddress, amount],
				}
		) ?? {};
	if (error) {
		console.error(error.message);
		return undefined;
	}
	return value?.[0];
}

export function useTokenContractMethod(methodName: string) {
	const PLYContractInterface = new ethers.utils.Interface(
		JSON.stringify(PLYTokenAbi.abi)
	);

	const plyContract = new Contract(plyTokenAddress, PLYContractInterface);
	const { state, send } = useContractFunction(plyContract, methodName, {});

	return { state, send };
}
