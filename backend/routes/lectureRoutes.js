const express = require("express");
const router = express.Router();

const Donor = require("../models/Donor");

router.get("/summary", async (req, res) => {
  try {
    const donors = await Donor.find();

    const lectureMap = {};

    donors.forEach((donor) => {
      const lecture = donor.lecture;

      if (!lectureMap[lecture]) {
        lectureMap[lecture] = {
          lecture,
          totalDonors: 0,
          totalCollection: 0,
          totalPending: 0,
        };
      }

      lectureMap[lecture].totalDonors += 1;

      lectureMap[lecture].totalCollection +=
        donor.totalPaid;

      lectureMap[lecture].totalPending +=
        donor.pendingAmount;
    });

    const summary =
      Object.values(lectureMap);

    res.json(summary);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;