const slugify = require("slugify");
const Product = require("../models/Product");
const sequelize = require("./connection");
const Course = require("../models/Course");

async function updateSlugs() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la BD");

    const courses = await Course.findAll();
    console.log(`📊 Encontrados ${courses.length} cursos`);

    let updated = 0;

    for (const course of courses) {
      console.log(
        `🔍 Procesando: ${course.title}, slug actual: "${course.slug}"`
      );

      if (!course.slug || course.slug.trim() === "") {
        const newSlug = slugify(course.title, { lower: true, strict: true });
        course.slug = newSlug;
        await course.save();
        updated++;
        console.log(`✅ Actualizado: ${course.title} -> ${newSlug}`);
      } else {
        console.log(`⏭️ Ya tiene slug: ${course.slug}`);
      }
    }

    console.log(`🎯 Actualizados ${updated} de ${courses.length} cursos`);
    await sequelize.close();
  } catch (error) {
    console.error("❌ Error detallado:", error);
    throw error;
  }
}

updateSlugs()
  .then(() => process.exit())
  .catch((err) => {
    console.error("❌ Error actualizando slugs:", err);
    process.exit(1);
  });
