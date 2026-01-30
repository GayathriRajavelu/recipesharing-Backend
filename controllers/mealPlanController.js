import MealPlan from "../models/MealPlan.js";

/**
 * CREATE MEAL PLAN
 */
export const createMealPlan = async (req, res) => {
  try {
    const { weekStart, meals } = req.body;

    if (!weekStart) {
      return res.status(400).json({ message: "Week start date is required" });
    }

    const plan = await MealPlan.create({
      user: req.user._id,
      weekStart: new Date(weekStart + "T00:00:00.000Z"),
      meals: meals || {
        monday: [], tuesday: [], wednesday: [],
        thursday: [], friday: [], saturday: [], sunday: []
      }
    });

    res.status(201).json(plan);
  } catch (err) {
    console.error("CREATE PLAN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * GET MY MEAL PLANS
 */
export const getMyMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET MEAL PLAN BY ID
 */
export const getMealPlanById = async (req, res) => {
  try {
    const plan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate(
      "meals.monday meals.tuesday meals.wednesday meals.thursday meals.friday meals.saturday meals.sunday"
    );

    if (!plan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
