const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");
const slugify = require("slugify");

const Course = sequelize.define("course", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.STRING, allowNull: true },
  description_short: { type: DataTypes.TEXT, allowNull: true },
  description_long: { type: DataTypes.TEXT, allowNull: true },

  url: { type: DataTypes.STRING, allowNull: true },
  images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },

  category: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true }, // Ej: 'masaje', 'espiritualidad', etc.
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },

  price: { type: DataTypes.INTEGER, allowNull: false },
  is_free: { type: DataTypes.BOOLEAN, defaultValue: false },

  level: {
    type: DataTypes.STRING, //.ENUM("beginner", "intermediate", "advanced")
    defaultValue: "beginner",
  },

  duration: { type: DataTypes.INTEGER, allowNull: true }, // en horas
  certificate: { type: DataTypes.BOOLEAN, defaultValue: true },
  instructor: { type: DataTypes.STRING, allowNull: true },
  includes: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },

  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  slug: { type: DataTypes.STRING, unique: true },
});

Course.beforeCreate((course) => {
  if (!course.slug) {
    course.slug = slugify(course.title, { lower: true, strict: true });
  }
});
Course.beforeUpdate((course) => {
  if (!course.slug || course.slug.trim() === "") {
    course.slug = slugify(course.title, { lower: true, strict: true });
  }
});

Course.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};
module.exports = Course;
