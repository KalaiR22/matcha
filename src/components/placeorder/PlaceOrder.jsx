import React, { useState, useEffect } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdKeyboardArrowRight } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { PiDotDuotone } from "react-icons/pi";
import { LuArrowRightLeft } from "react-icons/lu";
import TransactionPending from '../transaction pending/TransactionPending';
import ConfirmDenied from '../order confirm denied/ConfirmDenied';
import { formatUnits, parseUnits } from "ethers/lib/utils";
import {
  useSignTypedData,
  useWalletClient
 
} from "wagmi";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem"; 
import { concat, numberToHex, size } from "viem";
import { ethers } from "ethers";
import TransactionCompleted from '../Transaction completed/TransactionCompleted';





const PlaceOrder = ({
  setShowPlaceOrder,
  sellTokenAddress,
  buyTokenAddress,
  sellInpValue,
  walletAddress, clearData,
  sellToken, buyToken
}) => {
 // console.log(sellTokenAddress,buyTokenAddress,walletAddress)
  
  const { signTypedDataAsync } = useSignTypedData();
    const {
      data: hash,
      error,
      isPending,
      sendTransaction,
    } = useSendTransaction(); 
  const { data: walletClient } = useWalletClient();
  const { waitForTransaction } = useWaitForTransactionReceipt();

  const [buyAmount, setBuyAmount] = useState('')
 const [startTrading, setStartTrading] = useState(false)
  const [seconds, setSeconds] = useState(30); // Default 25 seconds
  const [isTimeout, setIsTimeout] = useState(false); // Track whether we're in the timeout section
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isWalletDenied, setIsWalletDenied] = useState(false);
  const [quote, setQuote] = useState('')
  const [transStarted, settransStarted] = useState(false)
  const [transSuccess, setTransSuccess] = useState(false)
  const [transFail, setTransFail] = useState(false)

  const closeModal = () =>{
    setShowPlaceOrder(false);
    clearData();
  }

  const parsedSellAmount = sellInpValue
    ? parseUnits(sellInpValue, sellToken.decimals).toString()
    : undefined;

  const parsedBuyAmount = buyAmount
    && parseUnits(buyAmount, buyToken.decimals).toString()
    ;
    //console.log(parsedBuyAmount, quote?.buyAmount)
  useEffect(() => {
    let timerId;
    if (seconds > 0 && !isTimeout) {
      timerId = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsTimeout(true); // Switch to the timeout section when the timer hits 0
    }
    return () => clearInterval(timerId); // Clean up the interval when the component unmounts or the timer reaches 0
  }, [seconds, isTimeout]);

  const formattedTime = `${Math.floor(seconds / 60)}:${String(
    seconds % 60
  ).padStart(2, "0")}`;

  const handleRefresh = () => {
    setIsTimeout(false); // Reset to timein section
    setSeconds(30); // Reset the timer
    fetchSwapQuote();
  };

     const fetchSwapQuote = async (buyTokenAddress,sellTokenAddress, chainId = 8453) => {
      //console.log(buyToken.address,sellToken.address)
      if (!buyToken.address || !sellToken.address) {
          console.error("Tokens are not selected.");
          return;
      }

      //setLoading(true);
     // setError(null); // Reset error state before fetching new data

      const params = {
          chainId,
          buyToken: buyToken.address,
          sellToken: sellToken.address,
          sellAmount: parsedSellAmount, // Assuming 18 decimals
          taker: walletAddress,
      };

      try {
          const response = await fetch(
              `http://localhost:3001/api/swap-quote?` + new URLSearchParams(params), // Call your backend API
              {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                  },
              }
          );

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setBuyAmount(
                      formatUnits(data.buyAmount, buyToken.decimals)
                    );

          setQuote(data)
          console.log(data);
      } catch (err) {
        //  setError(err.message);
      } finally {
         // setLoading(false);
      }
  };
useEffect(()=>{
  fetchSwapQuote();
},[sellInpValue,sellTokenAddress,buyTokenAddress])
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const chainId = 8453; // Mainnet. Update as necessary.

  // const params = {
  //   chainId,
  //   buyToken: buyToken?.address,
  //   sellToken: sellToken?.address,
  //   sellAmount: sellInputValue * 1e18, // Assuming 18 decimals
  //   taker: "0x9BC9DfcF26c3dA16058Aa604E01Bbe85B9903bbA",
  // };

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
  };

  const handleConfirmWallet = async () => {
    if (window.ethereum) {
      try {
        // Request a transaction via MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const from = accounts[0];

        // Example transaction parameters
        const transactionParams = {
          from,
          to: params.taker,
          value: "0x0", // Replace with actual value if required
          data: "0x", // Add appropriate data for the transaction
          chainId: params.chainId,
        };

        await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParams],
        });

        alert("Transaction sent successfully!");
      } catch (error) {
        console.error("Error sending transaction:", error);
        alert("Transaction failed.");
      }
    } else {
      alert(
        "MetaMask is not installed. Please install MetaMask and try again."
      );
    }
  };

  const handleWalletConnectionDenied = () => {
    setIsWalletDenied(true); // Set the state to true if the wallet connection is denied
  };

  if (isTransactionPending) {
    return <TransactionPending />;
  }

  if (isWalletDenied) {
    return <ConfirmDenied />; // Show ConfirmDenied if wallet connection was denied
  }

 


 const handleOnClick = async () => {
   console.log("Submitting quote to blockchain");
   console.log("To:", quote?.transaction?.to);
   console.log("Value:", quote?.transaction?.value);
   setIsPlacingOrder(true);
   // On click, (1) Sign the Permit2 EIP-712 message returned from quote
   if (quote?.permit2?.eip712) {
     let signature;
     try {
       signature = await signTypedDataAsync(quote.permit2.eip712);
       console.log("Signed permit2 message from quote response");
     } catch (error) {
       console.error("Error signing permit2 coupon:", error);
     }
     // (2) Append signature length and signature data to calldata
     if (signature && quote?.transaction?.data) {
       const signatureLengthInHex = numberToHex(size(signature), {
         signed: false,
         size: 32,
       });
       console.log("1");
       const transactionData = quote.transaction.data;
       const sigLengthHex = signatureLengthInHex;
       const sig = signature;
       console.log("2");
       quote.transaction.data = concat([transactionData, sigLengthHex, sig]);
       console.log(quote.transaction.data);
     } else {
      transFail(true)
       throw new Error("Failed to obtain signature or transaction data");
       
     }
   }

   // (3) Submit the transaction with Permit2 signature
   if (sendTransaction) {
     console.log("101");
     sendTransaction({
       account: walletClient?.account?.address,
       gas: quote?.transaction?.gas ? BigInt(quote.transaction.gas) : undefined,
       to: quote?.transaction?.to,
       data: quote?.transaction?.data, // submit
       value: quote?.transaction?.value
         ? BigInt(quote.transaction.value)
         : undefined, // value is used for native tokens
       chainId: chainId,
     });
     console.log("102");
   }
   console.log("103");
 }; 
 const { isLoading: isConfirming, isSuccess: isConfirmed } =
   useWaitForTransactionReceipt({
     hash,
   });
if(isConfirming){
  console.log('confirming')
}
if(isConfirmed){
  console.log('confirmed')
}
if(error){
  console.log(error.message);
}


  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center min-h-screen bg-black p-4">
      {/* ===================== Timein Section ==================== */}

      {!isConfirmed && !isConfirming && !error && !transFail && (
        <div className="bg-white h-[350px] border rounded-[1.625rem] w-full sm:h-[450px] sm:w-[450px]">
          <div className="relative py-1 sm:py-3">
            {isTimeout ? (
              <div className="relative ">
                <FaArrowLeftLong
                  className="absolute left-[1.25rem] top-1/2 -translate-y-1/2 text-activeHead cursor-pointer"
                  onClick={() => setShowPlaceOrder(false)}
                />
                <p className="text-center text-[#ff656d] font-semibold">
                  Price Update
                </p>
              </div>
            ) : (
              <div>
                <FaArrowLeftLong
                  className="absolute left-[1.25rem] top-1/2 -translate-y-1/2 text-activeHead cursor-pointer"
                  onClick={() => setShowPlaceOrder(false)}
                />
                <p className="text-center text-activeHead font-semibold">
                  Quote{" "}
                  <span className="text-inactiveHead">
                    Expires in {formattedTime}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Token details */}
          <div className="relative flex pl-[1.25rem] py-1 pr-[1.25rem] gap-2 justify-between">
            <div className="absolute top-[2.7rem] left-1/2 -translate-x-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center flex">
                <MdKeyboardArrowRight className="w-7 h-7" />
              </div>
            </div>

            {/* Sell div */}
            <div className="bg-gray-100 rounded-3xl w-1/2 h-[120px] flex flex-col items-center justify-center">
              <div>
                <img
                  src={sellToken?.logo}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-activeHead font-medium">
                  {sellInpValue} {sellToken?.symbol}
                </p>
                <p className="text-inactiveHead">s0.01</p>
              </div>
            </div>

            {/* Buy div */}
            <div className="bg-gray-100 rounded-3xl w-1/2 h-[120px] flex flex-col items-center justify-center">
              <div>
                <img
                  src={buyToken?.logo}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-activeHead font-medium">
                  {buyAmount} {buyToken?.symbol}
                </p>
                <p className="text-inactiveHead">s0.01</p>
              </div>
            </div>
          </div>
          <div>
            {/* Network cost */}
            <div className="flex justify-between pl-[1.25rem] pt-4 pr-[1.25rem] text-sm">
              <div className="flex text-center justify-center items-center gap-2">
                <GoDotFill className="text-gray-500 w-3 h-3" />
                <p className="text-gray-500 font-medium">Network cost</p>
              </div>
              <div className="flex text-gray-800">
                <p>0.0000000 </p>
                <p>ETH</p>
                <p className="text-gray-500">(0.132)</p>
              </div>
            </div>

            {/* Dotted flow */}
            <div className="flex justify-start pl-[1.50rem] pr-[1.25rem] -mt-1">
              <div className="border-l-2 border-dotted border-gray-300 h-4"></div>
            </div>

            {/* Received */}
            <div className="flex justify-between pr-[1.25rem] -mt-2 text-sm">
              <div className="flex text-center justify-center items-center">
                <PiDotDuotone className="text-black w-12 h-12" />
                <p className="text-gray-500 font-medium -ml-2">
                  You receive (0% fee)
                </p>
              </div>
              <div className="flex text-gray-800 items-center">
                <p>0.0000000 </p>
                <p>ETH</p>
              </div>
            </div>
          </div>

          {/* Further details */}
          <div className="gap-2 flex flex-col mt-3">
            {/* Route */}
            <div className="flex pl-[1.50rem] pr-[1.25rem] justify-between text-sm">
              <div>
                <p className="text-gray-500 font-medium">Route</p>
              </div>
              <div className="flex">
                {/* Image */}
                <div className="flex justify-center items-center">
                  <img
                    src="https://logowik.com/content/uploads/images/ethereum-eth7803.logowik.com.webp"
                    alt=""
                    className="w-4 h-4 z-30"
                  />
                  <img
                    src="https://logowik.com/content/uploads/images/ethereum-eth7803.logowik.com.webp"
                    alt=""
                    className="w-4 h-4 -ml-2 z-20"
                  />
                  <img
                    src="https://logowik.com/content/uploads/images/ethereum-eth7803.logowik.com.webp"
                    alt=""
                    className="w-4 h-4 -ml-2 z-10"
                  />
                </div>

                <div>
                  <p className="text-gray-500 font-medium">3 sources</p>
                </div>
              </div>
            </div>

            {/* Slippage */}
            <div className="flex pl-[1.50rem] pr-[1.25rem] justify-between text-sm">
              <div>
                <p className="text-gray-500 font-medium">Max. slippage</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">0.5%</p>
              </div>
            </div>

            {/* Rate */}
            <div className="flex pl-[1.50rem] pr-[1.25rem] justify-between text-sm">
              <div>
                <p className="text-gray-500 font-medium">Rate</p>
              </div>
              <div className="flex gap-2">
                <div className="bg-gray-200 p-1 rounded-full">
                  <LuArrowRightLeft className="" />
                </div>
                <div>
                  <p className="text-gray-500 font-medium">
                    1 USDC = 0.00029 ETH
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Place Order Button */}
          {/* Buttons */}
          <div className="pl-[2.50rem] pr-[2.25rem] mt-8">
            {isTimeout && !isPlacingOrder && (
              <div className="pl-[2.50rem] pr-[2.25rem] mt-8">
                <button
                  onClick={handleRefresh}
                  className="bg-[#17171c] sm:mt-2 sm:text-[16px] font-[500] border rounded-[1.625rem] shadow-[0_1px_2px_rgba(0,0,0,0.2)] w-full flex items-center justify-center h-12 text-[15px] text-white"
                >
                  Refresh Quote
                </button>
              </div>
            )}
            {!isTimeout && !isPlacingOrder && (
              <button
                onClick={handleOnClick}
                disabled={!buyAmount}
                className="bg-[#17171c] sm:mt-2 sm:text-[16px] font-[500] border rounded-[1.625rem] shadow-[0_1px_2px_rgba(0,0,0,0.2)] w-full flex items-center justify-center h-12 text-[15px] text-white"
              >
                Place Order
              </button>
            )}
            {isPlacingOrder && (
              <button
                disabled
                className="bg-[#f1f2f4] text-[#5e6773] gap-2 sm:mt-2 sm:text-[16px] font-[500] border rounded-[1.625rem] shadow-[0_1px_2px_rgba(0,0,0,0.2)] w-full flex items-center justify-center h-12 text-[15px]"
              >
                <div
                  className="h-4 w-4 border-2 border-borderDefault border-t-black rounded-full animate-spinCustom"
                  role="status"
                ></div>
                Confirm in Your Wallet
              </button>
            )}
          </div>
        </div>
      )}

      {isConfirming && <TransactionPending />}
      {isConfirmed && (
        <TransactionCompleted
          buyAmount={buyAmount}
          sellInpValue={sellInpValue}
          setShowPlaceOrder={setShowPlaceOrder}
          closeModal={closeModal}
        />
      )}
      {(error || transFail) && <ConfirmDenied setShowPlaceOrder={setShowPlaceOrder} />}

      {/* ================== Timeout Section ======================= */}
     
    </div>
  );
};

export default PlaceOrder;
