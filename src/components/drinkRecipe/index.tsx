import React from "react";
import { DrinkRecipeType } from "@/types/drink-generator";
import Image from "next/image";
import { FaDice } from "react-icons/fa";
import { PuffLoader as Loader } from "react-spinners";
import { DrinkLoading } from "@/components/library/animations/DrinkLoading";

interface DrinkRecipeProps {
  drink: DrinkRecipeType;
  startOver: () => void;
  fetchAgain: () => void;
  saveDrink: () => void;
  isLoading: boolean;
  isDrinkSaved: boolean;
  isSaving: boolean;
}

export const DrinkRecipe = ({
  drink,
  startOver,
  fetchAgain,
  isLoading,
  saveDrink,
  isDrinkSaved,
  isSaving,
}: DrinkRecipeProps) => {
  console.log("drink.image", drink.image);

  const half = Math.ceil(drink.ingredients.length / 2);
  const firstColumn = drink.ingredients.slice(0, half);
  const secondColumn = drink.ingredients.slice(half);

  return (
    <div className="flex md:items-center md:justify-center min-h-screen pt-12 md:pt-0">
      <div className="flex flex-col px-8">
        <div className="flex justify-center items-center pb-5">
          {isLoading ? (
            <Loader color="#f96575" loading={true} size={220} />
          ) : (
            <Image
              className="rounded-full"
              src={drink.image}
              alt={"cocktail"}
              width={220}
              height={220}
            />
          )}
        </div>
        <div className="flex justify-center font-medium text-[#3c2d63]">
          {drink.name.toUpperCase()}
        </div>

        <div className="mt-4 pb-6">
          <div className="text-lg font-semibold mb-2">Ingredients:</div>
          <div className="grid grid-cols-2 gap-x-4">
            <ul>
              {firstColumn.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.measure} {ingredient.ingredient}
                </li>
              ))}
            </ul>
            <ul>
              {secondColumn.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.measure} {ingredient.ingredient}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="t-4">
          <div className="text-lg font-semibold mb-2">Instructions:</div>
          <p className="mt-4 max-w-full md:max-w-md">{drink.instructions}</p>
        </div>
        <div className="pt-10  flex justify-between">
          <button
            className="drink-button py-2 px-4 space-x-0.5"
            disabled={isLoading}
            onClick={() => {
              fetchAgain();
            }}
          >
            <span>Try another</span> <FaDice />
          </button>
          <button
            disabled={isLoading}
            className="drink-button py-2 px-4"
            onClick={() => {
              startOver();
            }}
          >
            Start over
          </button>
          <button
            className="drink-button py-2 px-4 disabled:bg-gray-300"
            disabled={isSaving}
            onClick={() => saveDrink()}
          >
            {isDrinkSaved ? "Delete" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
