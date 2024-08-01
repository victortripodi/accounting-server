const express = require("express");
const { Account } = require("../models/Account");
const router = express.Router();

// Get all accounts
router.get("/", async (request, response, next) => {
  try {
    let result = await Account.find({}).exec();
    response.json({
      message: "Accounts fetched successfully",
      result: result
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// Get account by ID
router.get("/findById/:id", async (request, response, next) => {
  try {
    let result = await Account.findById(request.params.id).exec();
    if (!result) {
      return response.status(404).json({ message: "Account not found" });
    }
    response.json({
      message: "Account fetched successfully",
      result: result
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

module.exports = router;
