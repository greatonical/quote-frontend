import { useState, useEffect } from "react";
import { walletConnection, checkConnectedWallet } from "../../lib/utils";
import axios from "axios";
import { AppHeader, Line } from "@components";
import { openLink } from "../../lib/utils";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { METAMASK_LINK, TRUST_WALLET_LINK } from "@constants";
import Pool from "./pool";

export default function Provider() {
  const [ethInput, setEthInput] = useState("");
  const [quoteInput, setQuoteInput] = useState("");

  const [connected, setConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState();

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

  const [route, setRoute] = useState<string>("Dashboard");
  const [showWallet, setShowWallet] = useState<boolean>(false);

  const Providers = () => {
    return (
      <main className="flex flex-col pt-40 px-24">
        <body className="">
          {showWallet && (
            <motion.section
              className="h-[95%] mt-4 mb-20 w-72 absolute right-5 z-50 p-4 shadow-lg rounded-2xl bg-white border border-neutral-200"
              initial={{ x: 100 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              transition={{
                mass: 200,
                duration: 0.2,
                ease: "easeInOut",
                delay: 0,
              }}
            >
              <span className="flex flex-row w-full justify-between">
                <p className="font-satoshi-medium text-lg">Connect Wallet</p>
                <Icon
                  icon={"formkit:close"}
                  onClick={() => {
                    setShowWallet(false);
                  }}
                  className="w-6 h-6 text-black"
                />
              </span>
              <button
                className="flex flex-row gap-x-3 mt-7 items-center"
                onClick={() => {
                  openLink(METAMASK_LINK);
                }}
              >
                <img src="./metamask.svg" className="w-8 h-8" />
                <p className="font-satoshi-medium text-lg">Metamask</p>
              </button>
              <Line className="w-full mt-2" />

              <button
                className="flex flex-row gap-x-3 mt-10 items-center"
                onClick={() => {
                  openLink(TRUST_WALLET_LINK);
                }}
              >
                <img src="./trust_wallet.svg" className="w-8 h-8" />
                <p className="font-satoshi-medium text-lg">Trust Wallet</p>
              </button>
              <Line className="w-full mt-2" />
              <a
                href="https://github.com/greatonical/quote-stablecoin/blob/frontend/README.md#how-to-guides"
                target="_blank"
                className="text-primary absolute bottom-5 underline flex flex-row"
              >
                View Minting guide here
                <Icon icon={"octicon:arrow-up-right-24"} className="w-5 h-5" />
              </a>
            </motion.section>
          )}

          <object className="flex flex-row justify-between">
            <p className="dark:text-white text-5xl">Providers</p>
          </object>
          <div className="dark:bg-holder p-5 rounded-xl mt-7">
            <header className="w-full grid grid-cols-4 text-lg text-neutral-400 mt-1">
              <p className="">Name of provider</p>
              <p className=" w-96">Min Duration</p>
              <p className=" w-96">Interest Rate</p>
              <p className=" w-96">Max Drawdown</p>
            </header>
            <div className={`bg-white opacity-15 w-full h-[0.5px] mt-4`} />
          </div>
        </body>
      </main>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      <AppHeader
        className=""
        setShowWallet={setShowWallet}
        route={route}
        setRoute={setRoute}
      />
      {route === "Dashboard" ? <Providers /> : <Pool />}
    </div>
  );
}
