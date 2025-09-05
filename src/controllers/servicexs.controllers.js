const catchError = require("../utils/catchError");
const ServiceXS = require("../models/ServiceXS");
const User = require("../models/User");
const { Op } = require("sequelize");

const getAll = catchError(async (req, res) => {
  const { category, search } = req.query;
  let where = {};
  if (category) {
    where.category = category;
  }
  if (search) {
    where.title = { [Op.iLike]: `%${search}%` };
  }
  const results = await ServiceXS.findAll({ where, include: [User] });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  //! AGREGAR LOGICA PARA QUE EL QUE CREA TENGA EL USERID DEL SERVICIO
  const userId = req.user.id; // Suponiendo que el ID del usuario está en req.user
  const result = await ServiceXS.create({ ...req.body, userId });
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { slug } = req.params;
  const result = await ServiceXS.findOne({
    where: { slug },
    include: [User],
  });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const service = await ServiceXS.findByPk(id);
  if (!service) return res.sendStatus(404);
  await ServiceXS.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await ServiceXS.update(req.body, {
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
