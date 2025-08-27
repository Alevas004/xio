const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/orderacademy.controllers");
const express = require("express");
const protect = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleProtection");

const orderAcademyRouter = express.Router();

orderAcademyRouter.route("/checkout/orders").get(getAll).post(create);

orderAcademyRouter
  .route("/checkout/orders/:id")
  .get(getOne)
  .delete(protect, isAdmin, remove)
  .put(protect, isAdmin, update);

module.exports = orderAcademyRouter;
