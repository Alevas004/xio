const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/academy.controllers");
const express = require("express");
const { isAdmin } = require("../middleware/roleProtection");
const protect = require("../middleware/authMiddleware");

const academyRouter = express.Router();

academyRouter.route("/events").get(getAll);

academyRouter.route("/events/create").post(protect, isAdmin, create);

academyRouter
  .route("/events/:id")
  .get(getOne)
  .delete(protect, isAdmin, remove)
  .put(protect, isAdmin, update);

module.exports = academyRouter;
