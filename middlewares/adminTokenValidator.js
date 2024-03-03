const asyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");

// using express async handler to catch error and pass it to the error handler
const adminTokenValidator = asyncHandler(async (req, res, next) => {
  let token;

  // extract the bearer token from the authorization header
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (!authHeader) {
    console.log("there is no header available please send with header!");
  }

  // split the jwt token without the the Bearer
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("user is not authorized or token is missing");
    }
    // verify the the token with the secret_key
    jwt.verify(token, process.env.ADMIN_ACCESS_KEY, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("user is not authorised");
      }

      // return the admin  from the decoded to the req.user
      req.user = decoded.admin;
      next();
    });
  } else {
    console.log("some error occured !");
  }
});

module.exports = adminTokenValidator;
