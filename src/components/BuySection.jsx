import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import BuyTokenList from './BuyTokenList';

const BuySection = ({
  autoShowSecondBuy,
  sellInputValue,
  setSellInputValue,
  setBuyInputValue,
  balance,
  clearData,
  setBuyToken,
  buyToken,
  buySelectedToken,
  setBuySelectedToken,
  showsell,
  handleBuySelectToken,
}) => {
  const [showSecondBuy, setShowSecondBuy] = useState(false);

  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <div>
      {/* Display selected token or show search button */}
      {!buyToken.address ? (
        <div className="flex justify-between">
          <button
            onClick={() => setShowSearchBar(true)}
            className="bg-selectTokenbg sm:text-sm font-medium text-white sm:px-2 py-1.5 sm:py-1.5 rounded-[1.625rem] flex text-xs px-2"
          >
            Select Token
            <IoIosArrowDown className="justify-center items-center ml-1 mt-1 text-xs sm:text-base" />
          </button>
        </div>
      ) : (
        <div className="flex justify-between">
          <div
            className="bg-gray-50 border-gray-200 items-center hover:bg-gray-100 border sm:text-base font-medium text-black sm:px-2 py-1.5 sm:py-1 rounded-[1.625rem] flex gap-2 cursor-pointer text-xs px-2"
            onClick={() => setShowSearchBar(true)} // Open search bar on click
          >
            <img
              src={buyToken?.logo}
              alt={buyToken?.symbol}
              className="sm:w-6 sm:h-6 w-4 h-4 rounded-full"
            />
            <p className="text-xs sm:text-base">{buyToken?.symbol}</p>
            <IoIosArrowDown className="justify-center items-center ml-1 mt-1 text-xs sm:text-base" />
          </div>
        </div>
      )}

      {/* Token Selection Modal */}
      {showSearchBar && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <BuyTokenList
            setBuySelectedToken={setBuySelectedToken}
            setShowSearchBar={setShowSearchBar}
            setBuyToken={setBuyToken}
            handleBuySelectToken={handleBuySelectToken}
          />
        </div>
      )}
    </div>
  );
};

export default BuySection;