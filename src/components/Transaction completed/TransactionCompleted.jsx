import React, { useState } from 'react';
import { IoArrowDownSharp } from "react-icons/io5";
import '../../index.css'


const TransactionCompleted = ({
  buyAmount,
  sellInpValue,
  setShowPlaceOrder,
  closeModal
}) => {
  const [buyToken, setBuyToken] = useState(() => {
    // Retrieve and parse the token from localStorage during initialization
    return JSON.parse(localStorage.getItem("buySelectedToken")) || null;
  });

  const [sellToken, setSellToken] = useState(() => {
    // Retrieve and parse the token from localStorage during initialization
    return JSON.parse(localStorage.getItem("sellSelectedToken")) || null;
  });
  return (
    <div className="flex justify-center items-center h-screen bg-black p-4">
      <div className="bg-white h-[350px] border absolute  rounded-[1.625rem] w-full sm:h-[400px] sm:w-[400px] flex flex-col justify-center items-center gap-3">
        <div className="absolute z-0 -top-2 right-10">
          <div className="fzfup1h fzfup1g"></div>
          {/* <div className="fzfup1i fzfup1g"></div> */}
        </div>

        <div className="z-50 mt-5">
          <svg
            viewBox="0 0 94 94"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="_1luup8k7 _1ye189v4vl _1ye189v4q9 _1ye189v4x6"
            height="94"
            width="94"
          >
            <g filter="url(#filter0_di_6872_111233)">
              <circle
                cx="47"
                cy="46"
                r="43"
                fill="#FFF"
                shape-rendering="crispEdges"
              ></circle>
            </g>
            <path
              class="_1luup8kf"
              d="M37 49.5L43.5 56L59.5 40"
              stroke="#00B96D"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <defs>
              <filter
                id="filter0_di_6872_111233"
                x="0"
                y="0"
                width="94"
                height="94"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood
                  flood-opacity="0"
                  result="BackgroundImageFix"
                ></feFlood>
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                ></feColorMatrix>
                <feOffset dy="1"></feOffset>
                <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="out"></feComposite>
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
                ></feColorMatrix>
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_6872_111233"
                ></feBlend>
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_6872_111233"
                  result="shape"
                ></feBlend>
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                ></feColorMatrix>
                <feOffset dy="-1"></feOffset>
                <feGaussianBlur stdDeviation="0.5"></feGaussianBlur>
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                ></feComposite>
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
                ></feColorMatrix>
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect2_innerShadow_6872_111233"
                ></feBlend>
              </filter>
            </defs>
          </svg>
        </div>

        <div className="flex flex-col gap-3 font-semibold justify-center items-center ">
          <p className="text-activeHead text-2xl z-50">Transaction Completed</p>
          {/* <p className="text-inactiveHead text-base">
            Yoou can see more details in trade history
          </p> */}
        </div>

        {/* transaction details */}
        <div className="gap-2 flex flex-col mt-2">
          <div className="flex tex-sm font-semibold gap-1">
            <img src={sellToken.logo} alt="" className="w-6 h-6" />
            <p>{sellInpValue}</p>
            <p>{sellToken.symbol}</p>
          </div>
          <div className="justify-center text-center flex items-center">
            <IoArrowDownSharp className=" text-inactiveHead " />
          </div>

          <div className="flex tex-sm font-semibold gap-1">
            <img src={buyToken.logo} alt="" className="w-6 h-6" />
            <p>{buyAmount}</p>
            <p>{buyToken.symbol}</p>
          </div>
        </div>

        <div>
          {/* <p className="text-inactiveHead text-base">
            Swapped via areodrome_v3 and 2 more
          </p> */}
        </div>

        {/* buttons */}
        <div className="flex w-full mt-8">
          <div className="pl-[1rem] pr-[1rem]  w-full">
            <button className="bg-gray-100  sm:text-[16px] font-[500] rounded-[1.625rem] w-full flex items-center justify-center h-12 text-[15px] text-activeHead">
              See details
            </button>
          </div>
          <div className="pl-[1rem] pr-[1rem]  w-full">
            <button
            onClick={closeModal}
            className="bg-[#17171c]  sm:text-[16px] font-[500] border rounded-[1.625rem] shadow-[0_1px_2px_rgba(0,0,0,0.2)] w-full flex items-center justify-center h-12 text-[15px] text-white">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCompleted