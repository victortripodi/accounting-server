const express = require("express");
const { Sales } = require("../models/Sales");
const { validateJwt } = require("../utils/authHelpers");

const router = express.Router();

// Get all sales
router.get("/", validateJwt, async (request, response, next) => {
  try {
    let result = await Sales.find({ user: request.userId }).populate('customer').populate('category').exec();

    response.json({
      message: "Sales records fetched successfully",
      result: result
    });

    console.log("Sales records fetched");

  } catch (error) {
    console.log("Error on get all sales", error);
    error.status = 500;
    next(error);
  }
});

// Get sale by ID
router.get("/:id", validateJwt, async (request, response, next) => {
  try {
    let sale = await Sales.findOne({ _id: request.params.id, user: request.userId }).populate('customer').populate('category').exec();
    if (!sale) {
      return response.status(404).json({ message: "Sale record not found" });
    }
    response.json({
      message: "Sale record fetched successfully",
      result: sale
    });
  } catch (error) {
    console.log("Error on get a sale by id", error);
    error.status = 500;
    next(error);
  }
});

// Create a new sale
router.post("/", validateJwt, async (request, response, next) => {
  try {
    let sale = new Sales({
      customer: request.body.customer,
      date: request.body.date,
      dueDate: request.body.dueDate,
      description: request.body.description,
      category: request.body.category,
      amount: request.body.amount,
      tax: request.body.tax,
      user: request.userId,

    });

    let result = await sale.save();
    response.json({
      message: "Sale record created successfully",
      result: result
    });
  } catch (error) {
    console.log("Error on creating a sales", error);
    error.status = 500;
    next(error);
  }
});


module.exports = router;
