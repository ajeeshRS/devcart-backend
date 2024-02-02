const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  login,
  addProduct,
  adminHome,
  updateProduct,
  deleteProduct,
  allProducts,
  authAdmin,
  couponDiscount,
  addCoupon,
  getOrders,
} = require("../controllers/adminController");
const adminTokenValidator = require("../middlewares/adminTokenValidator");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // save uploaded files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Controller functions for handling single file upload
const uploadSingle = upload.single("image");

// login route
router.post("/login", login);

// admin home

router.get("/admin-panel", adminTokenValidator, adminHome);

// add product route
router.post(
  "/add-product",
  adminTokenValidator,
  (req, res, next) => {
    // to check whether the middleware is invoked or not
    // console.log("middleware is invoked");
    uploadSingle(req, res, (err) => {
      if (err) {
        // Handle the error
        res.status(500);
        throw new Error("file upload failed");
      }
      // Continue to the next middleware
      next();
    });
  },
  addProduct
);

// get all products
router.get("/all-products", adminTokenValidator, allProducts);

// update product route
router.patch(
  "/edit-product/:id",
  adminTokenValidator,
  (req, res, next) => {
    // to check whether the middleware is invoked or not
    // console.log("middleware is invoked");
    uploadSingle(req, res, (err) => {
      if (err) {
        // Handle the error
        res.status(500);
        throw new Error("file upload failed");
      }
      // Continue to the next middleware
      next();
    });
  },
  updateProduct
);

// get admin
router.get("/auth-admin", adminTokenValidator, authAdmin);

// delete product
router.delete("/delete-product/:productId", adminTokenValidator, deleteProduct);

router.get("/coupon-discount", couponDiscount);

router.post("/add-coupon", adminTokenValidator, addCoupon);

router.get("/get/orders", adminTokenValidator, getOrders);
module.exports = router;
