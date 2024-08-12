const express = require("express");
const { Expenses } = require("../models/Expenses");
const { validateJwt } = require("../utils/authHelpers");

const router = express.Router();

// Get all Expenses
router.get("/", validateJwt, async (request, response, next) => {
  try {
    let result = await Expenses.find({ user: request.userId }).populate('vendor').populate('category').exec();

    response.json({
      message: "Expenses records fetched successfully",
      result: result
    });

    console.log("Expenses records fetched");

  } catch (error) {
    console.log("Error on get all Expenses", error);
    error.status = 500;
    next(error);
  }
});

// Get Expense by ID
router.get("/:id", validateJwt, async (request, response, next) => {
  try {
    let expense = await Expenses.findOne({ _id: request.params.id, user: request.userId }).populate('vendor').populate('category').exec();
    if (!expense) {
      return response.status(404).json({ message: "Expense record not found" });
    }
    response.json({
      message: "Expense record fetched successfully",
      result: expense
    });
  } catch (error) {
    console.log("Error on get a expense by id", error);
    error.status = 500;
    next(error);
  }
});

// Create a new expense
router.post("/", validateJwt, async (request, response, next) => {
  try {
    let expense = new Expenses({
      vendor: request.body.vendor,
      date: request.body.date,
      dueDate: request.body.dueDate,
      description: request.body.description,
      category: request.body.category,
      amount: request.body.amount,
      tax: request.body.tax,
      user: request.userId,

    });

    let result = await expense.save();
    response.json({
      message: "Expense record created successfully",
      result: result
    });
  } catch (error) {
    console.log("Error on creating a Expenses", error);
    error.status = 500;
    next(error);
  }
});


module.exports = router;
