const express = require("express");

const router = express.Router();

const Payment = require("../models/Payment");

const Donor = require("../models/donor");

router.post("/", async (req, res) => {
  try {
    const {
      donorId,
      amount,
      paymentDate,
    } = req.body;

    if (!donorId || !amount) {
      return res.status(400).json({
        message:
          "Donor and amount are required",
      });
    }

    const donor = await Donor.findById(
      donorId
    );

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found",
      });
    }

    const formattedDate =
  paymentDate
    ? new Date(paymentDate)
    : new Date();

    console.log(req.body);
const payment = new Payment({
  donorId,
  amount,
  paymentDate:
    formattedDate,
});

    await payment.save();

    donor.totalPaid += Number(
  amount || 0
);

    donor.pendingAmount = Math.max(
      donor.promisedAmount -
        donor.totalPaid,
      0
    );

    await donor.save();

    const populatedPayment =
      await Payment.findById(
        payment._id
      ).populate("donorId");

    res.status(201).json(
      populatedPayment
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const payments =
      await Payment.find()
        .populate("donorId")
        .sort({
          paymentDate: -1,
        });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get(
  "/donor/:donorId",
  async (req, res) => {
    try {
      const payments =
        await Payment.find({
          donorId:
            req.params.donorId,
        })
          .populate("donorId")
          .sort({
            paymentDate: -1,
          });

      res.json(payments);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;