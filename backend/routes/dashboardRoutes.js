const express = require("express");
const router = express.Router();

const Donor = require("../models/Donor");
const Payment = require("../models/Payment");

router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find();

    const payments = await Payment.find();

    const totalCollection = payments.reduce(
      (sum, payment) =>
        sum + payment.amount,
      0
    );

    const totalPromised = donors.reduce(
      (sum, donor) =>
        sum + donor.promisedAmount,
      0
    );

    const totalPending =
      totalPromised - totalCollection;

    const totalDonors = donors.length;

    res.json({
      totalCollection,
      totalPromised,
      totalPending,
      totalDonors,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;