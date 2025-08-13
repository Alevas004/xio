const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/product.controllers");
const express = require("express");
const protect = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleProtection");

const productRouter = express.Router();

productRouter.route("/products").get(getAll);
productRouter.route("/products/create").post(protect, isAdmin, create);

productRouter.route("/products/:slug").get(getOne);

productRouter
  .route("/products/:id")
  .delete(protect, isAdmin, remove)
  .put(protect, isAdmin, update);

module.exports = productRouter;
