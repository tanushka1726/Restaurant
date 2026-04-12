import asyncHandler from '../utils/asyncHandler.js'
import apiResponse from '../utils/apiResponse.js'
import apiError from '../utils/apiError.js'
import Restaurant from '../models/restaurant.model.js'
import Session from '../models/session.model.js'

export const createRestaurant = asyncHandler(async (req, res, next) => {
  const { name, description, imageUrl, address, email, contact_no } = req.body;

  if (!name || !address) {
    throw new apiError(400, "Name and address are required");
  }

  const restaurant = await Restaurant.create({
    name,
    description: description || "",
    imageUrl: imageUrl || "",
    email: email || "",
    contact_no: contact_no || "",
    address,
    isActive: true,
  });

  // Also store restaurant info in Session
  await Session.create({
    res_Id: restaurant._id,
    restaurant_name: restaurant.name,
    email: restaurant.email || "",
    contact_no: restaurant.contact_no || "",
    address: restaurant.address,
    status: restaurant.status || "pending",
  });

  res.status(201).json(new apiResponse(201, restaurant, "Restaurant created successfully"));
});

export const getAllRestaurants = asyncHandler(async (req, res, next) => {
  const restaurants = await Restaurant.find().sort({ createdAt: -1 });
  res.status(200).json(new apiResponse(200, restaurants, "Restaurants retrieved successfully"));
});

export const getRestaurantById = asyncHandler(async (req, res, next) => {
  const { res_id } = req.params;
  const restaurant = await Restaurant.findById(res_id);
  if (!restaurant) {
    return next(new apiError(404, "Restaurant not found"));
  }
  res.status(200).json(new apiResponse(200, restaurant, "Restaurant details retrieved successfully"));
});

export const updateRestaurant = asyncHandler(async (req, res, next) => {
  const { res_id } = req.params;
  const { name, description, imageUrl, address, email, contact_no } = req.body;

  if (!name && !description && !imageUrl && !address && !email && !contact_no) {
    throw new apiError(400, "At least one field must be provided for update");
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
  if (address) updateData.address = address;
  if (email !== undefined) updateData.email = email;
  if (contact_no !== undefined) updateData.contact_no = contact_no;

  const restaurant = await Restaurant.findByIdAndUpdate(res_id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!restaurant) {
    return next(new apiError(404, "Restaurant not found"));
  }

  // Sync the Session record
  await Session.findOneAndUpdate(
    { res_Id: res_id },
    {
      restaurant_name: restaurant.name,
      email: restaurant.email || "",
      contact_no: restaurant.contact_no || "",
      address: restaurant.address,
      status: restaurant.status,
      updatedAt: Date.now(),
    },
    { new: true, upsert: true }
  );

  res.status(200).json(new apiResponse(200, restaurant, "Restaurant updated successfully"));
});

export const deleteRestaurant = asyncHandler(async (req, res, next) => {
  const { res_id } = req.params;
  const restaurant = await Restaurant.findByIdAndDelete(res_id);
  if (!restaurant) {
    return next(new apiError(404, "Restaurant not found"));
  }

  // Also delete the Session record
  await Session.deleteMany({ res_Id: res_id });

  res.status(200).json(new apiResponse(200, null, "Restaurant deleted successfully"));
});

export const toggleRestaurantStatus = asyncHandler(async (req, res, next) => {
  const { res_id } = req.params;
  const restaurant = await Restaurant.findById(res_id);
  if (!restaurant) {
    return next(new apiError(404, "Restaurant not found"));
  }

  restaurant.isActive = !restaurant.isActive;
  await restaurant.save();

  res.status(200).json(new apiResponse(200, restaurant, "Restaurant status toggled successfully"));
});


