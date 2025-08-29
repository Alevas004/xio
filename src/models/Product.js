const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");
const { default: slugify } = require("slugify");

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  short_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  long_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, // URL de imagen principal
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true, // Array de URLs adicionales
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false, // Ej: 'aceites', 'kits', 'ropa', etc.
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true, // ['relajación', 'natural', 'orgánico']
  },
  caracteristics: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true, // ['Piedras volcánicas de alta calidad', 'Retienen el calor por más tiempo', 'Ideal para terapeutas profesionales']
  },
  includes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true, // ['12 piedras, una caja, algo, algo']
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasDiscount: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  isNew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: true,
  },
  discountValue: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: true,
  },
  isSold: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
});
Product.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

// Hook para generar slug antes de crear
Product.beforeCreate((product) => {
  product.slug = slugify(product.name, { lower: true, strict: true });
});

// Hook para actualizar slug si cambia el nombre
Product.beforeUpdate((product) => {
  if (product.changed("name")) {
    product.slug = slugify(product.name, { lower: true, strict: true });
  }
});
module.exports = Product;
