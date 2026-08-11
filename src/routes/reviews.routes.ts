import express from "express";
import * as reviewsController from "../controllers/reviews.controller.ts";

const router = express.Router();

// Nested routes для роботи з reviews конкретного рецепту
router.get("/recipes/:recipeId/reviews", reviewsController.getReviewsByRecipe);
router.post("/recipes/:recipeId/reviews", reviewsController.createReview);

// Flat routes для операцій з конкретним review
router.patch("/reviews/:id", reviewsController.updateReview);
router.delete("/reviews/:id", reviewsController.deleteReview);

export default router;
