export const savedDrinks = async () => {
  const response = await fetch("/api/saveddrinks");
  if (!response.ok) {
    throw new Error("Failed to fetch saved drinks");
  }
  const data = await response.json();
  return data.savedDrinks;
};

export const savedSingleDrink = async (drinkId: string) => {
  const response = await fetch(`/api/saveddrinks/${drinkId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch saved drinks");
  }
  const data = await response.json();
  return data;
};
