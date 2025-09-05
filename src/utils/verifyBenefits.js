const sequelize = require("./connection");

async function verifyBenefits() {
  try {
    const [results] = await sequelize.query(`
      SELECT id, title, benefits 
      FROM servicexs 
      LIMIT 2;
    `);

    console.log("📋 Verificación de benefits como ARRAY:");
    results.forEach((service) => {
      console.log(`- ${service.title}:`);
      console.log(`  Benefits: ${JSON.stringify(service.benefits)}`);
      console.log(
        `  Tipo: ${
          Array.isArray(service.benefits) ? "ARRAY" : typeof service.benefits
        }`
      );
      console.log();
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

verifyBenefits();
