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
    <div className="flex md:items-center md:justify-center min-h-screen">
      <div className="flex flex-col md:flex-row px-8 ">
        <div className="md:flex md:flex-col space-y-2">
          <Image
            src={text}
            alt="drink"
            width={230}
            height={44}
            className="w-[230px] h-[44px] md:w-[360px] md:h-[88px]"
          />
          <Image
            src={drink}
            alt="drink"
            width={0}
            height={0}
            className="w-[120px] h-[50px] md:w-[180px] md:h-[88px]"
          />
          <div className="text-[#757163] text-lg pb-3 whitespace-pre-line">
            {"The one-stop to find amazing drink \n mixes for any occasion."}
          </div>
          <button
            onClick={() => setShowStartModule(false)}
            className="drink-button w-[180px] h-[58px] py-2 px-4"
          >
            <span>Get Started</span>
            <MdOutlineKeyboardArrowRight className="w-5" />
          </button>
          <Image
            src={pinkdrink}
            alt="pink drink"
            width={0}
            height={0}
            className="block md:hidden w-[350px] h-[380px] md:w-[460px] md:h-[800px]"
          />
        </div>
        <Image
          src={orangedrink}
          alt="orange drink"
          width={0}
          height={0}
          className="hidden md:block w-[302px] h-[532px] md:w-[200px] md:h-[300px]"
        />
      </div>
    </div>
  );
};
