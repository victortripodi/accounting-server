const express = require("express");
const { Journal } = require("../models/Journal");
const { JournalLine } = require("../models/JournalLine");
const {validateJwt} = require("../utils/authHelpers");

const router = express.Router();

// Get all journals 
router.get("/", validateJwt, async (request, response, next) => {
  try {
    let result = await Journal.find({ user: request.userId }).exec();
    response.json({
      message: "Journal lines fetched successfully",
      result: result
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});


// Get journal by ID showing the lines
router.get("/:id", validateJwt, async (request, response, next) => {
  try {
    let journal = await Journal.findOne({ _id: request.params.id, user: request.userId }).exec();
    let lines = await JournalLine.find({ journal: request.params.id }).populate('account').exec();

    let result = {
      date: journal.date,
      title: journal.title,
      lines: lines
    }

    if (!result) {
      return response.status(404).json({ message: "Journal line not found" });
    }
    response.json({
      message: "Journal line fetched successfully",
      result: result
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});


// Create a new journal
router.post("/", validateJwt, async (request, response, next) => {
  try {
    let result = await Journal.create({ date: request.body.date, title: request.body.title, user: request.userId });
    request.body.lines.forEach(async line => {
      await JournalLine.create({ account: line.accountId, amount: line.amount, entryType: line.type, journal: result._id })
    });
    
    console.log("Journal created");
    response.json({
      message: "Journal created successfully",
      result: result
    });
  } catch (error) {
    error.status = 500;
    console.log("Error on creating a journal", error);
    next(error);
  }
});

// Delete a journal by ID
router.delete("/:id", validateJwt, async (request, response, next) => {
  try {
    await Journal.findByIdAndDelete(request.params.id).exec();

    console.log("Journal deleted");
    response.json({
      message: "Journal line deleted successfully",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});


module.exports = router;
