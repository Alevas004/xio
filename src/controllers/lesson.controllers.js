const catchError = require("../utils/catchError");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

const getAll = catchError(async (req, res) => {

  const { search, courseId  } = req.query;
  const where = {};
  if (search) where.title = { [Op.iLike]: `%${search}%` };
  if (courseId) where.courseId = courseId;

  const results = await Lesson.findAll({ where, include: [Course] });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const result = await Lesson.create(req.body);
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { slug } = req.params;
  const result = await Lesson.findOne({ where: { slug }, include: [Course] });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Lesson.findByPk(id);
  if (!result) return res.json({ message: "Lesson not found" });
  await Lesson.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Lesson.update(req.body, {
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
