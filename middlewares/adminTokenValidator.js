const asyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");

const adminTokenValidator = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (!authHeader) {
    console.log("there is no header available please send with header!");
  }

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    if (!token) { 
      res.status(401);
      throw new Error("user is not authorized or token is missing");
    }
    jwt.verify(token, process.env.ADMIN_ACCESS_KEY, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("user is not authorised");
      }
      // console.log(decoded);

      req.user = decoded.admin;
      next()
    });
  } else {
    console.log("some error occured !");
  }
  
});

module.exports = adminTokenValidator;
