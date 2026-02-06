const Product = require("../model/product");
const router = require("../routes/product.routes");
const { uploadToImageKit } = require("../middlewear/uploads");

const addproduct = async (req, res) => {
  try {
    const {
      product_name,
      description,
      price,
      offer_price,
      category,
      sub_category,
      sizes,
      stock,
    } = req.body;

    if (
      !product_name ||
      !description ||
      !price ||
      !offer_price ||
      !category ||
      !sub_category ||
      !sizes ||
      !stock
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const images = [];
    for (const file of req.files) {
      const url = await uploadToImageKit(file);
      images.push(url);
    }

    const product = new Product({
      product_name,
      description,
      price,
      offer_price,
      category,
      sub_category,
      images,
      sizes,
      stock,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const displayproduct = async (req, res) => {
  try {
    const data = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteproduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const editproduct = async (req, res) => {
  try {
    const productid = req.params.id;

    const product = await Product.findById(productid);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      product_name,
      description,
      price,
      offer_price,
      category,
      sub_category,
      sizes,
      stock,
      existingImages,
    } = req.body;

    let images = [];

    if (existingImages) {
      if (typeof existingImages === "string") {
        try {
          images = JSON.parse(existingImages);
        } catch {
          images = [existingImages];
        }
      } else {
        images = existingImages;
      }
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToImageKit(file);
        images.push(url);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productid,
      {
        product_name,
        description,
        price,
        offer_price,
        category,
        sub_category,
        sizes,
        stock,
        images,
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const productbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Product.findById(id);
    if (!data) {
      res.status(400).json({ success: false, message: "product not found" });
    }
    return res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addproduct,
  displayproduct,
  deleteproduct,
  editproduct,
  productbyid,
};
