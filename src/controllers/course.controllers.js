const catchError = require("../utils/catchError");
const Course = require("../models/Course");
const Academy = require("../models/Academy");
const { Op } = require("sequelize");
const Lesson = require("../models/Lesson");
const User = require("../models/User");

const getAll = catchError(async (req, res) => {
  const { search, category } = req.query;
  const where = {};
  if (search) where.title = { [Op.iLike]: `%${search}%` };
  if (category) where.category = category;

  const results = await Course.findAll({
    where,
    include: [Academy, Lesson, { model: User, as: "instructorUser" }],
  });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const userId = req.user.id;
  const result = await Course.create({ ...req.body, instructorId: userId });
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { slug } = req.params;
  const result = await Course.findOne({
    where: { slug },
    include: [Academy, Lesson, { model: User, as: "instructorUser" }],
  });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findByPk(id);
  if (!course) return res.sendStatus(404);
  await Course.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Course.update(req.body, {
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
};
