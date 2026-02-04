import express from "express";
import upload from "../middleware/upload.js";
import auth from "../middleware/auth.js";
import Recipe from "../models/Recipe.js";
import { toggleFavorite } from "../controllers/recipeController.js";

import {
  getAllRecipes,
  rateRecipe,
  commentRecipe,
  likeRecipe,
  getRecipeById,
  deleteComment,
  deleteRecipe,
  updateRecipe,
} from "../controllers/recipeController.js";

const router = express.Router();

/* CREATE */
router.post("/", auth, upload.single("media"), async (req, res) => {
  try {
    const { title, description, ingredients, steps } = req.body;

    const recipe = await Recipe.create({
      title,
      description,
      ingredients: ingredients.split(",").map((i) => i.trim()),
      steps: steps.split(",").map((s) => s.trim()),
      mediaUrl: req.file?.path,
      mediaType: req.file
        ? req.file.mimetype.startsWith("video")
          ? "video"
          : "image"
        : undefined,
      mediaPublicId: req.file?.filename,
      user: req.user._id, // ✅ FIXED
    });

    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* OTHER ROUTES */
router.get("/", getAllRecipes);

router.post("/byIds", async (req, res) => {
  try {
    const { ids } = req.body;

    const recipes = await Recipe.find({
      _id: { $in: ids }
    }).populate("user");

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to load favorites" });
  }
});


router.get("/:id", getRecipeById);
router.put("/:id/rate", auth, rateRecipe);
router.post("/:id/comment", auth, commentRecipe);
router.put("/:id/like", auth, likeRecipe);
router.delete("/:id/comment/:commentId", auth, deleteComment);
router.put("/:id/favorite", auth, toggleFavorite);
router.delete("/:id", auth, deleteRecipe);
router.put("/:id", auth, upload.single("media"), updateRecipe);

export default router;
