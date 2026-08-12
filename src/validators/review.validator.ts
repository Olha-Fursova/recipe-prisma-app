import { z } from "zod";

export const ReviewParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const RecipeReviewParamsSchema = z.object({
  recipeId: z.coerce.number().int().positive(),
});

export const CreateReviewSchema = z.object({
  content: z.string().min(10).max(500),
  rating: z.number().int().min(1).max(5),
  reviewerName: z.string().min(2).max(50),
});

export const UpdateReviewSchema = CreateReviewSchema.pick({
  content: true,
  rating: true,
})
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field must be provided",
  });

export type ReviewParams = z.infer<typeof ReviewParamsSchema>;
export type RecipeReviewParams = z.infer<typeof RecipeReviewParamsSchema>;
export type CreateReviewBody = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewBody = z.infer<typeof UpdateReviewSchema>;
