const sequelize = require("./connection");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

async function syncCourseLessonRelation() {
  try {
    console.log("🔧 Sincronizando relación Course-Lesson...");

    // 1. Verificar si la columna courseId ya existe
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'lessons' AND column_name = 'courseId';
    `);

    if (results.length > 0) {
      console.log("✅ La columna 'courseId' ya existe en Lesson");
      return;
    }

    // 2. Agregar la columna courseId a la tabla lessons
    await sequelize.query(`
      ALTER TABLE lessons 
      ADD COLUMN "courseId" UUID NOT NULL 
      REFERENCES courses(id) ON DELETE CASCADE;
    `);

    console.log("✅ Columna 'courseId' agregada a la tabla lessons");
    console.log(
      "✅ Foreign key constraint creada: lessons.courseId -> courses.id"
    );

    // 3. Verificar que se agregó correctamente
    const [verification] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'lessons' AND column_name = 'courseId';
    `);

    if (verification.length > 0) {
      console.log("🔍 Verificación exitosa:", verification[0]);
    }

    // 4. Verificar las foreign keys
    const [fkCheck] = await sequelize.query(`
      SELECT 
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'lessons' 
        AND kcu.column_name = 'courseId';
    `);

    if (fkCheck.length > 0) {
      console.log("🔗 Foreign key verificada:", fkCheck[0]);
    }

    console.log("🎉 Relación Course-Lesson sincronizada exitosamente");
  } catch (error) {
    console.error("❌ Error sincronizando relación:", error.message);

    if (error.message.includes("already exists")) {
      console.log("✅ La columna ya existía, sincronización completada");
    } else {
      throw error;
    }
  } finally {
    await sequelize.close();
  }
}

syncCourseLessonRelation()
  .then(() => {
    console.log("🎉 Proceso completado exitosamente");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error en el proceso:", err);
    process.exit(1);
  });
