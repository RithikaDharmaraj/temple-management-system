const express = require("express");

const router = express.Router();

const Donor = require("../models/donor");

const Payment = require("../models/Payment");

router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find();

    const payments =
      await Payment.find();

    // TOTAL COLLECTION
    const totalCollection =
      payments.reduce(
        (sum, payment) =>
          sum + payment.amount,
        0
      );

    // PROMISED DONORS
    const promisedDonors =
      donors.filter(
        (donor) =>
          donor.promisedAmount > 0
      );

    // UNPROMISED DONORS
    const unpromisedDonors =
      donors.filter(
        (donor) =>
          !donor.promisedAmount ||
          donor.promisedAmount ===
            0
      );

    // TOTAL PROMISED
    const totalPromised =
      promisedDonors.reduce(
        (sum, donor) =>
          sum +
          donor.promisedAmount,
        0
      );

    // PROMISED COLLECTION
    const promisedCollection =
      promisedDonors.reduce(
        (sum, donor) =>
          sum + donor.totalPaid,
        0
      );

    // UNPROMISED COLLECTION
    const unpromisedCollection =
      unpromisedDonors.reduce(
        (sum, donor) =>
          sum + donor.totalPaid,
        0
      );

    // TOTAL PENDING
    const totalPending =
      promisedDonors.reduce(
        (sum, donor) =>
          sum +
          donor.pendingAmount,
        0
      );

    // TOTAL DONORS
    const totalDonors =
      donors.length;

    // PROMISED DONOR COUNT
    const promisedDonorCount =
      promisedDonors.length;

    // UNPROMISED DONOR COUNT
    const unpromisedDonorCount =
      unpromisedDonors.length;

    // DONORS WHO PAID
    const donorsWhoPaid =
      donors.filter(
        (donor) =>
          donor.totalPaid > 0
      ).length;

    // UNPAID DONORS
    const unpaidDonors =
      donors.filter(
        (donor) =>
          donor.totalPaid === 0
      ).length;

    // LEDGER SUMMARY
    const ledgerMap = {};

    donors.forEach((donor) => {
      const ledger =
        donor.ledger ||
        "D Ledger";

      if (!ledgerMap[ledger]) {
        ledgerMap[ledger] = {
          ledger,
          totalDonors: 0,
          totalCollection: 0,
        };
      }

      ledgerMap[
        ledger
      ].totalDonors += 1;

      ledgerMap[
        ledger
      ].totalCollection +=
        donor.totalPaid;
    });

    const ledgerSummary =
      Object.values(ledgerMap);

    res.json({
      totalCollection,

      totalPromised,

      totalPending,

      totalDonors,

      promisedCollection,

      unpromisedCollection,

      promisedDonorCount,

      unpromisedDonorCount,

      donorsWhoPaid,

      unpaidDonors,

      ledgerSummary,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;