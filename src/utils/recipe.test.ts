import { describe, it, expect } from 'vitest';
import { scaleQuantity, validateRecipe } from './recipe';
import type { RecipePayload } from '../types/recipe';
const draft: RecipePayload = { title: 'Test', description: '', servings: 2, prepTime: 5, cookTime: 0, status:'draft',tags:[], ingredients:[], steps:[] };
describe('recipe domain', () => {
 it('scales an ingredient', () => expect(scaleQuantity(125, 2, 4)).toBe(250));
 it('allows a minimal draft', () => expect(validateRecipe(draft, 'draft')).toEqual({}));
 it('blocks incomplete publication', () => expect(validateRecipe(draft, 'published')).toHaveProperty('ingredients'));
});
