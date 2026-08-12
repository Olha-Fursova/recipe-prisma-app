import { z } from "zod";

export const TagParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const CreateTagSchema = z.object({
  name: z.string().min(2).max(30),
});

export const UpdateTagSchema = CreateTagSchema;

export type TagParams = z.infer<typeof TagParamsSchema>;
export type CreateTagBody = z.infer<typeof CreateTagSchema>;
export type UpdateTagBody = z.infer<typeof UpdateTagSchema>;
