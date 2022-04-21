import { Contract, ethers } from 'ethers';
import { useCall, useContractFunction } from '@usedapp/core';
import * as PLYTokenAbi from '../abis/PLYToken.json';
import { plyTokenAddress } from '..';

const PLYContractInterface = new ethers.utils.Interface(
    JSON.stringify(PLYTokenAbi.abi)
);

export function useTokenBalance(address: string) {
    const { value, error } =
      useCall(
        address &&
        plyTokenAddress && {
            contract: new Contract(plyTokenAddress, PLYContractInterface),
            method: "balanceOf",
            args: [address],
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
  }

export function useTokenAllowance(ownerAddress: string, spenderAddress: string) {
    const { value, error } =
      useCall(
        ownerAddress &&
          spenderAddress &&
          plyTokenAddress && {
            contract: new Contract(plyTokenAddress, PLYContractInterface),
            method: 'allowance',
            args: [ownerAddress, spenderAddress],
          }
      ) ?? {}
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
  }

export function useTokenApprove(spenderAddress: string, amount: number) {
    const { value, error } =
      useCall(
        spenderAddress &&
        amount &&
          plyTokenAddress && {
            contract: new Contract(plyTokenAddress, PLYContractInterface),
            method: 'approve',
            args: [spenderAddress, amount],
          }
      ) ?? {}
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
  }


export function useTokenContractMethod(methodName: string) {
	const plyContract = new Contract(plyTokenAddress, PLYContractInterface);
	const { state, send } = useContractFunction(plyContract, methodName, {});

	return { state, send };
}