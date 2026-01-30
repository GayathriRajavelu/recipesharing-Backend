import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  getProfile,
  getDashboard,
  updateProfile,
  toggleFollow,
  toggleFavorite,
  getMe,
} from "../controllers/userController.js";

const router = express.Router();


router.get("/dashboard", auth, getDashboard);
router.get("/me", auth, getMe);

router.put(
  "/update-profile",
  auth,
  upload.single("profilePic"), // 🔥 REQUIRED
  updateProfile
);

router.put("/:userId/follow", auth, toggleFollow);
router.post("/favorite/:recipeId", auth, toggleFavorite);
router.get("/:id", getProfile);
export default router;
