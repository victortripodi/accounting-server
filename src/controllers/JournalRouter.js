const express = require("express");
const { Journal } = require("../models/Journal");
const { JournalLine } = require("../models/JournalLine");
const router = express.Router();

// Get all journals 
router.get("/", async (request, response, next) => {
  try {
    let result = await Journal.find({ user: req.user.id }).exec();
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
router.get("/findById/:id", async (request, response, next) => {
  try {
    let journal = await Journal.findById(request.params.id, { user: req.user.id }).exec();
    let lines = await JournalLine.find({ journal: request.params.id  }).exec();

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
router.post("/", async (request, response, next) => {
  try {
    console.log("Journal creation body is:");
    console.log(request.body);

    let result = await Journal.create({ date: request.body.date, title: request.body.title });
    request.body.lines.forEach(async line => {
      await JournalLine.create({ account: line.accountId, amount: line.amount, entryType: line.type, journal: result._id })
    });
 
    response.json({
      message: "Journal created successfully",
      result: result
    });
  } catch (error) {
    error.status = 400;
    console.log("Error on creating a journal", error);
    next(error);
  }
});

// Update a journal by ID
router.patch("/findById/:id", async (request, response, next) => {
  try {
    let result = await Journal.findByIdAndUpdate(
      request.params.id,
      { date: request.body.date, title: request.body.title }, { user: req.user.id },
    ).exec();

    if (!result) {
      return response.status(404).json({ message: "Journal not found" });
    }

    request.body.lines.forEach(async line => {
      await JournalLine.findById({ account: line.accountId, amount: line.amount, entryType: line.type, journal: result._id })
    })

    response.json({
      message: "Journal updated successfully",
      result: result
    });
  } catch (error) {
    error.status = 400;
    console.log("Error on updating a journal", error);
    next(error);
  }
});

// Delete a journal line by ID
router.delete("/findById/:id", async (request, response, next) => {
  try {
    let result = await Journal.findByIdAndDelete(request.params.id,{ user: req.user.id }).exec();

    if (!result) {
      return response.status(404).json({ message: "Journal line not found" });
    }

    response.json({
      message: "Journal line deleted successfully",
      result: result
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

module.exports = router;
