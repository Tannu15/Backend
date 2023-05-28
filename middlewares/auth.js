import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "../utiles/ErrorHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return next(new ErrorHandler("Not Signed In", 401));
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded._id);
  next();
});

export const isAdmin = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin")
    return next(
      new ErrorHandler("User does't allow to get this resource", 401)
    );
  next();
});
