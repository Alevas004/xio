const {
  getAll,
  create,
  getOne,
  remove,
  update,
  login,
  emailConfirmed,
  getMyProfile,
  getMyCourses,
} = require("../controllers/user.controllers.js");
const express = require("express");
const protect = require("../middleware/authMiddleware.js");
const { isAdmin } = require("../middleware/roleProtection.js");

const userRouter = express.Router();

userRouter.route("/users").get(protect, isAdmin, getAll);
userRouter.route("/users/myprofile").get(protect, getMyProfile);
userRouter.route("/users/mycourses").get(protect, getMyCourses);
userRouter.route("/users/login").post(login);
userRouter.route("/users/register").post(create);
userRouter.route("/users/auth/confirm/:token").get(emailConfirmed);
userRouter
  .route("/users/:id")
  .get(protect, isAdmin, getOne)
  .delete(protect, isAdmin, remove)
  .put(protect, update);

module.exports = userRouter;
