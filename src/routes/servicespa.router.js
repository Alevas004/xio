const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/servicespa.controllers");
const express = require("express");
const {isAdmin} = require("../middleware/roleProtection");
const protect = require("../middleware/authMiddleware");

const serviceSpaRouter = express.Router();

serviceSpaRouter.route("/services").get(getAll);

serviceSpaRouter.route("/services/create").post(protect, isAdmin, create);

serviceSpaRouter.route("/services/:id").get(getOne).delete(protect, isAdmin, remove).put(protect, isAdmin,update);

module.exports = serviceSpaRouter;
