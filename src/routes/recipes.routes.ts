import express from "express";
import * as recipesController from "../controllers/recipes.controller.ts";

const router = express.Router();

router.get("/", recipesController.getAllRecipes);
router.get("/:id", recipesController.getRecipeById);
router.post("/", recipesController.createRecipe);
router.patch("/:id", recipesController.updateRecipe);
router.delete("/:id", recipesController.deleteRecipe);

export default router;