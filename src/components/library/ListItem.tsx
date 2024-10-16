import { useState, useEffect } from "react";
import Image from "next/image";
import { FetchedDrinksType, FetchedDrinkType } from "@/types/saved-drinks";

type ListItemProps = {
  drink: FetchedDrinkType;
};
export const ListItem = ({ drink }: ListItemProps) => {
  const [fontSize, setFontSize] = useState("text-lg");

  useEffect(() => {
    if (drink.name.length > 20) {
      setFontSize("text-sm");
    } else if (drink.name.length > 15) {
      setFontSize("text-base");
    } else {
      setFontSize("text-lg");
    }
  }, [drink.name.length]);

  return (
    <div className="w-[175px] h-[200px] flex flex-col p-2 rounded-[20px] shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]">
      <div className="flex justify-center items-center rounded-full">
        <Image
          src={drink.image}
          alt={drink.name}
          width={120}
          height={121}
          className="rounded-full"
        />
      </div>
      <div
        className={`text-[#757163] ${fontSize} pb-1 pt-2 px-2 whitespace-nowrap overflow-hidden text-ellipsis`}
        style={{ height: "40px" }}
      >
        {drink.name}
      </div>
      <div className="px-2">⭐4.5</div>
    </div>
  );
};
