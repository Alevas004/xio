const isAdmin = (req, res, next) => {
  const user = req.user;

  if (user.role != "godness")
    return res.status(401).json({ message: "Unauthorized" });

  next();
};

const isStudent = (req, res, next) => {
  const user = req.user;

  if (user.role != "student" && user.role != "godness")
    return res.status(401).json({ message: "Unauthorized" });

  next();
};

module.exports = { isAdmin, isStudent };
