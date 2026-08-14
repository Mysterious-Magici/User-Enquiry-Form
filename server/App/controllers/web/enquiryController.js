const enquiryModel = require("../../models/enquiry.model");
const mongoose = require("mongoose");


const enquiryInsert = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res
        .status(400)
        .json({ status: 0, msg: "All fields are required" });
    }

    const enquiry = new enquiryModel({ name, email, phone, message });
    const saved = await enquiry.save();

    res.status(201).json({
      status: 1,
      msg: "Enquiry Saved Successfully",
      data: saved,
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ status: 0, msg: error.message || "Error while saving enquiry" });
  }
};


const enquiryRead = async (_req, res) => {
  try {
    const data = await enquiryModel.find().sort({ createdAt: -1 });

    res.json({
      status: 1,
      msg: "Enquiries fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      msg: error.message || "Error while fetching enquiries",
    });
  }
};

const enquiryShow = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ status: 0, msg: "Invalid enquiry id" });
    }

    const data = await enquiryModel.findById(id);

    if (!data) {
      return res.status(404).json({ status: 0, msg: "Enquiry not found" });
    }

    res.json({ status: 1, msg: "Enquiry fetched successfully", data });
  } catch (error) {
    res.status(500).json({
      status: 0,
      msg: error.message || "Error while fetching enquiry",
    });
  }
};


const enquiryUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ status: 0, msg: "Invalid enquiry id" });
    }

    if (!name || !email || !phone || !message) {
      return res
        .status(400)
        .json({ status: 0, msg: "All fields are required" });
    }

    const updated = await enquiryModel.findByIdAndUpdate(
      id,
      { name, email, phone, message },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ status: 0, msg: "Enquiry not found" });
    }

    res.json({
      status: 1,
      msg: "Enquiry Updated Successfully",
      data: updated,
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ status: 0, msg: error.message || "Error while updating enquiry" });
  }
};


const enquiryDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ status: 0, msg: "Invalid enquiry id" });
    }

    const deleted = await enquiryModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ status: 0, msg: "Enquiry not found" });
    }

    res.json({ status: 1, msg: "Enquiry Deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: 0,
      msg: error.message || "Error while deleting enquiry",
    });
  }
};

module.exports = {
  enquiryInsert,
  enquiryRead,
  enquiryShow,
  enquiryUpdate,
  enquiryDelete,
};
