import { useEffect, useState } from "react";
import { DrinkRecipeType, MetricsType } from "@/types/drink-generator";
import Image from "next/image";
import { FaDice } from "react-icons/fa";
import { PuffLoader as Loader } from "react-spinners";
import { toast } from "react-toastify";
import { DrinkLoading } from "@/components/library/animations/DrinkLoading";

interface DrinkRecipeProps {
  drink: DrinkRecipeType | null;
  startOver?: () => void;
  fetchAgain?: () => void;
  isLoading: boolean;
  hideButtons?: boolean;
  metrics: MetricsType | null;
}

export const DrinkRecipe = ({
  metrics,
  hideButtons,
  drink,
  startOver = () => {},
  fetchAgain = () => {},
  isLoading,
}: DrinkRecipeProps) => {
  const [isDrinkSaved, setIsDrinkSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!drink?.id) return;
      try {
        const response = await fetch(`/api/saveddrinks/${drink.id}`);
        const data = await response.json();
        setIsDrinkSaved(!!data.savedDrink);
      } catch (error) {}
    };
    checkIfSaved();
  }, [drink, isDrinkSaved]);

  const onSaveDrink = async () => {
    setIsSaving(true);
    const response = await fetch("/api/saveddrinks", {
      method: isDrinkSaved ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ drink: drink }),
    });
    if (!response.ok) {
      setIsSaving(false);

      throw new Error("Failed to save drink");
    }
    setIsDrinkSaved(!isDrinkSaved);
    setIsSaving(false);

    toast.success(isDrinkSaved ? "Drink DELETED" : "Drink SAVED");
  };

  if (!drink) {
    return <DrinkLoading />;
  }

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
        <div className="text-lg font-semibold mb-2">Metrics:</div>
        {metrics ? (
          <div className="grid grid-cols-2 gap-x-4 mb-4">
            <ul>
              <li>
                <strong>Sweetness:</strong> {metrics.sweetness}/5
              </li>
              <li>
                <strong>Sourness:</strong> {metrics.sourness}/5
              </li>
              <li>
                <strong>Alco Strength:</strong> {metrics.alcoholStrength}/5
              </li>
            </ul>
            <ul>
              <li>
                <strong>Bitterness:</strong> {metrics.bitterness}/5
              </li>
              <li>
                <strong>Time to Make:</strong> {metrics.timeToMake} min
              </li>
              <li>
                <strong>Rating:</strong> {metrics.rating}⭐
              </li>
            </ul>
          </div>
        ) : (
          <div>No metrics available.</div>
        )}

        <div className="t-4">
          <div className="text-lg font-semibold mb-2">Instructions:</div>
          <p className="mt-4 max-w-full md:max-w-md">{drink.instructions}</p>
        </div>
        <div className="pt-10  flex justify-between">
          {!hideButtons && (
            <>
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
            </>
          )}
          {hideButtons && (
            <button
              className="drink-button py-2 px-4"
              onClick={() => {
                window.history.back();
              }}
            >
              Go back
            </button>
          )}
          <button
            className="drink-button py-2 px-4 disabled:bg-gray-300"
            disabled={isSaving}
            onClick={() => onSaveDrink()}
          >
            {isDrinkSaved ? "Delete" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
