const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/lesson.controllers");
const express = require("express");
const protect = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleProtection");

const lessonRouter = express.Router();

lessonRouter.route("/course/lessons").get(getAll);

lessonRouter.route("/course/lessons/create").post(create);

lessonRouter.route("/course/lessons/:slug").get(getOne);

lessonRouter
  .route("/course/lessons/:id")
  .delete(protect, isAdmin, remove)
  .put(protect, isAdmin, update);

module.exports = lessonRouter;
