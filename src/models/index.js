const User = require("./User");
const ServiceXS = require("./ServiceXS");
const OrderXS = require("./OrderXS");
const OrderBX = require("./OrderBX");
const Product = require("./Product");
const Academy = require("./Academy");
const Course = require("./Course");
const OrderAcademy = require("./OrderAcademy");

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

//* Academy

Academy.hasMany(OrderAcademy, { foreignKey: "academyId" });
OrderAcademy.belongsTo(Academy, { foreignKey: "academyId" });
// Course ↔ OrderAcademy
Course.hasMany(OrderAcademy, { foreignKey: "courseId" });
OrderAcademy.belongsTo(Course, { foreignKey: "courseId" });

User.hasMany(OrderAcademy, { foreignKey: "userId" });
OrderAcademy.belongsTo(User, { foreignKey: "userId" });

Academy.hasMany(Course, { foreignKey: "academyId" });
Course.belongsTo(Academy, { foreignKey: "academyId" });

//* User ↔ Course (acceso directo a cursos, ya sea por compra individual o porque venían dentro de un Academy)
User.belongsToMany(Course, { through: "UserCourse", foreignKey: "userId" });
Course.belongsToMany(User, { through: "UserCourse", foreignKey: "courseId" });
