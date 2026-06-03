const express = require("express");
const router = express.Router();

const Donor = require("../models/Donor");

router.post("/", async (req, res) => {
  try {
    const donor = new Donor(req.body);

    await donor.save();

    res.status(201).json(donor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find();

    res.json(donors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);

    res.json({
      message: "Donor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedDonor = await Donor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedDonor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;