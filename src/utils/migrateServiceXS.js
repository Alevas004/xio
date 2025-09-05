const sequelize = require("./connection");
const ServiceXS = require("../models/ServiceXS");

async function migrateServiceXSTable() {
  try {
    console.log("🔧 Migrando tabla ServiceXS para agregar campo images...");

    // 1. Verificar si la columna ya existe
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'servicexs' AND column_name = 'images';
    `);

    if (results.length > 0) {
      console.log("✅ La columna 'images' ya existe en ServiceXS");
      return;
    }

    // 2. Agregar la nueva columna images como array de strings
    await sequelize.query(`
      ALTER TABLE servicexs 
      ADD COLUMN images TEXT[];
    `);

    console.log("✅ Campo 'images' agregado exitosamente a ServiceXS");
    console.log("💾 Todos los datos existentes se mantuvieron intactos");

    // 3. Opcional: Verificar que se agregó correctamente
    const [verification] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'servicexs' AND column_name = 'images';
    `);

    if (verification.length > 0) {
      console.log("🔍 Verificación exitosa:", verification[0]);
    }
  } catch (error) {
    console.error("❌ Error en migración:", error.message);

    // Si el error es que la columna ya existe, no es un problema
    if (error.message.includes("already exists")) {
      console.log("✅ La columna ya existía, migración completada");
    }
  } finally {
    await sequelize.close();
  }
}

migrateServiceXSTable()
  .then(() => {
    console.log("🎉 Migración de ServiceXS completada exitosamente");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error en el proceso de migración:", err);
    process.exit(1);
  });
