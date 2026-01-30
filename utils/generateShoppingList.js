export default function generateShoppingList(meals) {
  const items = {};

  if (!meals || typeof meals !== "object") return [];

  Object.values(meals).forEach((dayMeals) => {
    if (!Array.isArray(dayMeals)) return;

    dayMeals.forEach((recipe) => {
      if (!recipe || !Array.isArray(recipe.ingredients)) return;

      recipe.ingredients.forEach((ingredient) => {
        if (!ingredient || typeof ingredient !== "string") return;

        const key = ingredient.trim().toLowerCase();
        if (!key) return;

        items[key] = (items[key] || 0) + 1;
      });
    });
  });

  return Object.entries(items).map(([name, count]) => ({
    name,
    count,
  }));
}
