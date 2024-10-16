export type FetchedDrinksType = {
  id: string;
  userId: string;
  coctailId: string;
  cocktail: FetchedDrinkType;
};

export type FetchedDrinkType = {
  id: string;
  name: string;
  image: string;
};
