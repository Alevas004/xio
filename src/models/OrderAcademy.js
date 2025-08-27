const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const OrderAcademy = sequelize.define("orderacademy", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  paymentStatus: {
    type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
    defaultValue: "pending",
  },

  paymentMethod: {
    type: DataTypes.ENUM("paypal", "googlepay", "applepay", "stripe"),
    allowNull: false,
  },

  purchasedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true, // observaciones opcionales
  },
  // userId
  // academyId
  // courseId
});

module.exports = OrderAcademy;
