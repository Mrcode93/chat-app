// middleware/middleWare.js
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { TOKEN_KEY } = process.env;

// Authentication middleware
const authurizer = (req, res, next) => {
  try {
    if (req.headers.cookie) {
      const token = req.headers.cookie.split("=")[1];

      //! verify token
      const decode = jwt.verify(token, TOKEN_KEY);
      //! Attach the token to the request
      req.user = decode;
      return next(); // Terminate the middleware after successful token verification
    }
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authurizer;
