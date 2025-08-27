const sequelize = require("./connection");
const OrderAcademy = require("../models/OrderAcademy");

async function recreateOrderAcademyTable() {
  try {
    console.log("🔧 Recreating OrderAcademy table...");

    // 1. Eliminar la tabla
    await sequelize.query('DROP TABLE IF EXISTS "orderacademies" CASCADE;');
    console.log("✅ Old table dropped");

    // 2. Recrear usando sync
    await OrderAcademy.sync();
    console.log("✅ OrderAcademy table recreated");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sequelize.close();
  }
}

recreateOrderAcademyTable()
  .then(() => {
    console.log("✅ Proceso completado exitosamente");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error en el proceso:", err);
    process.exit(1);
  });
