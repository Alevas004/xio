const catchError = require("../utils/catchError");
const OrderAcademy = require("../models/OrderAcademy");
const Course = require("../models/Course");
const Academy = require("../models/Academy");

const getAll = catchError(async (req, res) => {
  const results = await OrderAcademy.findAll({include: [Course, Academy]});
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const result = await OrderAcademy.create(req.body);
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await OrderAcademy.findByPk(id, {include: [Course, Academy]});
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await OrderAcademy.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await OrderAcademy.update(req.body, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

// 🚀 Nueva función: compra de academy o course
const purchase = catchError(async (req, res) => {
  const { academyId, courseId, paymentMethod, total } = req.body;

  // Validación explícita del usuario
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      error:
        "Usuario no autenticado. Asegúrate de incluir el token Bearer en el header.",
    });
  }

  const userId = req.user.id;

  if (!academyId && !courseId) {
    return res.status(400).json({ error: "Debe enviar academyId o courseId" });
  }

  // 1. Crear la orden
  const order = await OrderAcademy.create({
    userId,
    academyId: academyId || null,
    courseId: courseId || null,
    paymentMethod,
    total,
    paymentStatus: "pending", // luego se actualiza al confirmar el pago
  });

  // 2. Si es academy -> dar acceso a TODOS sus cursos
  if (academyId) {
    const academy = await Academy.findByPk(academyId, { include: [Course] });
    if (!academy)
      return res.status(404).json({ error: "Academy no encontrado" });
  }

  // 3. Si es course -> dar acceso directo a ese curso
  if (courseId) {
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ error: "Curso no encontrado" });

    // asignar curso directo al user
    await order.setCourse(course);
  }

  return res.status(201).json(order);
});

module.exports = {
  getAll,
  create,
  getOne,
  purchase,
  remove,
  update,
};
