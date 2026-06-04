const express = require("express");
const router = express.Router();

const Payment = require("../models/Payment");
const Donor = require("../models/Donor");

router.post("/", async (req, res) => {
  try {
    const {
      donorId,
      amount,
      paymentMethod,
      note,
    } = req.body;

    const payment = new Payment({
      donorId,
      amount,
      paymentMethod,
      note,
    });

    await payment.save();

    const donor = await Donor.findById(donorId);

    donor.totalPaid += Number(amount);

    donor.pendingAmount =
      donor.promisedAmount - donor.totalPaid;

    await donor.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("donorId");

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;