"use client";

import { useEffect, useState } from "react";
import saveddrinks from "@/assets/saveddrinks.svg";
import Image from "next/image";
import { ListItem } from "@/components/library/ListItem";
import { FetchedDrinksType, FetchedDrinkType } from "@/types/saved-drinks";

export default function Page() {
  //get all saved drinks for a certain user
  const [fetchedDrinks, setFetchedDrinks] = useState<FetchedDrinksType[]>([]);

  useEffect(() => {
    const fetchSavedDrinks = async () => {
      try {
        const response = await fetch("/api/saveddrinks");
        const data = await response.json();
        setFetchedDrinks(data.savedDrinks);
      } catch (error) {
        console.log("Failed to fetch", error);
      }
    };
    fetchSavedDrinks();
  }, []);


  return (
    <div className="flex  items-center  justify-center min-h-screen">
      <div className="flex flex-col md:flex-row ">
        <div className="md:flex md:flex-col space-y-2 -mt-[5.1rem] md:mt-4">
          <Image
            src={saveddrinks}
            alt="drink"
            width={0}
            height={0}
            className="w-[240px] h-[60px] md:w-[180px] md:h-[88px] md:hidden"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 space-x-0.5 justify-center items-center">
            {fetchedDrinks.map((drink, index) => (
              <ListItem key={index} drink={drink.cocktail} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
