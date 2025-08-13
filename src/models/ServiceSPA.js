const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const ServiceSPA = sequelize.define("servicespa", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sub_title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description_short: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  detailed_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  for_who: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
  },
  phrase_hook: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING, // 'service', 'product', etc.
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  locations: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  includes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true, // Ej: 'toallas, bebidas, etc.'
  },
});

ServiceSPA.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
}

module.exports = ServiceSPA;
