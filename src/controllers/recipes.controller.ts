import type { Request, Response } from "express";
import prisma from "../../prisma/client.ts";
import type { Prisma } from "../../generated/prisma/client.ts";
import type {
  RecipeParams,
  CreateRecipeBody,
  UpdateRecipeBody,
} from "../validators/recipe.validator.ts";

// Get all Recipes ==============================================================

export const getAllRecipes = async (_req: Request, res: Response) => {
  const recipes = await prisma.recipe.findMany({
    include: {
      category: true,
      tags: true,
    },
  });

  res.status(200).json(recipes);
};

// Get recipe by id ==============================================================

export const getRecipeById = async (
  req: Request<RecipeParams>,
  res: Response,
) => {
  const { id } = req.params;

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: id,
    },
    include: {
      category: true,
      tags: true,
      reviews: true,
    },
  });

  if (!recipe) {
    return res.status(404).json({
      error: "Recipe not found",
    });
  }

  res.status(200).json(recipe);
};

// Create recipe ==============================================================

export const createRecipe = async (
  req: Request<{}, {}, CreateRecipeBody>,
  res: Response,
) => {
  const {
    title,
    ingredients,
    instructions,
    cookingTime,
    servings,
    chefName,
    categoryId,
    tagIds,
  } = req.body;

  const recipe = await prisma.recipe.create({
    data: {
      title,
      ingredients,
      instructions,
      cookingTime,
      servings,
      chefName,
      category: {
        connect: { id: categoryId },
      },
      tags: {
        connect: tagIds?.map((id) => ({ id })),
      },
    },
    include: {
      category: true,
      tags: true,
    },
  });

  res.status(201).json(recipe);
};

// Update recipe ==============================================================

export const updateRecipe = async (
  req: Request<RecipeParams, {}, UpdateRecipeBody>,
  res: Response,
) => {
  const { id } = req.params;
  const {
    title,
    ingredients,
    instructions,
    cookingTime,
    servings,
    chefName,
    categoryId,
    tagIds,
  } = req.body;

  const updateData: Prisma.RecipeUpdateInput = {
    title,
    ingredients,
    instructions,
    cookingTime,
    servings,
    chefName,
  };

  if (categoryId !== undefined) {
    updateData.category = {
      connect: { id: categoryId },
    };
  }

  if (tagIds !== undefined) {
    updateData.tags = {
      set: tagIds.map((id) => ({ id })),
    };
  }

  const recipe = await prisma.recipe.update({
    where: { id: id },
    data: updateData,
    include: {
      category: true,
      tags: true,
    },
  });

  res.status(200).json(recipe);
};

// Delete recipe ==============================================================

export const deleteRecipe = async (
  req: Request<RecipeParams>,
  res: Response,
) => {
  const { id } = req.params;

  await prisma.recipe.delete({
    where: { id: id },
  });

  res.status(204).send();
};
