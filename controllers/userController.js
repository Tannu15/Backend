import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utiles/ErrorHandler.js";
import { sendToken } from "../utiles/sendtoken.js";

//--------------------------admin apis-------------------------------------------
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//-----------------------------users apis-------------------------------------------------------------
export const createUser = catchAsyncError(async (req, res, next) => {
  const email = req.body.email;
  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("User Already Exit", 401));
  user = await User.create(req.body);

  sendToken(res, user, "User Registered SuccessFully", 201);
});

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please add all fields", 400));
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Incorrect Email and Password", 401));
  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return next(new ErrorHandler("Incorrect Email and Password", 401));

  sendToken(res, user, `Welcome back, ${user.name}`, 201);
});

//Logout User
export const logoutUser = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      Message: "user logout",
    });
});

//getProfile
export const getProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user !== null) {
    res.status(200).json({
      success: true,
      user,
    });
  }
});

//Update password

export const updatePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Old Password", 401));
  }

  user.password = newPassword;
  await user.save();
  sendCookie(user, "Password Changed Successfully", 201, res);
});

//----------update profile---------------

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const {
    firstname,
    lastname,
    designation,
    dob,
    aboutme,
    phonenumber,
    skills,
  } = req.body;
  await User.findByIdAndUpdate(
    id,
    { firstname, lastname, designation, dob, aboutme, phonenumber, skills },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: `Profile Updated!`,
  });
});
