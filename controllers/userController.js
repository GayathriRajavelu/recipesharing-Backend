import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

/**
 * GET USER PROFILE
 */
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no user" });
    }

    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


/**
 * TOGGLE FAVORITE RECIPE
 */
export const toggleFavorite = async (req, res) => {
  try {
    console.log("🔥 TOGGLE FAVORITE HIT 🔥");

    const userId = req.user._id;        // ✅ FIX
    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favorites.findIndex(
      (id) => id.toString() === recipeId
    );

    if (index === -1) user.favorites.push(recipeId);
    else user.favorites.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      favorited: index === -1,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("❌ TOGGLE FAVORITE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET CURRENT USER DASHBOARD
 */
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const myRecipes = await Recipe.find({ user: userId })
      .sort({ createdAt: -1 });

    const totalLikes = myRecipes.reduce(
      (sum, r) => sum + (r.likes?.length || 0),
      0
    );

    const user = await User.findById(userId);

    const totalFavorites = user.favorites.length;

    res.json({
      user,
      recipes: myRecipes,
      totalLikes,
      totalFavorites
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * FOLLOW / UNFOLLOW USER
 */
export const toggleFollow = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id); // ✅ FIX

    if (!targetUser || !currentUser)
      return res.status(404).json({ message: "User not found" });

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === targetUser._id.toString()
    );

    if (isFollowing) {
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      following: currentUser.following,
      followers: targetUser.followers,
    });
  } catch (error) {
    console.error("FOLLOW ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET CURRENT LOGGED-IN USER
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("favorites");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("GET ME ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE PROFILE (BIO + PROFILE PIC)
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // ✅ FIX
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.bio !== undefined) user.bio = req.body.bio;

    if (req.file) user.profilePic = req.file.path;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};


