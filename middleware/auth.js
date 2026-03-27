module.exports = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.redirect("/panel/login");
};
