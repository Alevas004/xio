const { getAll, create, getOne, remove, update, getMyOrders } = require('../controllers/orderxs.controllers');
const express = require('express');
const protect = require('../middleware/authMiddleware');
const {isAdmin} = require('../middleware/roleProtection');

const orderxsRouter = express.Router();

orderxsRouter.route('/ordersxs')
    .get(protect, isAdmin, getAll)
orderxsRouter.route('/ordersxs/create').post(protect, create);
orderxsRouter.route('/ordersxs/my-orders').get(protect, getMyOrders);
orderxsRouter.route('/ordersxs/:id')
    .get(protect, getOne)
    .delete(protect, remove)
    .put(protect,update);

module.exports = orderxsRouter;
