import { z } from "zod";

export const RecipeParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const CreateRecipeSchema = z.object({
  title: z.string().min(3).max(100),
  ingredients: z.array(z.string()).min(1),
  instructions: z.string().min(20),
  cookingTime: z.number().int().min(1).max(1440),
  servings: z.number().int().min(1).max(100),
  chefName: z.string().min(2).max(50),
  categoryId: z.number().int().positive(),
  tagIds: z.array(z.number().int().positive()).optional(),
});

export const UpdateRecipeSchema = CreateRecipeSchema.omit({ tagIds: true })
  .extend({ tagIds: z.array(z.number().int().positive()).optional() })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field must be provided",
  });

export const GetRecipesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sortBy: z.enum(["createdAt", "cookingTime", "servings", "title"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  search: z.string().min(1).max(100).optional(),
});

export type RecipeParams = z.infer<typeof RecipeParamsSchema>;
export type CreateRecipeBody = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipeBody = z.infer<typeof UpdateRecipeSchema>;
export type GetRecipesQuery = z.infer<typeof GetRecipesQuerySchema>;
