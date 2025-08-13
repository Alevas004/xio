const catchError = require('../utils/catchError');
const OrderBX = require('../models/OrderBX');
const User = require('../models/User');
const Product = require('../models/Product');

const getAll = catchError(async(req, res) => {
    const results = await OrderBX.findAll({include: [User, Product]});
    return res.json(results);
});

const getMyOrders = catchError(async(req, res) => {
    const id = req.user.id;
    const results = await OrderBX.findAll({
        where: { userId: id },
        include: [User, Product]
    });
    if (!results || results.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
    }
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const result = await OrderBX.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await OrderBX.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const order = await OrderBX.findByPk(id);
    if(!order) return res.sendStatus(404);
    await OrderBX.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await OrderBX.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    getMyOrders
}