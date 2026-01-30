import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    weekStart: { type: Date, required: true },

    meals: {
      monday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
      tuesday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
      wednesday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
      thursday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
      friday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
      saturday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
      sunday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    },
  },
  { timestamps: true }
);

export default mongoose.model("MealPlan", mealPlanSchema);
