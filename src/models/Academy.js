const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Academy = sequelize.define("academy", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  // General
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.STRING, allowNull: true },
  type: {
    type: DataTypes.STRING, //.ENUM("seminar", "workshop", "retreat", "corporate")
    allowNull: false,
  }, 

  // Descripción
  description_short: { type: DataTypes.TEXT, allowNull: true },
  description_long: { type: DataTypes.TEXT, allowNull: true },

  // Medios
  image: { type: DataTypes.STRING, allowNull: true },
  images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },

  // Ubicación y tiempo
  location: { type: DataTypes.STRING, allowNull: false },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY, allowNull: true },
  start_time: { type: DataTypes.TIME, allowNull: false },
  end_time: { type: DataTypes.TIME, allowNull: true },
  duration: { type: DataTypes.INTEGER, allowNull: false }, // en horas o días

  // Capacidad y precio
  price: { type: DataTypes.FLOAT, allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false },

  // Extras
  includes: { type: DataTypes.TEXT, allowNull: true }, // comida, materiales, etc.
  requirements: { type: DataTypes.TEXT, allowNull: true },
  certificate: { type: DataTypes.BOOLEAN, defaultValue: true },

  materials_included: { type: DataTypes.BOOLEAN, defaultValue: false },
  materials_description: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },

  speaker: { type: DataTypes.STRING, allowNull: true },
  speakers: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },

  // Estado
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Academy;
