import { ethers } from "ethers";
import { abi } from "../Contracts_ABI/Core/PublicProvider.sol/PublicProvider.json";

const contractAdress = "0xe91AD4a4ec8112D9323cDAFf5c6F97B1e13502F7";

///Thse functions are for the minting QUOTE section

/**
 *@dev use thist o convert from ETH to QUOTE
 * @param amountIn The amount of ETH(when mint is true) or QUOTE (whne mint is false)
 *
 *
 * @param mint this is true if you are converting from ETH to QUOTE and false if vice versa
 * @returns it returns the calculated amount ,
 * NOTE:the ammount needs to be configured to using formatUnits
 */

export const ethToQuote = async (amountIn: bigint, mint: true) => {
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  //contract
  const publicProvider = new ethers.Contract(contractAdress, abi, provider);
  const amountOut = await publicProvider.quoteXweiConverter(amountIn, mint);

  return amountOut;
};
/**
 *
 * @returns It returns the max amount of QUOTE that can be minted
 * 
 *@dev when users input the ETH amount to deposit in and the equivlent amount of QUOTE is calculated ,
 if that amount is greater than what is returned by this function ,display error "Not enough liquidity in Pool ,reduce amount"
 *
 */
export const getMaxQuoteMintable = async () => {
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  //
  const publicProvider = new ethers.Contract(contractAdress, abi, provider);
  const totalQuoteMinted: bigint = await publicProvider.totalQuoteMinted();
  const providerValue: bigint = await publicProvider.quoteXweiConverter(
    await provider.getBalance("0xe91AD4a4ec8112D9323cDAFf5c6F97B1e13502F7"),
    true
  );

  const excessCollateralValue = providerValue - totalQuoteMinted;

  const minMultiplier = BigInt(300 * 10 ** 4);

  let maxAmountToMint =
    (excessCollateralValue * BigInt(10 ** 6)) / minMultiplier;
  let remaining =
    maxAmountToMint > totalQuoteMinted ? maxAmountToMint - totalQuoteMinted : 0;

  return remaining;
};
/**
 *@dev function for mintingQUOTE
 * @param amount The amount of  WEI to deposit to mint QUOTE
 *
 */

export const mintQUOTE = async (amount: bigint) => {
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const publicProvider = new ethers.Contract(contractAdress, abi, signer);
  await publicProvider.mintQUOTE({ value: amount });
};

/**
 * @dev function for burning QUOTE
 * @param amount the amount of QUOTE to be sent
 *
 */
export const burnQUOTE = async (amount: bigint) => {
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const publicProvider = new ethers.Contract(contractAdress, abi, signer);

  await publicProvider.burnQUOTE(amount);
};

/**
 *
 * @param amount the amount of ETH to deposit
 *
 */
export const mintLETH = async (amount: bigint) => {
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const publicProvider = new ethers.Contract(contractAdress, abi, signer);

  try {
    //This static call is used to checks if the transaction would fail and throws an error
    await publicProvider.callStatic.mintLETH({ value: amount });

    await publicProvider.mintLETH({ value: amount });
  } catch {}
};

export const burnLETH = async (amount: bigint) => {
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const publicProvider = new ethers.Contract(contractAdress, abi, signer);

  try {
    await publicProvider.callStatic.burnLETH(amount);

    await publicProvider.burnLETH(amount);
  } catch {}
};
