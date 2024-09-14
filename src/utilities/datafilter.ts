export function dataFilter(data: any) {
  // Filter out the ingredients and measures
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = data[`strIngredient${i}`];
    const measure = data[`strMeasure${i}`];
    if (ingredient) {
      ingredients.push({ ingredient: ingredient, measure: measure });
    }
  }

  const filteredData = {
    id: data.idDrink,
    name: data.strDrink,
    instructions: data.strInstructions,
    image: data.strDrinkThumb,
    ingredients,
  };
  return filteredData;
}
