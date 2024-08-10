const express = require("express");
const { Entity } = require("../models/Entity");
const {validateJwt} = require("../utils/authHelpers");

const router = express.Router();

// Get all entities
router.get("/", validateJwt,  async (request, response, next) => {
  try {
    let result = await Entity.find({user: request.userId}).exec();
    response.json({
      message: "Entities fetched successfully",
      result: result
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// Get entity by ID
router.get("/:id", validateJwt, async (request, response, next) => {
  try {
    let result = await Entity.findById(request.params.id).exec();
    if (!result) {
      return response.status(404).json({ message: "Entity not found" });
    }
    response.json({
      message: "Entity fetched successfully",
      result: result
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// Get entity by type
router.get("/findByType/:type", validateJwt, async (request, response, next) => {
  try {
    let result = await Entity.find({ type: request.params.type }).exec();
    if (!result.length) {
      return response.status(404).json({ message: "No Entity found for this type" });
    }
    response.json({
      message: "Entity fetched successfully",
      result: result
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// Create an Entity
router.post("/", validateJwt, async (request, response, next) => {

  let createInput = {
    name: request.body.name,
    ABN: request.body.ABN,
    email: request.body.email,
    address: request.body.address,
    postcode: request.body.postcode,
    type: request.body.type,
    user: request.userId,
  }

	let result = await Entity.create(createInput).catch(error => {
		error.status = 400;
		return error
	});

	if (result.errors) {
		return next(result);
	}

	response.json({
		message:"Entity created successfully",
		result: result
	});
});

// Update an entity by ID
router.patch("/findById/:id", validateJwt, async (request, response, next) => {
    let updateInput = {
      name: request.body.name,
      ABN: request.body.ABN,
      email: request.body.email,
      address: request.body.address,
      postcode: request.body.postcode,
      type: request.body.type
    };
    
    try {
      let result = await Entity.findByIdAndUpdate(request.params.id, updateInput).exec();

    if (!result) {
      return response.status(404).json({ message: "Entity not found" });
    }

    response.json({
      message: "Entity updated successfully",
      result: result
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

module.exports = router;