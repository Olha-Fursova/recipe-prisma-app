import express from "express";
import * as reviewsController from "../controllers/reviews.controller.ts";
import { validateBody, validateParams } from "../middleware/validate.ts";
import {
  CreateReviewSchema,
  UpdateReviewSchema,
  ReviewParamsSchema,
  RecipeReviewParamsSchema,
} from "../validators/review.validator.ts";

const router = express.Router();

router.get(
  "/recipes/:recipeId/reviews",
  validateParams(RecipeReviewParamsSchema),
  reviewsController.getReviewsByRecipe,
);
router.post(
  "/recipes/:recipeId/reviews",
  validateParams(RecipeReviewParamsSchema),
  validateBody(CreateReviewSchema),
  reviewsController.createReview,
);
router.patch(
  "/reviews/:id",
  validateParams(ReviewParamsSchema),
  validateBody(UpdateReviewSchema),
  reviewsController.updateReview,
);
router.delete(
  "/reviews/:id",
  validateParams(ReviewParamsSchema),
  reviewsController.deleteReview,
);

export default router;
