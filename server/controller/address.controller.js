const Address = require("../model/address");

const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, pin, address, city, state } = req.body;

    if (!fullName || !phone || !pin || !address || !city || !state) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newAddress = new Address({
      userId,
      fullName,
      phone,
      pin,
      address,
      city,
      state,
    });

    const saved = await newAddress.save();
    res.status(201).json({ message: "Address saved", data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addressbyid = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "Please login first" });
    }

    const addresses = await Address.find({ userId });

    if (!addresses.length) {
      return res
        .status(404)
        .json({ message: "No address found for this user" });
    }

    res.status(200).json({ success: true, addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    const { fullName, phone, pin, address, city, state } = req.body;

    const updated = await Address.findByIdAndUpdate(
      addressId,
      { fullName, phone, pin, address, city, state },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Address not found" });
    }

    return res.status(200).json({ message: "Address updated", data: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { createAddress, addressbyid, editAddress };
