const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/course.controllers");
const express = require("express");
const protect = require("../middleware/authMiddleware");
const { isStudent, isAdmin } = require("../middleware/roleProtection");

const courseRouter = express.Router();

courseRouter.route("/courses").get(getAll);
courseRouter.route("/courses/:slug").get(getOne);

courseRouter.route("/courses/create").post(protect, isAdmin, create);
courseRouter
  .route("/courses/:id")
  .delete(protect, isAdmin, remove)
  .put(protect, isAdmin, update);

module.exports = courseRouter;
