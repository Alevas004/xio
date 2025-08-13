const catchError = require('../utils/catchError');
const OrderXS = require('../models/OrderXS');
const User = require('../models/User');
const ServiceXS = require('../models/ServiceXS');

const getAll = catchError(async(req, res) => {
    const results = await OrderXS.findAll({include: [User, ServiceXS]});
    return res.json(results);
});

const getMyOrders = catchError(async(req, res) => {
    const id = req.user.id;
    const results = await OrderXS.findAll({
        where: { userId: id },
        include: [User, ServiceXS]
    });
    if (!results || results.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
    }
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const result = await OrderXS.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await OrderXS.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await OrderXS.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await OrderXS.update(
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