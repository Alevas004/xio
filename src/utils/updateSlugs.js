const slugify = require("slugify");
const Product = require("../models/Product");
const sequelize = require("./connection");
const Course = require("../models/Course");
const Academy = require("../models/Academy");

async function updateSlugs() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la BD");

    const events = await Academy.findAll();
    console.log(`📊 Encontrados ${events.length} eventos`);

    let updated = 0;

    for (const event of events) {
      console.log(
        `🔍 Procesando: ${event.title}, slug actual: "${event.slug}"`
      );

      if (!event.slug || event.slug.trim() === "") {
        const newSlug = slugify(event.title, { lower: true, strict: true });
        event.slug = newSlug;
        await event.save();
        updated++;
        console.log(`✅ Actualizado: ${event.title} -> ${newSlug}`);
      } else {
        console.log(`⏭️ Ya tiene slug: ${event.slug}`);
      }
    }

    console.log(`🎯 Actualizados ${updated} de ${events.length} eventos`);
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
