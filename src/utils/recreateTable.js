const sequelize = require("./connection");
const Lesson = require("../models/Lesson");

async function recreateLessonTable() {
  try {
    console.log("🔧 Recreating Lesson table...");

    // 1. Eliminar la tabla
    await sequelize.query('DROP TABLE IF EXISTS "orderacademies" CASCADE;');
    console.log("✅ Old table dropped");

    // 2. Recrear usando sync
    await Lesson.sync();
    console.log("✅ Lesson table recreated");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sequelize.close();
  }
}

recreateLessonTable()
  .then(() => {
    console.log("✅ Proceso completado exitosamente");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error en el proceso:", err);
    process.exit(1);
  });
