const supabase = require("../config/supabase");

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Missing or malformed authorization token",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token || token.split(/\s+/).length !== 1) {
    return res.status(401).json({
      error: "Missing or malformed authorization token",
    });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        error: "Invalid or expired token",
      });
    }

    req.user = data.user;
    req.accessToken = token;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Unable to authenticate token",
    });
  }
}

module.exports = authenticateToken;
