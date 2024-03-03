const express = require("express");
const {
  registerUser,
  loginUser,
  getAllProducts,
  getProduct,
  addToWishlist,
  deleteFromWishlist,
  getAllFavorites,
  getFavoriteProductDetails,
  addToCart,
  getCartProducts,
  deleteFromCart,
  updateQuantity,
  searchProducts,
  addAddress,
  viewAddresses,
  updateAddress,
  deleteAddress,
  getAddress,
  checkCoupon,
  payment,
  verifyPayment,
  addOrder,
  getUserInfo,
  getOrders,
  getOrder,
  deleteOrder,
  updateUserName,
  resetPassword,
} = require("../controllers/userControlleer");

// auth middleware to check token
const validateToken = require("../middlewares/validateTokenhandler");

const router = express.Router();

// user auth routes
router.post("/signup", registerUser);
router.post("/login", loginUser);

// products routes
router.get("/get-products", validateToken, getAllProducts);
router.get("/get-product/:id", validateToken, getProduct);

// wishlist routes
router.post("/wishlist/:productId", validateToken, addToWishlist);
router.delete("/wishlist/delete/:productId", validateToken, deleteFromWishlist);
router.get("/wishlist/all-products", validateToken, getAllFavorites);
router.get("/wishlist", validateToken, getFavoriteProductDetails);

// cart routes
router.post("/cart/:productId", validateToken, addToCart);
router.get("/cart", validateToken, getCartProducts);
router.delete("/cart/delete/:productId", validateToken, deleteFromCart);
router.put("/cart/update/quantity/:productId", validateToken, updateQuantity);

// search route
router.get("/search/:term", validateToken, searchProducts);

// address routes
router.post("/add-address", validateToken, addAddress);
router.get("/view-addresses", validateToken, viewAddresses);
router.put("/update-address/:id", validateToken, updateAddress);
router.delete("/delete-address/:id", validateToken, deleteAddress);
router.get("/address/:id", validateToken, getAddress);

// discount coupon route
router.post("/check-coupon", validateToken, checkCoupon);

// get user route
router.get("/get", validateToken, getUserInfo);

// order routes
router.post("/order/add-order", validateToken, addOrder);
router.get("/get/orders", validateToken, getOrders);
router.get("/get/order/:id", validateToken, getOrder);
router.delete("/delete/order/:id", validateToken, deleteOrder);

// profile routes
router.put("/update-username", validateToken, updateUserName);
router.put("/reset-password", validateToken, resetPassword);

// payment routes
router.post("/checkout/payment", validateToken, payment);
router.post("/checkout/verify-payment", validateToken, verifyPayment);

module.exports = router;
