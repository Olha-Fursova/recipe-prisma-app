import type { Request, Response } from "express";
import prisma from "../../prisma/client.ts";

// Models ==============================================================

type ReviewParams = {
  id: string;
};

type RecipeReviewParams = {
  recipeId: string;
};

type CreateReviewBody = {
  content: string;
  rating: number;
  reviewerName: string;
};

type UpdateReviewBody = Partial<Pick<CreateReviewBody, "content" | "rating">>;

// Get review by recipe ==============================================================

export const getReviewsByRecipe = async (
  req: Request<RecipeReviewParams>,
  res: Response,
) => {
  const { recipeId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { recipeId: parseInt(recipeId) },
  });

  res.status(200).json(reviews);
};

// Create review ==============================================================

export const createReview = async (
  req: Request<RecipeReviewParams, {}, CreateReviewBody>,
  res: Response,
) => {
  const { recipeId } = req.params;
  const { content, rating, reviewerName } = req.body;

  const review = await prisma.review.create({
    data: {
      content,
      rating,
      reviewerName,
      recipe: {
        connect: { id: parseInt(recipeId) },
      },
    },
  });

  res.status(201).json(review);
};

// Update review ==============================================================

export const updateReview = async (
  req: Request<ReviewParams, {}, UpdateReviewBody>,
  res: Response,
) => {
  const { id } = req.params;
  const { content, rating } = req.body;

  const review = await prisma.review.update({
    where: { id: parseInt(id) },
    data: { content, rating },
  });

  res.status(200).json(review);
};

// Delete review ==============================================================

export const deleteReview = async (
  req: Request<ReviewParams>,
  res: Response,
) => {
  const { id } = req.params;

  await prisma.review.delete({
    where: { id: parseInt(id) },
  });

  res.status(204).send();
};
