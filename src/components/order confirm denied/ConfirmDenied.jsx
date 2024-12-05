import React, { useState } from 'react';
import Market from '../Market';

const ConfirmDenied = ({ setShowPlaceOrder }) => {
  const [showMarket, setShowMarket] = useState(false); // State to toggle between ConfirmDenied and Market

  const handleBackClick = () => {
    setShowMarket(true); // When the Back button is clicked, show Market component
  };

  if (showMarket) {
    return <Market />; // If state is true, show the Market component
  }
  return (
    <div className="flex justify-center items-center h-screen bg-black p-4 ">
      <div className="bg-white h-[350px] border rounded-[1.625rem] w-full absolute sm:h-[400px] sm:w-[400px] flex flex-col justify-center items-center gap-10">
        <div className="absolute z-0 ">
          <div class="fzfup1j fzfup1f"></div>
          <div class="fzfup1k fzfup1g"></div>
        </div>
        <div className="z-50 rounded-full p-8 bg-white">
          <svg
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
          >
            <path
              d="M14 19.2V14M14 8.8H14.013M27 14C27 21.1797 21.1797 27 14 27C6.8203 27 1 21.1797 1 14C1 6.8203 6.8203 1 14 1C21.1797 1 27 6.8203 27 14Z"
              stroke="#5932f3"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </div>

        <div className="flex flex-col gap-4 font-semibold justify-center items-center z-50">
          <p className="text-activeHead text-2xl">Order Confirmation Denied</p>
          <p className="text-inactiveHead text-base">
            You successfully cancelled the order
          </p>
        </div>

        <div className="pl-[3rem] pr-[3rem] mt-2 w-full">
          <button
            onClick={()=> setShowPlaceOrder(false)}
            className="bg-[#17171c] sm:mt-2 sm:text-[16px] font-[500] border rounded-[1.625rem] shadow-[0_1px_2px_rgba(0,0,0,0.2)] w-full flex items-center justify-center h-12 text-[15px] text-white"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDenied