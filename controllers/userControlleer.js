const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const product = require("../models/productModel");
const wishList = require("../models/userWishlistModel");
const userCart = require("../models/userCartModel");
const address = require("../models/addressModel");
const coupon = require("../models/couponModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const orders = require("../models/orderDetailsModel");
const easyInvoice = require("easyinvoice");
// register user
const registerUser = asyncHandler(async (req, res) => {
  const { userFormData } = req.body;
  const { email, username, password } = userFormData;

  if (!email || !username || !password) {
    res.status(401);
    throw new Error("All fields are mandatory");
  }

  const userExists = await user.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log(hashedPassword);
  await user
    .create({
      email,
      username,
      password: hashedPassword,
    })
    .then((response) => {
      // console.log(response);
      res.status(200).send("Account created succesfully !");
    })
    .catch((err) => console.log(err));
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { loginData } = req.body;
  const { email, password } = loginData;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userExist = await user.findOne({ email });

  if (userExist && (await bcrypt.compare(password, userExist.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: userExist.username,
          email: userExist.email,
          id: userExist._id,
        },
      },
      process.env.ACCESS_KEY,
      { expiresIn: "7d" }
    );
    //console.log({ accessToken });
    res.status(200).json({ accessToken });
  }
  // if(userExist){
  //   console.log(userExist);
  // }
  else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const data = await product.find();
    res.status(200).json(data);
  } catch (error) {
    // console.log("could not fetch details");
    res.status(404).json("could not fetch details");
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const data = await product.findById(id);
    res
      .status(200)
      .json({ data: data, message: "product fetched successfully" });
  } catch (err) {
    console.log(err);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    let wishlist = await wishList.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new wishList({ user: userId, products: [] });
    }

    const index = wishlist.products.indexOf(productId);

    if (index !== -1) {
      wishlist.products.splice(index, 1);
      // console.log("product removed success");
      res.status(200).json("product removed success");
    } else {
      wishlist.products.push(productId);
      // console.log("product added successfully");

      res.status(200).json("product added successfully");
    }

    await wishlist.save();
  } catch (err) {
    console.log(err);
  }
});

const deleteFromWishlist = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    let wishlist = await wishList.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new wishList({ user: userId, products: [] });
    }

    const index = wishlist.products.indexOf(productId);

    if (index !== -1) {
      wishlist.products.splice(index, 1);
      await wishlist.save();
      // console.log("Product removed successfully");
      res.status(200).json("Product removed successfully");
    } else {
      // console.log("Product not found in wishlist");
      res.status(404).json("Product not found in wishlist");
    }
  } catch (error) {
    console.log(error);
  }
});

const getAllFavorites = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    let wishlist = await wishList.findOne({ user: userId });
    if (wishlist) {
      let favorites = wishlist.products;
      res.status(200).json({ fav: favorites });
    }
  } catch (error) {
    console.log(error);
  }
});

const getFavoriteProductDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const wishlist = await wishList.findOne({ user: userId });

  if (!wishlist) {
    res.status(404).json("Wishlist not found");
  }

  const populatedWishlist = await Promise.all(
    wishlist.products.map(async (item) => {
      const productItem = await product.findById(item);
      return productItem;
    })
  );

  if (populatedWishlist) {
    res.status(200).json(populatedWishlist);
  }
});

const addToCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    let cart = await userCart.findOne({ user: userId });

    if (!cart) {
      cart = new userCart({ user: userId, products: [] });
    }

    const index = cart.products.indexOf(productId);

    if (index !== -1) {
      res.status(401).json("product already exists");
    } else {
      cart.products.push(productId);
      // console.log("product added successfully");
      res.status(200).json("product added to cart successfully");
    }

    await cart.save();
  } catch (err) {
    console.log(err);
  }
});

const getCartProducts = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await userCart.findOne({ user: userId });
    if (cart) {
      const populatedCart = await Promise.all(
        cart.products.map(async (itemId) => {
          let cartItem = await product.findById(itemId);
          return cartItem;
        })
      );

      if (populatedCart) {
        res.status(200).json(populatedCart);
      }
    } else {
      res.status(404).json("no cart for this user");
    }
  } catch (error) {
    console.log(error);
  }
});

const deleteFromCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    let cart = await userCart.findOne({ user: userId });

    if (!cart) {
      cart = new wishList({ user: userId, products: [] });
    }

    const index = cart.products.indexOf(productId);

    if (index !== -1) {
      cart.products.splice(index, 1);
      await cart.save();
      const data = await product.findByIdAndUpdate(
        { _id: productId },
        { quantity: 1 },
        { new: true }
      );
      res.status(200).json("Product removed successfully");
    } else {
      res.status(404).json("Product not found in cart");
    }
  } catch (error) {
    console.log(error);
  }
});

const updateQuantity = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.productId;
    const { quantity } = req.body;

    const updatedProduct = await product.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        $set: { quantity },
      },
      {
        new: true,
      }
    );
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }
    res.status(200).json({ success: true, updatedProduct });
  } catch (error) {
    console.log(error);
  }
});

const searchProducts = asyncHandler(async (req, res) => {
  try {
    const term = req.params.term;
    const products = await product.find({ $text: { $search: term } });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
});

const addAddress = asyncHandler(async (req, res) => {
  try {
    const { data } = req.body;
    const { fullName, phone, street, city, state, pincode } = data;
    const result = await address.create({
      user: req.user.id,
      fullName: fullName,
      phoneNo: phone,
      street: street,
      city: city,
      state: state,
      pinCode: pincode,
    });
    if (result) {
      res.status(201).json("Address saved succesfully");
    }
  } catch (error) {
    res.status(500);
    console.log(error);
  }
});

const viewAddresses = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await address.find({ user: userId });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
});

const updateAddress = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const id = req.params.id;
  const { fullName, phone, street, city, state, pincode } = data;
  const updatedFields = {};

  if (fullName) {
    updatedFields.fullName = fullName;
  }
  if (phone) {
    updatedFields.phone = phone;
  }
  if (street) {
    updatedFields.street = street;
  }
  if (city) {
    updatedFields.city = city;
  }
  if (state) {
    updatedFields.state = state;
  }
  if (pincode) {
    updatedFields.pinCode = pincode;
  }

  try {
    const result = await address.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!result) {
      res.status(404).json("error finding item or unable to update.");
    }
    res.status(201).json("product updated succesfully!");
  } catch (error) {
    console.log(error);
  }
});

const deleteAddress = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const result = await address.deleteOne({ _id: id });
    if (result) {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
  }
});

const getAddress = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const data = await address.findById({ _id: id });
    if (data) {
      // console.log(data);
      res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
  }
});

const checkCoupon = asyncHandler(async (req, res) => {
  try {
    const { couponValue, totalAmount } = req.body;
    const couponDetail = await coupon.findOne({
      code: couponValue,
      used: false,
    });

    console.log(couponDetail)
    if (!couponDetail) {
      return res.status(404).json({
        valid: false,
        message: "Coupon not found or already been used.",
      });
    }
    if (couponDetail.expiry && couponDetail.expiry <  Date.now()) {
      return res.status(404).json({ valid: false, message: "Coupon has expired" });
    }
    if (
      couponDetail.minPurchaseAmount &&
      totalAmount < coupon.minPurchaseAmount
    ) {
      return res.json({
        valid: false,
        message: "Minimum purchase amount not met",
      });
    }

    return res.json({
      valid: true,
      discountPercentage: couponDetail.discountPercentage,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ valid: false, message: "Error checking coupon code" });
  }
});

const payment = asyncHandler(async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "something went wrong" });
      }
      // console.log(order)
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const { response } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      response;
    // console.log(response)
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
});

const addOrder = asyncHandler(async (req, res) => {
  try {
    const { productDetails, amount, orderId, discount } = req.body.orderDetails;
    const { paymentId } = req.body;
    const { address } = req.body;
    const userId = req.user.id;
    console.log(discount);
    if (
      !productDetails ||
      !amount ||
      !orderId ||
      !paymentId ||
      !userId ||
      !address
    ) {
      res.status(401);
      throw new Error("All details are mandatory to place order");
    } else {
      const data = await orders.create({
        orderId: orderId,
        productDetails: productDetails,
        userId: userId,
        amount: amount,
        discount: discount,
        paymentId: paymentId,
        address: address,
        date: Date.now(),
      });
      console.log(data);

      //fetch cart and empty the cart after the order is placed
      const cart = await userCart.deleteOne({ user: userId });
      res.status(200).json("order created successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("some internal error occured!");
  }
});

const getUserInfo = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json("error fetching in user details");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("some internal error occured!");
  }
});

const getOrders = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await orders.find({ userId: userId });
    if (data) {
      console.log(data);
      res.status(200).json(data);
    } else {
      res.status(404).json("orders not found or error in fetching");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("some internal error");
  }
});

const getOrder = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = await orders.find({ orderId: orderId });
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json("order not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("some internal error occured!");
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = await orders.deleteOne({ orderId: orderId });

    if (data) {
      res.status(200).json("Order cancelled !");
    } else {
      res.status(400).json("Error in cancelling order");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Some internal error occured!");
  }
});

const updateUserName = asyncHandler(async (req, res) => {
  try {
    const data = req.body.data;
    const id = req.user.id;
    const updatedUsername = {};
    if (data.userName) {
      updatedUsername.username = data.userName;
    }
    const result = await user.findByIdAndUpdate(id, updatedUsername, {
      new: true,
    });
    if (result) {
      res.status(200).json("username updated successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("some internal error occured!");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const data = req.body.data;
    const id = req.user.id;
    const userExist = await user.findById(id);
    const updatedFields = {};

    if (data.newPassword) {
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      updatedFields.password = hashedPassword;

    }

    if (
      userExist &&
      (await bcrypt.compare(data.currentPassword, userExist.password))
    ) {
      const result = await user.findByIdAndUpdate(id, updatedFields, {
        new: true,
      });
      if (result) {
        res.status(200).json("password changed!")
      }
    } else {
      console.log("password doesnt match");
      res.status(400).json("password doesnt match")
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("some internal error occured!");
  }
});

module.exports = {
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
};
