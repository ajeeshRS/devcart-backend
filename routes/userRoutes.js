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
const validateToken = require("../middlewares/validateTokenhandler");
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/get-products", validateToken, getAllProducts);
router.get("/get-product/:id", validateToken, getProduct);
router.post("/wishlist/:productId", validateToken, addToWishlist);
router.delete("/wishlist/delete/:productId", validateToken, deleteFromWishlist);
router.get("/wishlist/all-products", validateToken, getAllFavorites);
router.get("/wishlist", validateToken, getFavoriteProductDetails);
router.post("/cart/:productId", validateToken, addToCart);
router.get("/cart", validateToken, getCartProducts);
router.delete("/cart/delete/:productId", validateToken, deleteFromCart);
router.put("/cart/update/quantity/:productId", validateToken, updateQuantity);
router.get("/search/:term", validateToken, searchProducts);
router.post("/add-address", validateToken, addAddress);
router.get("/view-addresses", validateToken, viewAddresses);
router.put("/update-address/:id", validateToken, updateAddress);
router.delete("/delete-address/:id", validateToken, deleteAddress);
router.get("/address/:id", validateToken, getAddress);
router.post("/check-coupon", validateToken, checkCoupon);
router.post("/order/add-order", validateToken, addOrder);
router.get("/get", validateToken, getUserInfo);
router.get("/get/orders", validateToken, getOrders);
router.get("/get/order/:id", validateToken, getOrder);
router.delete("/delete/order/:id", validateToken, deleteOrder);
router.put("/update-username", validateToken, updateUserName);
router.put("/reset-password",validateToken,resetPassword)
// payment routes
router.post("/checkout/payment", validateToken, payment);
router.post("/checkout/verify-payment", validateToken, verifyPayment);

module.exports = router;
