// Only guards API routes called with fetch: a JSON 401 lets the panel send the
// user back to the login page (a redirect would be followed by fetch instead).
module.exports = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.status(401).json({ error: "Session expirée, reconnectez-vous." });
};
