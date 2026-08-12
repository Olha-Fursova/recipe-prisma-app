import { z } from "zod";

export const CategoryParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { error: "At least one field must be provided" },
);

export type CategoryParams = z.infer<typeof CategoryParamsSchema>;
export type CreateCategoryBody = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryBody = z.infer<typeof UpdateCategorySchema>;
