import React, { useState, useEffect } from 'react';
import { LuSettings } from "react-icons/lu";
import { IoMdArrowDown } from "react-icons/io";
import { CustomButton } from './CustomButton';
import SellSection from './SellSection';
import BuySection from './BuySection';
import SellSearchBar from './SellSearchBar'; 
import BuySearchBar from './BuySearchBar';   
import axios from "axios";
import Web3 from 'web3';
import { useAccount } from 'wagmi';
import PlaceOrder from './placeorder/PlaceOrder';
import { ethers } from "ethers";
import {
  useReadContract,
  useBalance,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { erc20Abi } from "viem"; 
import qs from "qs"; // Ensure you have qs installed
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { PERMIT2_ADDRESS,AFFILIATE_FEE, FEE_RECIPIENT,MAINNET_EXCHANGE_PROXY,MAX_ALLOWANCE,MAGIC_CALLDATA_STRING } from '../utils/constants';
import tokenabi from '../../tokenabi.json'

const web3 = new Web3(window.ethereum || 'https://mainnet.infura.io/v3/5ff618058593414aae2f28055c712825');

const Market = () => {
  const [sellInputValue, setSellInputValue] = useState("");
  const [buyInputValue, setBuyInputValue] = useState(null);
  const [showSellSearchBar, setShowSellSearchBar] = useState(false);
  const [showBuySearchBar, setShowBuySearchBar] = useState(false);
  const [showsell, setShowSell] = useState(true);
  const [showBuy, setShowBuy] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoShowSecondBuy, setAutoShowSecondBuy] = useState(false);
  const [autoShowSecondSell, setAutoShowSecondSell] = useState(false);
  const storedToken = localStorage.getItem("sellSelectedToken");
  const TokenJsonData = JSON.parse(storedToken);
  const [balance, setBalance] = useState();
  const { address: accountAddress } = useAccount();
  const [numberType, setNumberType] = useState(false);
  const [showPlaceOrder, setShowPlaceOrder] = useState(false);
  const [price, setPrice] = useState(null);
  const [buyTokenTax, setBuyTokenTax] = useState(null);
  const [sellTokenTax, setSellTokenTax] = useState(null);
  
  const [buyToken, setBuyToken] = useState(() => {
    return JSON.parse(localStorage.getItem("buySelectedToken")) || {};
  });
  const [sellToken, setSellToken] = useState(() => {
    return JSON.parse(localStorage.getItem("sellSelectedToken")) || {};
  });

  // const account = useAccount();
  const [walletAddress, setWalletAddress] = useState(""); // Replace with dynamic wallet address
    const taker = walletAddress;
  const parsedSellAmount = sellInputValue
    ? parseUnits(sellInputValue, sellToken.decimals).toString()
    : undefined;

  const parsedBuyAmount = buyInputValue
    ? parseUnits(buyInputValue, buyToken.decimals).toString()
    : undefined;
  

  const chainId = 8453;
  useEffect(() => {
    const params = {
      chainId,
      sellToken: sellToken?.address || "",
      buyToken: buyToken?.address || "",
      sellAmount: parsedSellAmount || "",
      buyAmount: parsedBuyAmount || "",
      taker: walletAddress || "",
      swapFeeRecipient: FEE_RECIPIENT || "",
      swapFeeBps: AFFILIATE_FEE || "",
      swapFeeToken: buyToken?.address || "",
      tradeSurplusRecipient: FEE_RECIPIENT || "",
    };

    async function fetchSwapQuote() {
      try {
        // Validate essential fields before making the request
        if (!sellToken?.address || !buyToken?.address || !parsedSellAmount) {
          console.error("Invalid input parameters:", params);
          setError(["Required fields are missing or invalid"]);
          return;
        }

        const searchParams = new URLSearchParams(params).toString();
        const response = await fetch(
          `http://localhost:3001/api/get-price?${searchParams}`,
          {
            headers: {
              "0x-api-key": "704a6d41-1233-4739-904f-1079bf2d892f",
              "0x-version": "v2",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Response Error:", errorData);
          setError([errorData.message || "Invalid input parameters"]);
          return;
        }

        const data = await response.json();
        console.log("API Data:", data);

        if (data?.validationErrors?.length > 0) {
          setError(
            data.validationErrors.map((err) => err.reason || "Validation error")
          );
          return;
        }

        // Clear errors and update state
        setError([]);
        if (data?.buyAmount) {
          setBuyInputValue(formatUnits(data.buyAmount, buyToken.decimals));
          setPrice(data);
        }
        if (data?.tokenMetadata) {
          setBuyTokenTax(data.tokenMetadata.buyToken);
          setSellTokenTax(data.tokenMetadata.sellToken);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(["Unexpected error occurred while fetching data"]);
      }
    }

    if (sellInputValue) {
      fetchSwapQuote();
    }
  }, [
    sellToken,
    buyToken,
    parsedSellAmount,
    parsedBuyAmount,
    chainId,
    sellInputValue,
  ]);

  const spender = price?.issues?.allowance?.spender || 1;
  console.log(spender)

  // Read from ERC20, check approval for the determined spender to spend sellToken
  const { data: allowance, refetch } = useReadContract({
    address: sellToken.address, // Ensure this variable is defined in your scope
    abi: erc20Abi,
    functionName: "allowance",
    args: [taker, spender], // Ensure `taker` and `spender` are defined in your scope
  });

  console.log("checked spender approval");
  console.log(allowance)
  // 2. If no allowance, simulate approve token allowance for the spender
  const { data } = useSimulateContract({
    address: sellToken.address,
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, MAX_ALLOWANCE],
  });
  // Define useWriteContract for the 'approve' operation
  const {
    data: writeContractResult,
    writeContractAsync: writeContract,
    
  } = useWriteContract({
    address: sellToken.address,
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, MAX_ALLOWANCE],
  });
 const { data: approvalReceiptData, isLoading: isApproving } =
   useWaitForTransactionReceipt({
     hash: writeContractResult?.hash,
   });

 // Call `refetch` when the transaction succeeds
 useEffect(() => {
   if (data) {
     refetch();
   }
 }, [data, refetch]);


const clearData = () =>{
  setSellInputValue("");
  setBuyInputValue("");
}

  const [error, setError] = useState(false);

  const [selectedToken, setSelectedToken] = useState();
  const [swapQuote, setSwapQuote] = useState(null);

  const handleSelectToken = (token) => {
    setSelectedToken(token);
  };

  useEffect(() => {
    if (showBuy) {
      setAutoShowSecondBuy(false); // Show the secondBuy when BuySection is active
    } else {
      setAutoShowSecondBuy(true); // Hide it when SellSection is active
    }
  }, [showBuy]);

  useEffect(() => {
    if (showsell) {
      setAutoShowSecondSell(true); // Show the secondBuy when BuySection is active
    } else {
      setAutoShowSecondSell(false); // Hide it when SellSection is active
    }
  }, [showsell]);

  const handleSellInputChange = (e) => {
    const value = e.target.value;

    // Allow only valid numbers (with a single dot for decimals)
    const validValue = value.replace(/[^0-9.]/g, "");
    if (validValue.split(".").length > 2) return;

    // Update sell input value
    setSellInputValue(validValue);
    if (validValue == 0) {
      setBuyInputValue("");
    }
    if (buyToken && sellToken && validValue > 0) {
      //fetchSwapQuote(buyToken, sellToken);
    }
  };

  const handleBuyInputChange = (e) => {
    const value = e.target.value;
    const validValue = value.replace(/[^0-9.]/g, "");
    if (validValue.split(".").length > 2) return;
    setBuyInputValue(validValue);
  };

  const SwapSellBuy = () => {
    // Temporary variables to store current state values
    const tempSellInputValue = sellInputValue;
    const tempBuyInputValue = buyInputValue;
    const tempSellToken = sellToken;

    // Swap input values
    setSellInputValue(tempBuyInputValue);
    setBuyInputValue(tempSellInputValue);

    // Swap tokens
    setSellToken(buyToken); // Set sell token to current buy token
    setBuyToken(tempSellToken); // Set buy token to current sell token

    // Toggle visibility of Sell and Buy sections if needed
    setShowSell((prev) => !prev);
    setShowBuy((prev) => !prev);
  };

  const handleKeyPress = (e) => {
    if (e.key === "-") {
      e.preventDefault();
    }
  };
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (!window.ethereum) {
        console.warn("MetaMask not installed");

        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error.message);
      }
    };

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
      }
    };

    checkWalletConnection();

    // Add the event listener for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    // Cleanup on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);


   const handleReviewOrder = () => {
     setShowPlaceOrder(true);
   };

  useEffect(() => {
    console.log(sellInputValue);
    console.log(buyToken, sellToken);
    if (sellInputValue > 0 && buyToken && sellToken) {
      console.log(sellInputValue);
      console.log(buyToken, sellToken);
      //  fetchSwapQuote(buyToken, sellToken);
    }
  }, [sellInputValue, buyToken, sellToken]);

  useEffect(() => {
    const params = {
      chainId: chainId,
      sellToken: sellToken.address,
      buyToken: buyToken.address,
      sellAmount: parsedSellAmount,
      buyAmount: parsedBuyAmount,
      taker: walletAddress,
      swapFeeRecipient: FEE_RECIPIENT,
      swapFeeBps: AFFILIATE_FEE,
      swapFeeToken: buyToken.address,
      tradeSurplusRecipient: FEE_RECIPIENT,
    };

    async function main() {
      try {
        const response = await fetch(`/api/get-price?${qs.stringify(params)}`);
        const data = await response.json();

        if (data?.validationErrors?.length > 0) {
          // error for sellAmount too low
          setError(data.validationErrors);
        } else {
          setError([]);
        }
        if (data.buyAmount) {
          setBuyAmount(formatUnits(data.buyAmount, buyToken.decimals));
          setPrice(data);
        }
        // Set token tax information
        if (data?.tokenMetadata) {
          setBuyTokenTax(data.tokenMetadata.buyToken);
          setSellTokenTax(data.tokenMetadata.sellToken);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(["Failed to fetch data"]);
      }
    }

    if (sellInputValue !== "") {
      main();
    }
  }, [
    sellToken.address,
    buyToken.address,
    parsedSellAmount,
    parsedBuyAmount,
    chainId,
    sellInputValue,
    setPrice,
    FEE_RECIPIENT,
    AFFILIATE_FEE,
  ]);
const fetchTokenBalances = async () => {
  if (!walletAddress || !sellToken?.address || !buyToken?.address) {
    console.error("Wallet address or token addresses are missing.");
    return;
  }

  try {
    console.log("Wallet Address:", walletAddress);
    console.log("Sell Token Address:", sellToken?.address);
    console.log("Buy Token Address:", buyToken?.address);

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    let sellBalance = ethers.BigNumber.from(0);
    let buyBalance = ethers.BigNumber.from(0);

    // Handle Sell Token Balance
    if (sellToken.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
      sellBalance = await provider.getBalance(walletAddress);
    } else {
      const sellTokenContract = new ethers.Contract(
        sellToken.address,
        tokenabi,
        provider
      );
      sellBalance = await sellTokenContract.balanceOf(walletAddress);
    }

    // Handle Buy Token Balance
    if (buyToken.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
      buyBalance = await provider.getBalance(walletAddress);
    } else {
      const buyTokenContract = new ethers.Contract(
        buyToken.address,
        tokenabi,
        provider
      );
      buyBalance = await buyTokenContract.balanceOf(walletAddress);
    }

    console.log("Sell Balance (Raw):", sellBalance.toString());
    console.log("Buy Balance (Raw):", buyBalance.toString());

    // Format balances
    const formattedSellBalance =
      sellToken.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        ? ethers.utils.formatEther(sellBalance)
        : formatUnits(sellBalance, sellToken.decimals);

    const formattedBuyBalance =
      buyToken.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        ? ethers.utils.formatEther(buyBalance)
        : formatUnits(buyBalance, buyToken.decimals);

    setBalance({
      sellTokenBalance: formattedSellBalance,
      buyTokenBalance: formattedBuyBalance,
    });
  } catch (error) {
    console.error("Error fetching token balances:", error);
  }
};



useEffect(() => {
  if (walletAddress && sellToken && buyToken) {
    fetchTokenBalances();
  }
}, [walletAddress, sellToken, buyToken]);


console.log(walletAddress)

  return (
    <div className="w-full min-h-screen">
      <div className="flex justify-center items-center h-screen bg-black p-4">
        {showPlaceOrder && (
          <PlaceOrder
            setShowPlaceOrder={setShowPlaceOrder}
            sellTokenAddress={sellToken.address}
            buyTokenAddress={buyToken.address}
            sellInpValue={sellInputValue}
            walletAddress={walletAddress}
            clearData={clearData}
          />
        )}
        <div className="bg-white h-[350px] border rounded-[1.625rem] w-full sm:h-[450px] sm:w-[450px]">
          <div className="flex justify-between pl-[1.25rem] py-1 pr-[0.75rem] border-b items-center sm:py-3">
            <div className="flex gap-[1.5rem] font-medium sm:text-[17px] text-xs ">
              <button className="text-activeHead">Market</button>
             
            </div>
           
          </div>

          <div>
            <div className="px-[1.5rem] sm:py-[1rem] flex flex-col sm:space-y-4 space-y-2 py-[.55rem]">
              <div className="flex justify-between items-center">
                <p className="font-semibold sm:text-[14px] text-[12px] text-sell">
                  Sell
                </p>
                {balance?.sellTokenBalance && (
                  <p className="text-inactiveHead">
                    Balance: {balance?.sellTokenBalance}
                  </p>
                )}
              </div>
              {showsell ? (
                <SellSection
                  setShowSearchBar={() => setShowSellSearchBar(true)}
                  autoShowSecondSell={autoShowSecondSell}
                  sellInputValue={sellInputValue}
                  setSellInputValue={setSellInputValue}
                  setBuyInputValue={setBuyInputValue}
                  balance={balance}
                  clearData={clearData}
                />
              ) : (
                <BuySection
                  setShowSearchBar={() => setShowBuySearchBar(true)}
                  autoShowSecondBuy={autoShowSecondBuy}
                  selectedToken={selectedToken}
                />
              )}

              <div className="sell-input mb-[0.3rem] flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0.0"
                  className="pr-4 overflow-ellipsis w-[75%] sm:text-[25px] font-semibold focus:outline-none text-[20px]"
                  value={sellInputValue}
                  onChange={(e) => handleSellInputChange(e)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            {/* Display SellSearchBar */}
            {showSellSearchBar && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                <SellSearchBar
                  closeModal={() => setShowSellSearchBar(false)}
                  setShowSellSearchBar={setShowSellSearchBar}
                />
              </div>
            )}

            {/* Divider */}
            <div className="relative w-full h-[1px] bg-[#f1f2f4]"></div>
            <div className="relative flex justify-center -mt-3">
              <div className="bg-white border rounded-full p-1 flex items-center justify-center">
                <IoMdArrowDown className="h-5 w-5" onClick={SwapSellBuy} />
              </div>
            </div>

            <div className="px-[1.5rem] sm:py-[1rem] flex flex-col sm:space-y-4 -mt-5 space-y-2 py-[.55rem]">
              <div className="flex justify-between items-center">
                <p className="font-semibold sm:text-[14px] text-[12px] text-sell">
                  Buy
                </p>

                {balance?.buyTokenBalance && (
                  <p className="text-inactiveHead">
                    Balance: {balance?.buyTokenBalance}
                  </p>
                )}
              </div>
              {showBuy ? (
                <BuySection
                  setShowSearchBar={() => setShowBuySearchBar(true)}
                  autoShowSecondBuy={autoShowSecondBuy}
                />
              ) : (
                <SellSection
                  setShowSearchBar={() => setShowSellSearchBar(true)}
                  autoShowSecondSell={autoShowSecondSell}
                  sellInputValue={sellInputValue}
                  setSellInputValue={setSellInputValue}
                  setBuyInputValue={setBuyInputValue}
                  balance={balance}
                  clearData={clearData}
                />
              )}

              <div className="buy-input mb-[0.3rem] flex justify-between items-center">
                <input
                  type="number"
                  placeholder="0.0"
                  className="pr-4 overflow-ellipsis w-[75%] sm:text-[25px] font-semibold focus:outline-none text-[20px]"
                  value={buyInputValue}
                  onChange={handleBuyInputChange}
                  onKeyPress={handleKeyPress}
                  readOnly
                />
              </div>
            </div>

            {/* Display BuySearchBar */}
            {showBuySearchBar && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                <BuySearchBar
                  closeModal={() => setShowBuySearchBar(false)}
                  setShowBuySearchBar={setShowBuySearchBar}
                />
              </div>
            )}

            {/* Divider */}
            <div className="relative w-full h-[1px] bg-[#f1f2f4]"></div>
            {!buyInputValue && walletAddress && (
              <div className="mx-2 my-3">
                <button
                  disabled
                  className="bg-[#f1f2f4] text-[#5e6773]  font-medium  border-[#d5d9dd] py-3  rounded-full  w-full "
                >
                  Review Order
                </button>
              </div>
            )}
            {!walletAddress && <CustomButton />}
            {sellInputValue > 0 && buyInputValue && walletAddress && (
              <div className="px-[1.5rem] py-5 justify-center flex items-center">
                {allowance === BigInt(0) ? (
                  <button
                    type="button"
                    className="bg-gray-800 text-white py-3 px-4 rounded-full w-full"
                    onClick={async () => {
                      try {
                        await writeContract({
                          abi: erc20Abi,
                          address: sellToken.address,
                          functionName: "approve",
                          args: [spender, MAX_ALLOWANCE],
                        });
                        console.log("Approving spender to spend sell token");

                        // Refetch the allowance after approval
                        refetch();
                      } catch (error) {
                        console.error("Error approving spender:", error);
                      }
                    }}
                  >
                    {isApproving ? "Approving…" : "Approve"}
                  </button>
                ) : (
                  <button
                    onClick={handleReviewOrder}
                    className="bg-gray-800 text-white py-3 px-4 rounded-full w-full"
                    type="button"
                  >
                    {/* {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''} */}
                    Review order
                  </button>
                )}
              </div>
            )}

            {/* {price?.issues.allowance === null&&   <button
          type="button"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-25"
        >
          { "Review Trade"}
        </button>} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;