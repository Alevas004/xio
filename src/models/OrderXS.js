const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const OrderXS = sequelize.define("orderxs", {
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
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  appointmentTime: {
    type: DataTypes.STRING, // o TIME si querés más precisión
    allowNull: false,
  },
  appointmentLocation: {
    type: DataTypes.STRING,
    allowNull: false,
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
  alternateAddress: {
    type: DataTypes.STRING,
    allowNull: true, // Solo si difiere de user.address
  },

  // userId
  // serviceId
});
OrderXS.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
}
module.exports = OrderXS;
