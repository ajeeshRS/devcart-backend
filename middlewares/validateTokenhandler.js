const asyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");

// using express async handler to catch error and pass it to the error handler
const validateToken = asyncHandler(async (req, res, next) => {
  let token;

  // extract the bearer token from the authorization header
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (!authHeader) {
    console.log("there is no header available please send with header!");
  }

  if (authHeader && authHeader.startsWith("Bearer")) {
    // split the jwt token without the the Bearer
    token = authHeader.split(" ")[1];
    if (!token) { 
      res.status(401).json("user is not authorised or token is missing")
      throw new Error("user is not authorized or token is missing");
    }
    // verify the the token with the secret_key
    jwt.verify(token, process.env.ACCESS_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json("user is not authorised");
        throw new Error("user is not authorised");
      }
      // return the user  from the decoded to the req.user
      req.user = decoded.user;
      next()
    });
  } else {
    console.log("some error occured !");
    res.status(500)
  }
});

module.exports = validateToken;
