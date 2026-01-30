const calculateRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;

  const total = ratings.reduce((sum, r) => sum + r.value, 0);
  return Number((total / ratings.length).toFixed(1));
};

export default calculateRating;