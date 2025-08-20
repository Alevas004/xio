const {
  getAll,
  create,
  getOne,
  remove,
  update,
  getEvents,
} = require("../controllers/academy.controllers");
const express = require("express");
const { isAdmin } = require("../middleware/roleProtection");
const protect = require("../middleware/authMiddleware");

const academyRouter = express.Router();

academyRouter.route("/events").get(getAll);
academyRouter.route("/event").get(getEvents);

academyRouter.route("/events/create").post(protect, isAdmin, create);
academyRouter.route("/events/:slug").get(getOne);
academyRouter
  .route("/events/:id")
  .delete(protect, isAdmin, remove)
  .put(protect, isAdmin, update);

module.exports = academyRouter;
