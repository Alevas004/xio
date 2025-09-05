const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/servicexs.controllers");
const express = require("express");
const protect = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleProtection");

const servicexsRouter = express.Router();

servicexsRouter.route("/servicesxs").get(getAll);
servicexsRouter.route("/servicesxs/create").post(protect, isAdmin, create);
servicexsRouter.route("/servicesxs/:slug").get(getOne); 

servicexsRouter
  .route("/servicesxs/:id")
  .delete(protect, isAdmin, remove)
  .put(protect, isAdmin, update);

module.exports = servicexsRouter;
