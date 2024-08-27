import React from "react";
import { DrinkRecipeType } from "@/types/drink-generator";
import Image from "next/image";
import test from "@/assets/test.jpg";
interface DrinkRecipeProps {
  drink: DrinkRecipeType;
}

export const DrinkRecipe = ({ drink }: DrinkRecipeProps) => {
  console.log("drink.image", drink.image);

  return (
    <div className="relative flex flex-col bg-inherit">
      <div className="flex justify-center items-center pb-5">
        <Image
          className="rounded-full"
          src={drink.image}
          alt={"coctail"}
          width={220}
          height={220}
        />
      </div>
      <div className="flex justify-center">{drink.name.toUpperCase()}</div>

      <div>
        Ingridients:
        <ul>
          {drink.ingredients.map((ingridient, index) => (
            <li key={index}>
              {ingridient.measure} {ingridient.ingredient}
            </li>
          ))}
        </ul>
      </div>
      <p>{drink.instructions}</p>
    </div>
  );
};
