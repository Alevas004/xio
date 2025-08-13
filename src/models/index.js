const User = require("./User");
const ServiceXS = require("./ServiceXS");
const OrderXS = require("./OrderXS");
const OrderBX = require("./OrderBX");
const Product = require("./Product");

//* xiomarasanchezterapeuta
// Un usuario puede tener muchos servicios
User.hasMany(ServiceXS, { foreignKey: "userId" });
ServiceXS.belongsTo(User, { foreignKey: "userId" });

// Un usuario puede hacer muchas órdenes
User.hasMany(OrderXS, { foreignKey: "userId" });
OrderXS.belongsTo(User, { foreignKey: "userId" });

// Un servicio puede estar relacionado con muchas órdenes
ServiceXS.hasMany(OrderXS, { foreignKey: "serviceId" });
OrderXS.belongsTo(ServiceXS, { foreignKey: "serviceId" });

//* productos by xio

Product.hasMany(OrderBX, { foreignKey: "productId" });
OrderBX.belongsTo(Product, { foreignKey: "productId" });

User.hasMany(OrderBX, { foreignKey: "userId" });
OrderBX.belongsTo(User, { foreignKey: "userId" });
