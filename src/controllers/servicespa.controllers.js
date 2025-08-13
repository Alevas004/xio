const catchError = require('../utils/catchError');
const ServiceSPA = require('../models/ServiceSPA');

const getAll = catchError(async(req, res) => {
    const results = await ServiceSPA.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const result = await ServiceSPA.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await ServiceSPA.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const service = await ServiceSPA.findByPk(id);
    if(!service) return res.sendStatus(404);
    await ServiceSPA.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await ServiceSPA.update(
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
    update
}