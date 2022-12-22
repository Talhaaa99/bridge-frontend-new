import {
  Children,
  Fragment,
  Key,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useAccount, useContract, useContractRead, useProvider } from "wagmi";
import WalletConnect from "../components/WalletConnect";
import truncateEthAddress from "truncate-eth-address";
import axios from "axios";

import abi from "../utils/abi.json";

type Props = {
  id: Key | null | undefined;
  name: any;
  logo: string | undefined;
  chain_id: SetStateAction<string>;
  networkData: any;
  tokenData: any;
  item: any;
};

interface InputProps {
  children?: React.ReactNode;
}

export default function Home({ networkData, tokenData }: Props): JSX.Element {
  const { address } = useAccount();
  console.log(address);
  const [isModalOpenFrom, setIsModalOpenFrom] = useState(false);
  const [isModalOpenToken, setIsModalOpenToken] = useState(false);
  const [isModalOpenTo, setIsModalOpenTo] = useState(false);
  const [currentFrom, setCurrentFrom] = useState(networkData[0]);
  const [currentToken, setCurrentToken] = useState(tokenData[0]);
  const [currentTo, setCurrentTo] = useState(networkData[0]);
  const [chain, setChain] = useState("56");

  const [selectedFrom, setSelectedFrom] = useState(currentFrom);
  const [selectedToken, setSelectedToken] = useState(currentToken);
  const [selectedTo, setSelectedTo] = useState(currentTo);
  const [recievingAddress, setRecievingAddress] = useState("");
  const [amount, setAmount] = useState("");

  const chainUrl = `https://mainnet.bridgeserver.online/api/asset/active_asset/${chain}`;

  const fetchChainToken = async () => {
    const res = await axios.get(chainUrl);
    const data = await res.data.assets.data;
    setCurrentToken(data);
    console.log(data);
  };

  useEffect(() => {
    fetchChainToken();
  }, [chain]);

  const handleModalFrom = (): void => {
    setIsModalOpenFrom(!isModalOpenFrom);
  };
  const handleModalToken = (): void => {
    setIsModalOpenToken(!isModalOpenToken);
  };
  const handleModalTo = (): void => {
    setIsModalOpenTo(!isModalOpenTo);
  };

  console.log(networkData);

  const handleSelectFrom = (item: Props) => {
    setCurrentFrom(item);
    console.log(selectedFrom);
    setChain(item.chain_id);
    setIsModalOpenFrom(false);
    setSelectedToken(currentToken[0]);
  };
  const handleSelectToken = (item: Props) => {
    setSelectedToken(item);
    console.log(selectedToken);
    setIsModalOpenToken(false);
  };
  const handleSelectTo = (item: Props) => {
    setSelectedTo(item);
    console.log(selectedTo);
    setIsModalOpenTo(false);
  };

  const handleSameAddress = () => {
    if (address !== undefined) setRecievingAddress(address);
  };

  const provider = useProvider();
  const contract = useContract({
    address: "0x9152efD02D5b31f86786804b31624a2F2e848e15",
    abi: abi,
    signerOrProvider: provider,
  });

  const { data, isError, isLoading } = useContractRead({
    address: "0x9152efD02D5b31f86786804b31624a2F2e848e15",
    abi: abi,
    functionName: "getDirectswapAssetCount",
  });

  return (
    <div>
      <div className="bg-[#F2F2F5] h-screen w-full">
        <header className="flex flex-row justify-between px-20 py-6">
          <h1 className="flex font-bold text-[32px]">Bridge</h1>
          <WalletConnect />
        </header>
        <div className="h-[1032px] w-[552px] bg-white m-auto rounded-[40px] p-5">
          <h2 className="text-base font-medium leading-8 tracking-wide text-[#02061D]">
            From
          </h2>
          <div className="grid grid-cols-2 bg-[#F1F2F7] py-4 px-2 mt-2 mb-8 rounded-2xl">
            <div className="border-r-2 px-4">
              <h2 className="text-base font-medium tracking-wide mb-4">
                Network
              </h2>
              <div>
                <div
                  aria-hidden="false"
                  onClick={() => handleModalFrom()}
                  className="flex w-full h-8 justify-between align-center hover:cursor-pointer"
                >
                  <div className="flex">
                    <img
                      src={currentFrom.logo}
                      className="h-8 w-8 mr-4 self-center"
                    ></img>
                    <p className="self-center">
                      {currentFrom.name.split(" ")[0]}
                    </p>
                  </div>
                  <ChevronDownIcon className="h-8 w-8 text-[#A0A5BA] justify-center" />
                </div>
                {isModalOpenFrom ? (
                  <div className="z-30 -ml-6 gap-y-2 pl-6 absolute h-[300px] bg-[#F2F2F5] overflow-y-scroll w-[270px] rounded-2xl">
                    {networkData.map((item: Props) => {
                      return (
                        <p
                          key={item.id}
                          onClick={() => handleSelectFrom(item)}
                          className="pt-2 hover:cursor-pointer opacity-80 hover:opacity-100"
                        >
                          <div className="flex align-center">
                            <img
                              src={item?.logo}
                              className="h-8 w-8 mr-4 self-center justify-center"
                            ></img>
                            <p className="self-center justify-center">
                              {item.name?.split(" ")[0]}
                            </p>
                          </div>
                        </p>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="px-4">
              <h2 className=" text-base font-medium trakcing-wide mb-4">
                Token
              </h2>
              <div>
                <div
                  aria-hidden="false"
                  onClick={() => handleModalToken()}
                  className="flex w-full h-8 justify-between align-center hover:cursor-pointer"
                >
                  <div className="flex">
                    <img
                      src={selectedToken?.logo}
                      className="h-8 w-8 mr-4"
                    ></img>
                    <p>{selectedToken?.name.split(" ")[0]}</p>
                  </div>
                  <ChevronDownIcon className="h-8 w-8 text-[#A0A5BA] justify-center" />
                </div>
                {isModalOpenToken ? (
                  <div className="z-30 -ml-6 gap-y-2 pl-6 absolute h-[300px] bg-[#F2F2F5] overflow-y-scroll w-[270px] rounded-2xl">
                    {currentToken.map((item: Props) => {
                      return (
                        <p
                          key={item.id}
                          onClick={() => handleSelectToken(item)}
                          className="pt-2 hover:cursor-pointer opacity-80 hover:opacity-100"
                        >
                          <div className="flex">
                            <img src={item.logo} className="h-8 w-8 mr-4"></img>
                            <p>{item.name.split(" ")[0]}</p>
                          </div>
                        </p>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <h2 className="text-base font-medium tracking-wide leading-8 text-[#02061D]">
            To
          </h2>
          <div
            aria-hidden="false"
            onClick={() => handleModalTo()}
            className="flex w-[512px] h-[72px] justify-between align-center bg-[#F2F2F5] rounded-2xl p-4 hover:cursor-pointer"
          >
            <div className="flex justify-center">
              <img
                src={selectedTo.logo}
                className="h-8 w-8 mr-4 self-center"
              ></img>
              <p className="self-center">{selectedTo?.name.split(" ")[0]}</p>
            </div>
            <ChevronDownIcon className="h-8 w-8 text-[#A0A5BA] justify-center" />
          </div>
          {isModalOpenTo ? (
            <div className="z-30 gap-y-2 pl-6 absolute h-[300px] bg-[#F2F2F5] overflow-y-scroll w-[512px] rounded-2xl">
              {networkData.map((item: Props) => {
                return (
                  <p
                    key={item.id}
                    onClick={() => handleSelectTo(item)}
                    className="pt-2 hover:cursor-pointer opacity-80 hover:opacity-100"
                  >
                    <div className="flex">
                      <img src={item?.logo} className="h-8 w-8 mr-4"></img>
                      <p>{item?.name.split(" ")[0]}</p>
                    </div>
                  </p>
                );
              })}
              console.log(item);
            </div>
          ) : null}
          <h2 className="text-base font-normal tracking-wide text-[#02061D] mt-8">
            Recieving Address
          </h2>
          <div>
            <input
              className="flex flex-row bg-[#f2f2f5] px-6 py-4 mt-2 mb-8 rounded-2xl w-full border-none placeholder:text-[#02061D] placeholder:text-opacity-30"
              type="text"
              placeholder="Binance Chain recieving wallet address"
              onChange={(e) => setRecievingAddress(e.target.value)}
              value={recievingAddress}
            ></input>
            {recievingAddress === "" ? (
              <button
                className="text-base text-[#449DD1] absolute -mt-[72px] ml-[390px]"
                onClick={() => handleSameAddress()}
              >
                Same address
              </button>
            ) : null}
          </div>
          <div>
            <div className="flex flex-row justify-between align-center">
              <h2 className="text-base font-normal tracking-wide text-[#02061D]">
                Amount
              </h2>
              <h2 className="text-base font-normal leading-4 tracking-wide text-[#02061D]">
                Balance: 25,000 USDT
              </h2>
            </div>
            <div>
              <input
                className="flex flex-row bg-[#f2f2f5] px-6 py-4 mt-2 mb-8 rounded-2xl w-full border-none placeholder:text-[#02061D] placeholder:text-opacity-30"
                type="text"
                placeholder="Enter amount from (0 - 100,000)"
                onChange={(e) => setAmount(e.target.value)}
              />
              <button className="text-base text-[#449DD1] absolute -mt-[72px] ml-[450px]">
                MAX
              </button>
            </div>
          </div>
          <h2 className="text-base font-medium tracking-wide text-[#02061D] mb-4">
            Summary
          </h2>
          <div className="flex flex-row bg-[#D7263D]/10 p-4 mt-2 rounded-lg align-center justify-between">
            <img src="./info-circle.png" className=" self-center mr-2"></img>
            <p className="text-[#D7263D]">
              To avoid your transaction from getting stuck we suggest using the
              max fee
            </p>
          </div>
          <div className="p-4 m-2 space-y-4">
            <div className="flex flex-inline  text-base justify-between align-center">
              <p className="self-center">Source:</p>
              <div className="flex flex-inline align-center gap-x-2 justify-center">
                <p className="font-bold">
                  {address !== undefined
                    ? truncateEthAddress(address)
                    : "Please connect Wallet"}
                </p>
                <img
                  src={currentFrom.logo}
                  className="self center h-7 w-7"
                ></img>
              </div>
            </div>
            <div className="flex flex-inline text-base justify-between  align-center">
              <p className="">Destination:</p>
              <div className="flex flex-inline align-center gap-x-2 justify-center">
                <p className="font-bold">
                  {recievingAddress !== undefined
                    ? truncateEthAddress(recievingAddress)
                    : "Please enter address"}
                </p>
                <img
                  src={selectedTo.logo}
                  className="self-center h-7 w-7"
                ></img>
              </div>
            </div>
            <div className="flex flex-row text-base justify-between  align-center">
              <p className="">Recieving Amount:</p>
              <p className="font-bold">{amount}</p>
            </div>
            <div className="flex flex-row text-base justify-between  align-center">
              <p className="">Fee:</p>
              <p className="font-bold"> USDC</p>
            </div>
            <div className="flex flex-row text-base justify-between  align-center">
              <p className="">Total:</p>
              <p className="font-bold">{amount} USDC</p>
            </div>
          </div>
          <button className=" w-[512px] h-[72px] bg-[#3964FA] shadow-[#516AE44D] rounded-2xl text-white font-semibold">
            Continue
          </button>
        </div>
      </div>
      <button>Native asset </button>
    </div>
  );
}

export async function getServerSideProps() {
  const allChainsUrl = "https://mainnet.bridgeserver.online/";

  const res = await axios.get(allChainsUrl);

  const networkData: any = await res.data.networks;

  const InitialtokenUrl = `https://mainnet.bridgeserver.online/api/asset/active_asset/56`;

  const res2 = await axios.get(InitialtokenUrl);
  const tokenData = await res2.data.assets.data;

  return {
    props: { networkData, tokenData },
  };
}
