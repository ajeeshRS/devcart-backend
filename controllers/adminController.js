const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const admin = require("../models/adminModel");
const product = require("../models/productModel");
const { response } = require("express");
const fs = require("fs");
const coupon = require("../models/couponModel");
const orders = require("../models/orderDetailsModel");

// getting admin
const authAdmin = asyncHandler(async (req, res) => {
  const admin = req.user;

  if (!admin) {
    res.status(401);
    throw new Error("Unauthorised access");
  }

  res.status(200).json({ admin: admin, message: "Access granted" });
});

// login function
const login = asyncHandler(async (req, res) => {
  const { adminLoginData } = req.body;
  const { email, password } = adminLoginData;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory ");
  }

  const adminExist = await admin.findOne({ email });
  if (!adminExist) {
    res.status(404);
    throw new Error("admin not found");
  }

  let accessToken;
  if (adminExist && (await bcrypt.compare(password, adminExist.password))) {
    accessToken = jwt.sign(
      {
        admin: {
          email: adminExist.email,
          username: adminExist.username,
        },
      },
      process.env.ADMIN_ACCESS_KEY,
      { expiresIn: "7d" }
    );
  }
  res.status(200).json(accessToken);
});

// add product fucntion  (protected route)
const addProduct = asyncHandler(async (req, res) => {
  const admin = req.user;
  const { title, brand, category, price, description } = req.body;
  const image = req.file;

  if (image) {
    const newProduct = await product.create({
      title: title,
      brand: brand,
      category: category,
      description: description,
      price: price,
      image: {
        filename: image.filename,
        path: image.path,
        destination: image.destination,
      },
    });
    //console.log("created product:", newProduct);
  }

  res.status(200).json({ admin: admin, message: "Data received successfully" });
});

const allProducts = asyncHandler(async (req, res) => {
  const admin = req.user;

  const products = await product.find();
  // console.log(products);

  res.status(200).json({ admin: admin, products: products });
});

// home function (protected route)
const adminHome = asyncHandler(async (req, res) => {});

// update function  (protected route)
const updateProduct = asyncHandler(async (req, res) => {
  const admin = req.user;
  const { title, brand, category, description, price } = req.body;
  const image = req.file;
  const id = req.params.id;

  const updatedFields = {};

  if (req.body.title) {
    updatedFields.title = req.body.title;
  }
  if (req.body.brand) {
    updatedFields.brand = req.body.brand;
  }
  if (req.body.category) {
    updatedFields.category = req.body.category;
  }
  if (req.body.description) {
    updatedFields.description = req.body.description;
  }
  if (req.body.price) {
    updatedFields.price = req.body.price;
  }
  if (req.file) {
    updatedFields.image = {
      filename: req.file.filename,
      path: req.file.path,
      destination: req.file.destination,
    };
  }

  const result = await product.findById(id);

  if (!result) {
    res.status(404).json({ error: "product not found" });
    throw new Error("Product not found");
  }

  try {
    const response = await product.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    admin: admin,
    message: "This is a response from update server...",
  });
});

// delete function  (protected route)
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const productExist = await product.findById(productId);

  if (!productExist) {
    res.status(404).json("product not found");
  }

  const productPath = productExist.image.path;
  if (fs.existsSync(productPath)) {
    fs.unlinkSync(productPath);
    //console.log("file successfully removed");
  } else {
    //console.log("file does not exist!");
  }
  try {
    await productExist.deleteOne();
    res.status(200).json("product deleted successfully!");
  } catch (error) {
    console.log(error);
  }
});

const couponDiscount = asyncHandler(async (req, res) => {});

const addCoupon = asyncHandler(async (req, res) => {
  try {
    const { code, discountPercentage, expiry, minPurchaseAmount } =
      req.body.data;

    const couponExist = await coupon.findOne({ code: code });

    if (couponExist) {
      console.log(couponExist);
      return res.status(409).json("coupon exists!");
    } else {
      const result = await coupon.create({
        code: code,
        discountPercentage: discountPercentage,
        dateCreated: Date.now(),
        expiry: expiry,
        minPurchaseAmount: minPurchaseAmount,
      });
      if (result) {
        return res.status(201).json("Coupon added !");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("some internal error occured!");
  }
});

const getOrders = asyncHandler(async (req, res) => {
  try {
    const data = await orders.find({});
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json("Error in fetching data");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("some internal error occured!");
  }
});

module.exports = {
  authAdmin,
  login,
  adminHome,
  addProduct,
  allProducts,
  updateProduct,
  deleteProduct,
  couponDiscount,
  addCoupon,
  getOrders,
};
