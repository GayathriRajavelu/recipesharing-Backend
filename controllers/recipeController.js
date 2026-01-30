import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

/* GET ALL */
export const getAllRecipes = async (req, res) => {
  const recipes = await Recipe.find()
    .populate("user", "name _id")
    .sort({ createdAt: -1 });
  res.json(recipes);
};

/* GET ONE */
export const getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
    .populate("user", "name _id")
    .populate("comments.user", "name _id");

  if (!recipe) return res.status(404).json({ message: "Not found" });
  res.json(recipe);
};

/* COMMENT */
export const commentRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    recipe.comments.push({
      user: req.user._id,
      text: req.body.text,
    });

    await recipe.save();

    const populated = await Recipe.findById(recipe._id)
      .populate("user", "name _id")
      .populate("comments.user", "name _id");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* LIKE / UNLIKE */
export const likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Not found" });

    const userId = req.user._id.toString();

    recipe.likes = recipe.likes.filter(id => id);

    const index = recipe.likes.findIndex(
      id => id.toString() === userId
    );

    if (index >= 0) recipe.likes.splice(index, 1);
    else recipe.likes.push(userId);

    await recipe.save();

    const populated = await Recipe.findById(recipe._id)
      .populate("user", "name _id")
      .populate("comments.user", "name _id");

    res.json(populated);
  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* RATE */
export const rateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Not found" });

    const userId = req.user._id.toString();
    const { value } = req.body;

    recipe.ratings = recipe.ratings.filter(r => r.user);

    const existing = recipe.ratings.find(
      r => r.user.toString() === userId
    );

    if (existing) existing.value = value;
    else recipe.ratings.push({ user: userId, value });

    await recipe.save();

    const populated = await Recipe.findById(recipe._id)
      .populate("user", "name _id")
      .populate("comments.user", "name _id");

    res.json(populated);
  } catch (err) {
    console.error("RATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* FAVORITE */
export const toggleFavorite = async (req, res) => {
  const user = await User.findById(req.user._id);
  const recipeId = req.params.id;

  const index = user.favorites.findIndex(
    (id) => id.toString() === recipeId
  );

  if (index >= 0) user.favorites.splice(index, 1);
  else user.favorites.push(recipeId);

  await user.save();
  res.json({ favorites: user.favorites });
};

/* DELETE RECIPE */
export const deleteRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) return res.status(404).json({ message: "Not found" });
  if (recipe.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not allowed" });

  if (recipe.mediaPublicId) {
    await cloudinary.uploader.destroy(recipe.mediaPublicId, {
      resource_type: recipe.mediaType === "video" ? "video" : "image",
    });
  }

  await recipe.deleteOne();
  res.json({ message: "Deleted" });
};

/* UPDATE */
export const updateRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Not found" });

  if (recipe.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not allowed" });

  const { title, description, ingredients, steps } = req.body;

  if (title) recipe.title = title;
  if (description) recipe.description = description;
  if (ingredients) recipe.ingredients = ingredients.split(",");
  if (steps) recipe.steps = steps.split(",");

  if (req.file) {
    recipe.mediaUrl = req.file.path;
    recipe.mediaType = req.file.mimetype.startsWith("video")
      ? "video"
      : "image";
    recipe.mediaPublicId = req.file.filename;
  }

  await recipe.save();

  const populated = await Recipe.findById(recipe._id)
    .populate("user", "name _id")
    .populate("comments.user", "name _id");

  res.json(populated);
};

/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  recipe.comments = recipe.comments.filter(
    (c) => c._id.toString() !== req.params.commentId
  );

  await recipe.save();

  const populated = await Recipe.findById(recipe._id)
    .populate("user", "name _id")
    .populate("comments.user", "name _id");

  res.json(populated);
};