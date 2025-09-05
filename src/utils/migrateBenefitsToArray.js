const sequelize = require("./connection");

async function migrateBenefitsToArray() {
  try {
    console.log("🔧 Migrando campo 'benefits' de TEXT a ARRAY en ServiceXS...");

    // 1. Verificar el tipo actual de la columna benefits
    const [results] = await sequelize.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'servicexs' AND column_name = 'benefits';
    `);

    if (results.length > 0) {
      console.log(`📋 Tipo actual de benefits: ${results[0].data_type}`);

      if (results[0].data_type === "ARRAY") {
        console.log("✅ La columna 'benefits' ya es un ARRAY");
        return;
      }
    }

    // 2. Obtener todos los registros antes de la migración
    const services = await sequelize.query(
      `
      SELECT id, benefits FROM servicexs WHERE benefits IS NOT NULL;
    `,
      { type: sequelize.QueryTypes.SELECT }
    );

    console.log(`📊 Encontrados ${services.length} servicios con benefits`);

    // 3. Crear una columna temporal para el array
    await sequelize.query(`
      ALTER TABLE servicexs 
      ADD COLUMN benefits_temp TEXT[];
    `);
    console.log("✅ Columna temporal 'benefits_temp' creada");

    // 4. Migrar los datos: convertir TEXT a ARRAY
    for (const service of services) {
      let benefitsArray = [];

      if (service.benefits) {
        const text = service.benefits.toString();

        // Dividir por saltos de línea primero
        let items = text.split(/\n|\r\n/).filter((item) => item.trim());

        // Si no hay saltos de línea, dividir por puntos
        if (items.length <= 1) {
          items = text.split(".").filter((item) => item.trim());
        }

        // Si aún no hay división, dividir por comas
        if (items.length <= 1) {
          items = text.split(",").filter((item) => item.trim());
        }

        // Si aún es un solo item, mantenerlo como array de un elemento
        if (items.length <= 1) {
          items = [text.trim()];
        }

        benefitsArray = items
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }

      // Actualizar la columna temporal con el array
      await sequelize.query(
        `
        UPDATE servicexs 
        SET benefits_temp = ARRAY[:benefits] 
        WHERE id = :id;
      `,
        {
          replacements: {
            benefits: benefitsArray,
            id: service.id,
          },
        }
      );

      console.log(
        `✅ Migrado: ${benefitsArray.length} benefits para servicio ${service.id}`
      );
    }

    // 5. Eliminar la columna original
    await sequelize.query(`ALTER TABLE servicexs DROP COLUMN benefits;`);
    console.log("✅ Columna original 'benefits' eliminada");

    // 6. Renombrar la columna temporal
    await sequelize.query(`
      ALTER TABLE servicexs 
      RENAME COLUMN benefits_temp TO benefits;
    `);
    console.log("✅ Columna renombrada a 'benefits'");

    // 7. Agregar constraint NOT NULL
    await sequelize.query(`
      ALTER TABLE servicexs 
      ALTER COLUMN benefits SET NOT NULL;
    `);
    console.log("✅ Constraint NOT NULL aplicado");

    console.log("🎉 Migración de benefits completada exitosamente");
  } catch (error) {
    console.error("❌ Error en migración:", error.message);

    // Intentar limpiar en caso de error
    try {
      await sequelize.query(
        `ALTER TABLE servicexs DROP COLUMN IF EXISTS benefits_temp;`
      );
      console.log("🧹 Columna temporal limpiada");
    } catch (cleanupError) {
      console.log("⚠️ No se pudo limpiar la columna temporal");
    }

    throw error;
  } finally {
    await sequelize.close();
  }
}

migrateBenefitsToArray()
  .then(() => {
    console.log("🎉 Proceso completado exitosamente");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error en el proceso:", err);
    process.exit(1);
  });
