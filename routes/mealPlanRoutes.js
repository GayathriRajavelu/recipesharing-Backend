import express from "express";
import auth from "../middleware/auth.js";
import {
  createMealPlan,
  getMyMealPlans,
  getMealPlanById
} from "../controllers/mealPlanController.js";
import MealPlan from "../models/MealPlan.js";
import generateShoppingList from "../utils/generateShoppingList.js";

const router = express.Router();

/**
 * CREATE MEAL PLAN
 */
router.post("/", auth, createMealPlan);

/**
 * GET LOGGED-IN USER MEAL PLANS
 */
router.get("/mine", auth, getMyMealPlans);

/**
 * GET SINGLE MEAL PLAN
 */
router.get("/:id", auth, getMealPlanById);

/**
 * SHOPPING LIST
 */
router.get("/:id/shopping-list", auth, async (req, res) => {
  try {
    const plan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate(
      "meals.monday meals.tuesday meals.wednesday meals.thursday meals.friday meals.saturday meals.sunday"
    );

    if (!plan) return res.status(404).json({ message: "Meal plan not found" });

    const shoppingList = generateShoppingList(plan.meals);
    res.json(shoppingList);
  } catch (err) {
    console.error("SHOPPING LIST ERROR:", err);
    res.status(500).json({ message: "Failed to generate shopping list" });
  }
});

/**
 * DELETE MEAL PLAN
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const plan = await MealPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    res.json({ message: "Meal plan deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Failed to delete meal plan" });
  }
});

export default router;
