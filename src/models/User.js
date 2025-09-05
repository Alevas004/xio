const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  vat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING, // 'male', 'female', 'other'
    allowNull: false,
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING, // 'admin', 'user'.
    allowNull: true,
    defaultValue: "user",
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  //* INFO EXTRA PARA ADMIN QUE CREA SERVICIOS
  isProfessional: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  years_experience: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  certifications: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  specialties: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  clients_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};
module.exports = User;
