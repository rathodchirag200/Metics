const Cart = require("../model/cart");
const Product = require("../model/product");

const addtocart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: 1,
            price: product.offer_price,
          },
        ],
      });

      await cart.save();

      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        cart,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        productId,
        quantity: 1,
        price: product.offer_price,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getcart = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await Cart.findOne({ userId }).populate("items.productId");

    if (!data || data.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: [],
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;

    if (userId) {
      console.log({ message: "userid is required" });
    }

    const { productId } = req.body;

    if (!productId) {
      console.log({ message: "productid is required" });
    }

    const data = await Cart.findOne({ userId });
    if (!data) return res.status(404).json({ message: "Cart not found" });

    data.items = data.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    await data.save();

    res.status(200).json({ message: "Item removed", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const increasequantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userid and productId are required",
      });
    }

    let cart = await Cart.findOne({ userId });

    // If cart not exists → create + add product
    if (!cart) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1, price: product.offer_price }],
      });

      await cart.save();

      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        cart,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );

    // If exists → increase
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    }
    // If not exists → add
    else {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      cart.items.push({
        productId,
        quantity: 1,
        price: product.offer_price,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity increased / Product added",
      cart,
    });
  } catch (error) {
    console.error("increasequantity error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const decreasequantity = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userid is required" });
    }

    const { productId } = req.body;
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "productId is required" });
    }

    const data = await Cart.findOne({ userId });
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const itemIndex = data.items.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    if (data.items[itemIndex].quantity > 1) {
      data.items[itemIndex].quantity -= 1;
    } else {
      data.items.splice(itemIndex, 1);
    }

    await data.save();

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await Cart.findOne({ userId });
    if (!data) return res.status(404).json({ message: "Cart not found" });

    data.items = [];
    await data.save();

    res.status(200).json({ message: "Cart cleared", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addtocart,
  getcart,
  removeFromCart,
  decreasequantity,
  clearCart,
  increasequantity,
};
