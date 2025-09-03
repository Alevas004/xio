const Course = require("../models/Course");
const Academy = require("../models/Academy");
const OrderAcademy = require("../models/OrderAcademy");

const validatePurchase = async (req, res, next) => {
  try {
    const { academyId, courseId } = req.body;
    const userId = req.user.id; // 👈 asumiendo que tienes auth con el usuario en req.user

    let item;
    let itemType;

    if (academyId) {
      item = await Academy.findByPk(academyId);
      itemType = "academy";
    } else if (courseId) {
      item = await Course.findByPk(courseId);
      itemType = "course";
    } else {
      return res.status(400).json({ message: "Debe enviar academyId o courseId" });
    }

    if (!item) return res.status(404).json({ message: `${itemType} no encontrado` });
    if (!item.is_active) return res.status(400).json({ message: `${itemType} inactivo` });

    // 🔍 evitar compra duplicada
    const alreadyBought = await OrderAcademy.findOne({
      where: { userId, [`${itemType}Id`]: item.id },
    });

    if (alreadyBought) {
      return res.status(400).json({ message: `Ya has comprado este ${itemType}` });
    }

    // 🔍 validar capacidad (solo academies tipo workshop/seminar)
    if (itemType === "academy" && item.capacity && item.enrolled >= item.capacity) {
      return res.status(400).json({ message: "Capacidad máxima alcanzada" });
    }

    // ✅ setear datos calculados
    req.body.userId = userId;
    req.body.total = item.price;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error validando compra" });
  }
};

module.exports = validatePurchase;
