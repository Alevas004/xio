const express = require("express");
const userRouter = require("./user.router");
const servicexsRouter = require("./servicexs.router");
const orderxsRouter = require("./orderxs.router");
const productRouter = require("./product.router");
const orderbxRouter = require("./orderbx.router");
const academyRouter = require("./academy.router");
const courseRouter = require("./course.router");
const serviceSpaRouter = require("./servicespa.router");
const router = express.Router();

// colocar las rutas aquí
router.use("/xio", userRouter);
router.use("/xiomarasanchezterapeuta", servicexsRouter);
router.use("/xiomarasanchezterapeuta", orderxsRouter);
router.use("/byxio", productRouter);
router.use("/byxio", orderbxRouter);
router.use("/xios-academy", academyRouter);
router.use("/xios-academy", courseRouter);
router.use("/xiomarasanchez-spa", serviceSpaRouter);


module.exports = router;
