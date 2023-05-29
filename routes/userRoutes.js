import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getProfile,
  getAllUsers,
  request,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

//User Routes
router.route("/register").post(createUser);
router.route("/loginuser").post(loginUser);
router.route("/logoutuser").get(logoutUser);
router.route("/getuserprofile").get(isAuthenticated, getProfile);
router.route("/getallusers").get(getAllUsers);
router.route("/request").post(request);

export default router;
