const catchError = require("../utils/catchError");
const Academy = require("../models/Academy");
const Course = require("../models/Course");
const { Op } = require("sequelize");
const Lesson = require("../models/Lesson");

const getAll = catchError(async (req, res) => {
  const results = await Academy.findAll({ include: {
    model: Course,
    include: [Lesson],
  }});
  return res.json(results);
});

const getEvents = catchError(async (req, res) => {
  const { type, search } = req.query;
  const where = {};
  if (type) where.type = type;
  if (search) where.title = { [Op.iLike]: `%${search}%` };

  const events = await Academy.findAll({ where, include: {
    model: Course,
    include: [Lesson],
  }});

  return res.json(events);
});

const create = catchError(async (req, res) => {
  const result = await Academy.create(req.body);
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { slug } = req.params;
  const result = await Academy.findOne({ where: { slug }, include: [Course] });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await Academy.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Academy.update(req.body, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  getEvents,
};
