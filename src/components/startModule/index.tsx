import React from "react";
import drink from "@/assets/drink.svg";
import text from "@/assets/text.svg";
import pinkdrink from "@/assets/pinkdrink.svg";
import orangedrink from "@/assets/orangedrink.svg";
import Image from "next/image";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

type StartModuleProps = {
  setShowStartModule: (value: boolean) => void;
};

export const StartModule = ({ setShowStartModule }: StartModuleProps) => {
  return (
    <div className="flex flex-col px-8 space-y-2 md:justify-center md:items-center md:min-h-screen">
      <Image
        src={text}
        alt="drink"
        width={230}
        height={44}
        className="w-[230px] h-[44px] md:w-[460px] md:h-[88px]"
      />
      <Image
        src={drink}
        alt="drink"
        width={0}
        height={0}
        className="w-[120px] h-[50px] md:w-[220px] md:h-[88px]"
      />
      <div className="text-[#757163] text-lg pb-3 whitespace-pre-line">
        {"The one-stop to find amazing drink mixes \n for any occasion."}
      </div>
      <button
        onClick={() => setShowStartModule(false)}
        className="bg-[#1d2742] hover:bg-primary-content text-white font-bold py-2 px-4 rounded-3xl w-[180px] h-[58px] flex justify-center items-center hover:bg-[#f96575] "
      >
        <span>Get Started</span>
        <MdOutlineKeyboardArrowRight className="w-5" />
      </button>
      <Image
        src={pinkdrink}
        alt="pink drink"
        width={0}
        height={0}
        className="block md:hidden w-[302px] h-[532px] md:w-[460px] md:h-[800px]"
      />
      <Image
        src={orangedrink}
        alt="orange drink"
        width={0}
        height={0}
        className="hidden md:block w-[302px] h-[532px] md:w-[460px] md:h-[800px]"
      />
    </div>
  );
};
