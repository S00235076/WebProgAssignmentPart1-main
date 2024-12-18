import express, {Router} from 'express';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  
} from '../controllers/recipes';

import { authenticateKey } from '../middleware/auth.middleware';

const router: Router = express.Router();

router.get('/', getRecipes);
router.get('/:id',  getRecipeById);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);
export default router;