"use client";

import { savedSingleDrink, savedDrinks } from "@/utilities/useQueries/index";
import { DrinkRecipe } from "@/components/drinkRecipe";
import { useEffect } from "react";
import { DrinkRecipeType } from "@/types/drink-generator";
import { useState } from "react";
import { DrinkLoading } from "@/components/library/animations/DrinkLoading";

export default function CocktailDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [drink, setDrink] = useState<DrinkRecipeType | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    const fetchDrink = async () => {
      setIsDataLoading(true);
      try {
        const drink = await savedSingleDrink(id);
        setDrink(drink.filteredData);
      } catch (error) {
        console.error("Error fetching drink manually:", error);
      }
    };

    if (id) fetchDrink();
    setIsDataLoading(false);
  }, [id]);

  if (isDataLoading) {
    return <DrinkLoading />;
  }

  return (
    <div>
      <DrinkRecipe drink={drink} isLoading={isDataLoading} hideButtons={!!id} />
    </div>
  );
}
