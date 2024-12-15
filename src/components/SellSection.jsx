import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import SellTokenList from "./SellTokenList";

const SellSection = ({
  autoShowSecondSell,
  sellInputValue,
  setSellInputValue,
  setBuyInputValue,
  balance,
  clearData,
  setSellToken,
  sellToken,
   SwapSellBuy,
   showsell
}) => {
  const [showSearchBar, setShowSearchBar] = useState(false);

  const [showSecondSell, setShowSecondSell] = useState(autoShowSecondSell);
    const [buySelectedToken, setBuySelectedToken] = useState(null);
 
 console.log(sellToken)


  

  return (
    <div>
      {!sellToken?.address ? (
        <div className="flex justify-between">
          <button
            onClick={() => setShowSearchBar(true)}
            className="bg-selectTokenbg sm:text-sm font-medium text-white sm:px-2 py-1.5 sm:py-1.5 rounded-[1.625rem] flex text-xs px-2"
          >
            Select Token
            <IoIosArrowDown className="justify-center items-center ml-1 mt-1 text-xs sm:text-base" />
          </button>
          <div className="flex justify-end gap-1.5 items-center">
            {[1, 2, 3].map((_, index) => (
              <img
                key={index}
                src="https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png"
                alt={`Token ${index + 1}`}
                className="sm:w-[30px] sm:h-[30px] p-[0.375rem] bg-gray-100 rounded-full w-[25px] h-[25px]"
              />
            ))}
          </div>
         
            <div className="flex justify-end gap-[0.375rem] items-center">
              {["Max"].map((label) => (
                <button
                  key={label}
                  className="bg-[#f1f2f4] text-[#17171c] sm:text-[14px] text-xs font-[500] py-[.30rem] opacity-[0.5] rounded-[1.625rem] border px-[.75rem] border-[#d5d9dd]"
                >
                  {label}
                </button>
              ))}
            </div>
          
        </div>
      ) : (
        <div className="flex justify-between">
          <div
            className="bg-gray-50 border-gray-200 items-center hover:bg-gray-100 border sm:text-base font-medium text-black sm:px-2 py-1.5 sm:py-1 rounded-[1.625rem] flex gap-2 cursor-pointer text-xs px-2"
            onClick={() => setShowSearchBar(true)}
          >
            <img
              src={sellToken.logo}
              alt={sellToken.symbol}
              className="sm:w-6 sm:h-6 w-4 h-4 rounded-full"
            />
            <p className="text-xs sm:text-base">{sellToken.symbol}</p>
            <IoIosArrowDown className="justify-center items-center ml-1 mt-1 text-xs sm:text-base" />
          </div>
          <div></div>

          <div className="flex justify-end gap-[0.375rem] items-center">
            {sellInputValue > 0 && (
              <button
                onClick={clearData}
                className="bg-[#f1f2f4] text-[#17171c] sm:text-[14px] text-xs font-[500] py-[.30rem]  rounded-[1.625rem] border px-[.75rem] border-[#d5d9dd]"
              >
                clear
              </button>
            )}
          
              <div className="flex justify-end gap-[0.375rem] items-center">
                {["Max"].map((label) => (
                  <button
                    key={label}
                    disabled={!balance?.sellTokenBalance}
                    onClick={() => setSellInputValue(balance?.sellTokenBalance)}
                    className="bg-[#f1f2f4] text-[#17171c] sm:text-[14px] text-xs font-[500] py-[.30rem]  rounded-[1.625rem] border px-[.75rem] border-[#d5d9dd]"
                  >
                    {label}
                  </button>
                ))}
              </div>
          
          </div>
        </div>
      )}

      {showSearchBar && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <SellTokenList
            setShowSearchBar={setShowSearchBar}
            SwapSellBuy={SwapSellBuy}
            setSellToken={setSellToken}
            clearData={clearData}
          />
        </div>
      )}
    </div>
  );
};

export default SellSection;