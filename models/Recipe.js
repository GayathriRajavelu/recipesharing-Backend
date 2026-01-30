import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [String],
    steps: [String],

    mediaUrl: String,
    mediaType: { type: String, enum: ["image", "video"] },
    mediaPublicId: String,

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, min: 1, max: 5 },
      },
    ],

    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
