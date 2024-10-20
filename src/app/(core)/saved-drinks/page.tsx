"use client";

import { useEffect, useState } from "react";
import saveddrinks from "@/assets/saveddrinks.svg";
import Image from "next/image";
import { ListItem } from "@/components/library/ListItem";
import { FetchedDrinksType } from "@/types/saved-drinks";
import { useQuery } from "@tanstack/react-query";
import { savedDrinks } from "@/utilities/useQueries/index";

export default function Page() {
  const {
    data: fetchedDrinks,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["savedDrinks"],
    queryFn: savedDrinks,
    enabled: true,
  });

  

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error?.message}</div>}
      {!isLoading && !isError && fetchedDrinks && (
        <>
          {/* Image should appear next to the menu, positioned absolutely */}
          <div className="absolute top-[-5.4rem] left-[2rem] md:left-[8rem]">
            <Image
              src={saveddrinks}
              alt="Saved drinks"
              width={240}
              height={60}
              className="w-[240px] h-[60px] md:w-[180px] md:h-[88px]"
            />
          </div>

          {/* Grid container for the saved drinks */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-center items-center w-full max-w-6xl px-4 mt-[2rem]">
            {fetchedDrinks.length > 0 ? (
              fetchedDrinks.map((drink:FetchedDrinksType, index:any) => (
                <ListItem key={index} drink={drink.cocktail} />
              ))
            ) : (
              <p>No saved drinks found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
