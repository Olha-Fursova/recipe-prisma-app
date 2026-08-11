import type { Request, Response } from "express";
import prisma from "../../prisma/client.ts";

// Models ==============================================================

type TagParams = {
  id: string;
};

type CreateTagBody = {
  name: string;
};

type UpdateTagBody = Partial<CreateTagBody>;

// GET all tags ==============================================================

export const getAllTags = async (_req: Request, res: Response) => {
  const tags = await prisma.tag.findMany();
  res.status(200).json(tags);
};

// Get tag by id ==============================================================

export const getTagById = async (req: Request<TagParams>, res: Response) => {
  const { id } = req.params;

  const tag = await prisma.tag.findUnique({
    where: { id: parseInt(id) },
    include: { recipes: true },
  });

  if (!tag) {
    return res.status(404).json({ error: "Tag not found" });
  }

  res.status(200).json(tag);
};

// Create tag ==============================================================

export const createTag = async (
  req: Request<{}, {}, CreateTagBody>,
  res: Response,
) => {
  const { name } = req.body;

  const tag = await prisma.tag.create({
    data: { name },
  });

  res.status(201).json(tag);
};

// Update tag ==============================================================

export const updateTag = async (
  req: Request<TagParams, {}, UpdateTagBody>,
  res: Response,
) => {
  const { id } = req.params;
  const { name } = req.body;

  const tag = await prisma.tag.update({
    where: { id: parseInt(id) },
    data: { name },
  });

  res.status(200).json(tag);
};

// Delete tag ==============================================================

export const deleteTag = async (req: Request<TagParams>, res: Response) => {
  const { id } = req.params;

  await prisma.tag.delete({
    where: { id: parseInt(id) },
  });

  res.status(204).send();
};
