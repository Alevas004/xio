const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");
const slugify = require("slugify");

const Lesson = sequelize.define("lesson", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  video_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration: {
    type: DataTypes.DECIMAL(),
    allowNull: false,
  },
  resources: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  attached: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  is_preview: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  // courseId
});

Lesson.beforeCreate((lesson) => {
  if (!lesson.slug) {
    lesson.slug = slugify(lesson.title, { lower: true, strict: true });
  }
});
Lesson.beforeUpdate((lesson) => {
  if (!lesson.slug || lesson.slug.trim() === "") {
    lesson.slug = slugify(lesson.title, { lower: true, strict: true });
  }
});

module.exports = Lesson;
