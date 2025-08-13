
const {
  getAll,
  create,
  getOne,
  remove,
  update,
  getMyOrders,
} = require("../controllers/orderbx.controllers");
const express = require("express");
const protect = require("../middleware/authMiddleware");
const {isAdmin} = require("../middleware/roleProtection");

const orderbxRouter = express.Router();

orderbxRouter.route("/ordersbx").get(protect, isAdmin, getAll);

orderbxRouter.route("/ordersbx/create").post(protect, create);
orderbxRouter.route("/ordersbx/my-orders").get(protect, getMyOrders);
orderbxRouter.route("/ordersbx/:id").get(protect, getOne).delete(protect, remove).put(protect, update);

module.exports = orderbxRouter;
