import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // PROFILE PIC
    if (file.fieldname === "profilePic") {
      return {
        folder: "recipe-sharing/profiles",
        resource_type: "image",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{ width: 400, height: 400, crop: "fill" }],
      };
    }

    // RECIPE IMAGE / VIDEO
    if (file.fieldname === "media") {
      const isVideo = file.mimetype.startsWith("video");

      return {
        folder: "recipe-sharing/recipes",
        resource_type: isVideo ? "video" : "image",
        allowed_formats: isVideo
          ? ["mp4", "mov", "webm"]
          : ["jpg", "png", "jpeg", "webp"],
      };
    }
  },
});

const upload = multer({ storage });

export default upload;
