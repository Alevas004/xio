const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const OrderBX = sequelize.define("orderbx", {
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
    type: DataTypes.STRING, // ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: "pending",
  },
  paymentMethod: {
    type: DataTypes.STRING, // ENUM('paypal', 'googlepay', 'applepay'),
    allowNull: false,
  },
  purchasedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  otherCity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  differentAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  differentAddress2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true, // observaciones que deja el usuario
  },
  clientName: {
    type: DataTypes.STRING,
    allowNull: true, // Si el cliente es otro
  },
  clientPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clientVAT: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // userId
  // productId
});
OrderBX.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
}
module.exports = OrderBX;
