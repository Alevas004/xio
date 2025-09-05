const catchError = require("../utils/catchError");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const Course = require("../models/Course");
const Academy = require("../models/Academy");
const OrderAcademy = require("../models/OrderAcademy");

const BASE_URL = "http://localhost:8080";

const getAll = catchError(async (req, res) => {
  const results = await User.findAll();
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const {
    id,
    first_name,
    last_name,
    email,
    password,
    phone,
    vat,
    gender,
    profile_picture,
    country,
    city,
    address,
    date_of_birth,
    role,
  } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const createUser = await User.create({
    id,
    first_name,
    last_name,
    email,
    password: hashed,
    phone,
    vat,
    gender,
    profile_picture,
    country,
    city,
    address,
    date_of_birth,
    role,
  });

  const token = jwt.sign({ userId: createUser.id }, process.env.AUTH_SECRET, {
    expiresIn: "5h",
  });

  const confirmationLink = `${BASE_URL}/xio/users/auth/confirm/${token}`;

  await sendEmail({
    to: email,
    subject: "Confirm your email",
    html: `
      <h1>Welcome to XIOS</h1>
      <p>To complete your registration, please confirm your email by clicking the link below:</p>
      <a href="${confirmationLink}">Confirm Email</a>
      <p>If you did not register, please ignore this email.</p>
      <p>Thank you!</p>
    `,
  });

  return res.status(201).json(createUser);
});

const emailConfirmed = catchError(async (req, res) => {
  const { token } = req.params;

  const decoded = jwt.verify(token, process.env.AUTH_SECRET);
  const user = await User.findByPk(decoded.userId);
  if (!user)
    return res
      .status(404)
      .json({ message: "User not found for confirm email" });

  user.email_verified = true;
  await user.save();

  return res.status(200).json({ message: "Email confirmed successfully" });
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "Wrong credentials" });
  if (!user.email_verified)
    return res
      .status(403)
      .json({ message: "Please confirm your account to be able of going in" });

  const passCompared = await bcrypt.compare(password, user.password);
  if (!passCompared)
    return res.status(404).json({ message: "Wrong credentials" });

  const token = jwt.sign({ user }, process.env.AUTH_SECRET, {
    expiresIn: "1d",
  });

  return res.json({ user, token });
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.findByPk(id, {
    include: [
      {
        model: OrderAcademy,
        include: [
          { model: Course }, // si compró un curso
          { model: Academy }, // si compró un academy
        ],
      },
    ],
  });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const getMyProfile = catchError(async (req, res) => {
  const userId = req.user.id;
  const result = await User.findByPk(userId, {
    include: [
      {
        model: OrderAcademy,
        include: [
          { model: Course }, // si compró un curso
          { model: Academy, include: [Course] }, // si compró un academy
        ],
      },
    ],
  });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) return res.sendStatus(404);
  await User.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const {
    first_name,
    last_name,
    vat,
    gender,
    profile_picture,
    country,
    city,
    address,
    date_of_birth,
    isProfessional,
    years_experience,
    bio,
    certifications,
    specialties,
    clients_count,
  } = req.body;

  if (userId !== id) {
    return res
      .status(403)
      .json({ message: "You can only update your own profile" });
  }

  const result = await User.update(
    {
      first_name,
      last_name,
      vat,
      gender,
      profile_picture,
      country,
      city,
      address,
      date_of_birth,
      isProfessional,
      years_experience,
      bio,
      certifications,
      specialties,
      clients_count,
    },
    {
      where: { id: userId },
      returning: true,
    }
  );
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  login,
  emailConfirmed,
  getMyProfile,
};
