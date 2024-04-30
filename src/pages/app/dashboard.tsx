import { useState, useEffect } from "react";
import { Button } from "@components";
import { walletConnection, checkConnectedWallet } from "../../lib/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {MintModal} from "@components";

export default function Dashboard() {
  const navigate = useNavigate();

  const [ethInput, setEthInput] = useState("");
  const [quoteInput, setQuoteInput] = useState("");

  const [connected, setConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState();
  //   const [account] = useState();

  const [ethValue, setEthValue] = useState("");
  //@ts-ignore
  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [isEthInputFocused, setEthInputFocused] = useState<boolean | null>(
    false
  );

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/coins/ethereum")
      .then((res: any) => {
        console.log("eth usd", res.data.market_data.current_price.usd);
        setEthValue(res.data.market_data.current_price.usd);
      });
  });

  useEffect(() => {
    walletConnection(setConnected);
    checkConnectedWallet(setCurrentAccount, setConnected);
  }, [currentAccount, connected]);

  useEffect(() => {
    const convertValue = async () => {
      try {
        if (ethValue && isEthInputFocused) {
          setQuoteInput(
            (parseFloat(ethInput) * parseFloat(ethValue)).toString()
          );
        } else {
          throw new Error("Failed to retrieve Ethereum price data");
        }
      } catch (error) {
        console.error("Error fetching Ethereum price:", error);
        // Handle error gracefully, potentially using a default price or informing the user
        return null; // Or provide a default value here
      }
    };
    convertValue();
  }, [ethInput]);

  useEffect(() => {
    const convertValue = async () => {
      try {
        if (ethValue) {
          setEthInput(
            (parseFloat(quoteInput) / parseFloat(ethValue)).toString()
          );
        } else {
          throw new Error("Failed to retrieve Ethereum price data");
        }
      } catch (error) {
        console.error("Error fetching Ethereum price:", error);
        // Handle error gracefully, potentially using a default price or informing the user
        return null; // Or provide a default value here
      }
    };
    convertValue();
  }, [quoteInput]);

  return (
    <main className="flex flex-col pt-40 px-24">
      <body className="">
        <span>
          <p className="dark:text-white text-4xl">Balance</p>
          <p className="text-primary text-3xl flex flex-row gap-x-4">
            $0.00
            <select className=" bg-white text-white text-base bg-opacity-15 px-1 rounded-full focus:outline-none">
              <option>QUOTE</option>
            </select>
          </p>
        </span>

        <object className="flex flex-row justify-between mt-14">
          <p className="dark:text-white text-2xl">Positions</p>
          <span className="flex flex-row gap-x-4">
            <a className="text-primary underline text-lg">Mint Quote</a>
            <a className="text-primary underline text-lg">Burn Quote</a>
          </span>
        </object>
        <div className="dark:bg-holder p-5 rounded-xl mt-7">
          <header className="w-full grid grid-cols-5 text-lg text-neutral-400 mt-1">
            <p className="">Collateral Size</p>
            <p className=" w-96">Quote Minted</p>
            <p className=" w-96">Current Liq. Price</p>
            <p className=" w-96">C.P.O</p>
            <p className=" w-96">Rate P.A</p>
          </header>
          <div className={`bg-white opacity-15 w-full h-[0.5px] mt-4`} />
        </div>

        <div className="w-full flex flex-col items-center mt-10">
          <Button
            text="Create CDP"
            className="w-[50%]"
            onClick={() => {
              navigate("/providers");
            }}
          />
        </div>
      </body>
      {
        <MintModal/>
      }
    </main>
  );
}
