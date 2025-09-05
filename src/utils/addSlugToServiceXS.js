const sequelize = require("./connection");
const ServiceXS = require("../models/ServiceXS");
const slugify = require("slugify");

async function addSlugAndUpdate() {
  try {
    console.log("🔧 Agregando columna slug a ServiceXS...");

    // 1. Verificar si la columna ya existe
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'servicexs' AND column_name = 'slug';
    `);

    if (results.length === 0) {
      // 2. Agregar la columna slug
      await sequelize.query(`
        ALTER TABLE servicexs 
        ADD COLUMN slug VARCHAR(255) UNIQUE;
      `);
      console.log("✅ Columna 'slug' agregada a ServiceXS");
    } else {
      console.log("✅ La columna 'slug' ya existe");
    }

    // 3. Ahora actualizar los slugs
    console.log("🔧 Actualizando slugs...");

    const services = await ServiceXS.findAll();
    console.log(`📊 Encontrados ${services.length} servicios`);

    let updated = 0;

    for (const service of services) {
      console.log(
        `🔍 Procesando: ${service.title}, slug actual: "${service.slug}"`
      );

      if (!service.slug || service.slug.trim() === "") {
        const newSlug = slugify(service.title, { lower: true, strict: true });

        // Verificar que el slug sea único
        let finalSlug = newSlug;
        let counter = 1;

        while (true) {
          const existing = await ServiceXS.findOne({
            where: { slug: finalSlug },
          });
          if (!existing || existing.id === service.id) {
            break;
          }
          finalSlug = `${newSlug}-${counter}`;
          counter++;
        }

        service.slug = finalSlug;
        await service.save();
        updated++;
        console.log(`✅ Actualizado: ${service.title} -> ${finalSlug}`);
      } else {
        console.log(`⏭️ Ya tiene slug: ${service.slug}`);
      }
    }

    console.log(`🎯 Actualizados ${updated} de ${services.length} servicios`);
  } catch (error) {
    console.error("❌ Error detallado:", error.message);

    if (error.message.includes("already exists")) {
      console.log("⚠️ La columna ya existía, continuando con actualización...");
    } else {
      throw error;
    }
  } finally {
    await sequelize.close();
  }
}

addSlugAndUpdate()
  .then(() => {
    console.log("🎉 Proceso completado exitosamente");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error en el proceso:", err);
    process.exit(1);
  });
