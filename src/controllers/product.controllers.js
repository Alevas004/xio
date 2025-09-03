const catchError = require("../utils/catchError");
const Product = require("../models/Product");
const { Op, Sequelize  } = require("sequelize");

// const getAll = catchError(async (req, res) => {
//   const { category, search, page = 1, limit = 9 } = req.query;

//   const where = {};

//   if (category) {
//     where.category = category;
//   }

//   if (search) {
//     where.name = {
//       [Op.iLike]: `%${search}%`,
//     };
//   }

//   const offset = (page - 1) * limit;

//   const { rows: products, count: totalItems } = await Product.findAndCountAll({
//     where: where,
//     offset: parseInt(offset),
//     limit: parseInt(limit),
//   });

//   const allCategories = await Product.findAll({
//     attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']],
//     raw: true
//   });

//   const availableCategories = allCategories.map(item => item.category).filter(Boolean);

//   const totalPages = Math.ceil(totalItems / limit);

//   return res.json({
//     products,
//     pagination: {
//       totalItems,
//       totalPages,
//       currentPage: parseInt(page)
//     },
//     availableCategories
//   });
// });

const getAll = catchError(async (req, res) => {
  const { category, search, page = 1, limit = 9 } = req.query;

  const where = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.name = {
      [Op.iLike]: `%${search}%`,
    };
  }

  const offset = (page - 1) * limit;

  const { rows: products, count: totalItems } = await Product.findAndCountAll({
    where: where,
    offset: parseInt(offset),
    limit: parseInt(limit),
  });

  // ✨ NUEVA QUERY: Obtener categorías con su count
  let availableCategories = [];

  try {
    const categoriesWithCount = await Product.findAll({
      attributes: [
        "category",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: ["category"],
      where: {
        category: { [Op.ne]: null }, // Excluir categorías null
      },
      raw: true,
      order: [["category", "ASC"]], // Ordenar alfabéticamente
    });

    // Transformar el resultado a un formato más usable
    availableCategories = categoriesWithCount.map((item) => ({
      category: item.category,
      count: parseInt(item.count) || 0,
    }));

    console.log("📊 Categories with count:", availableCategories);
  } catch (categoryError) {
    console.error("❌ Error fetching categories:", categoryError);
    // Si falla, array vacío
    availableCategories = [];
  }

  const totalPages = Math.ceil(totalItems / limit);

  return res.json({
    products,
    pagination: {
      totalItems,
      totalPages,
      currentPage: parseInt(page),
    },
    availableCategories, // Ahora es: [{ category: 'digestivo', count: 1 }, ...]
  });
});

const create = catchError(async (req, res) => {
  const result = await Product.create(req.body);
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { slug } = req.params;
  const result = await Product.findOne({ where: { slug } });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) return res.sendStatus(404);
  await Product.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Product.update(req.body, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
};
