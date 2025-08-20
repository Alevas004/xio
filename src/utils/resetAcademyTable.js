const sequelize = require("./connection");
const Academy = require("../models/Academy");

async function resetAcademyTable() {
  try {
    console.log("🔄 Conectando a la base de datos...");
    await sequelize.authenticate();
    console.log("✅ Conectado a la BD");

    // Guardar datos existentes (opcional)
    console.log("💾 Guardando datos existentes...");
    let existingData = [];
    try {
      existingData = await Academy.findAll();
      console.log(`📊 Encontrados ${existingData.length} registros para respaldar`);
    } catch (error) {
      console.log("⚠️ No se pudieron obtener datos existentes (tabla puede no existir)");
    }

    // Borrar y recrear solo la tabla Academy
    console.log("🗑️ Eliminando tabla Academy...");
    await Academy.drop({ cascade: true });
    
    console.log("🏗️ Recreando tabla Academy con nueva estructura...");
    await Academy.sync({ force: true });
    
    console.log("✅ Tabla Academy recreada exitosamente");

    // Opcionalmente restaurar datos (con nuevos campos)
    if (existingData.length > 0) {
      console.log("🔄 Restaurando datos existentes...");
      
      for (const record of existingData) {
        try {
          const newRecord = {
            id: record.id,
            title: record.title,
            subtitle: record.subtitle,
            type: record.type,
            description_short: record.description_short,
            description_long: record.description_long,
            image: record.image,
            images: record.images,
            location: record.location,
            start_date: record.start_date,
            end_date: record.end_date,
            start_time: record.start_time,
            end_time: record.end_time,
            duration: record.duration,
            price: record.price,
            capacity: record.capacity,
            enrolled: 0, // Nuevo campo con valor por defecto
            includes: Array.isArray(record.includes) ? record.includes : [],
            requirements: Array.isArray(record.requirements) ? record.requirements : [],
            certificate: record.certificate,
            materials_included: record.materials_included,
            materials_description: record.materials_description,
            speaker: record.speaker,
            speakers: record.speakers,
            level: record.level,
            slug: record.slug,
            is_active: record.is_active
          };
          
          await Academy.create(newRecord);
          console.log(`✅ Restaurado: ${record.title}`);
        } catch (error) {
          console.log(`❌ Error restaurando ${record.title}:`, error.message);
        }
      }
    }

    console.log("🎯 Tabla Academy actualizada correctamente");
    
  } catch (error) {
    console.error("❌ Error reseteando tabla Academy:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

resetAcademyTable()
  .then(() => {
    console.log("✅ Proceso completado exitosamente");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error en el proceso:", err);
    process.exit(1);
  });
