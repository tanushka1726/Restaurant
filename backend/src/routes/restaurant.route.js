import { Router } from "express";
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
} from "../controllers/restaurant.controller.js";

const router = Router();

router.post("/", createRestaurant);
router.get("/", getAllRestaurants);
router.get("/:res_id", getRestaurantById);
router.put("/:res_id", updateRestaurant);
router.delete("/:res_id", deleteRestaurant);
router.patch("/:res_id/toggle-status", toggleRestaurantStatus);

export default router;
