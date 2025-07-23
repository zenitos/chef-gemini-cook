import { supabase } from "@/integrations/supabase/client";

export interface Recipe {
  id?: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  cooking_time?: string;
  servings?: string;
  difficulty?: string;
  tips?: string[];
  search_query: string;
  created_at?: string;
  user_id?: string;
}

// Database row type (what comes from Supabase)
interface RecipeRow {
  id: string;
  name: string;
  ingredients: any; // JSON field
  instructions: any; // JSON field
  cooking_time: string | null;
  servings: string | null;
  difficulty: string | null;
  tips: any | null; // JSON field
  search_query: string;
  created_at: string;
  user_id: string;
}

// Helper function to convert database row to Recipe interface
function convertRowToRecipe(row: RecipeRow): Recipe {
  return {
    id: row.id,
    name: row.name,
    ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    instructions: Array.isArray(row.instructions) ? row.instructions : [],
    cooking_time: row.cooking_time || undefined,
    servings: row.servings || undefined,
    difficulty: row.difficulty || undefined,
    tips: Array.isArray(row.tips) ? row.tips : undefined,
    search_query: row.search_query,
    created_at: row.created_at,
    user_id: row.user_id,
  };
}

export class RecipeService {
  /**
   * Get all recipes for the current authenticated user
   */
  static async getUserRecipes(): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recipes:', error);
      throw new Error('Failed to fetch recipes');
    }

    return (data || []).map(convertRowToRecipe);
  }

  /**
   * Get a specific recipe by ID
   */
  static async getRecipeById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching recipe:', error);
      return null;
    }

    return data ? convertRowToRecipe(data) : null;
  }

  /**
   * Save a new recipe for the authenticated user
   */
  static async saveRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'user_id'>): Promise<Recipe> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to save recipes');
    }

    const { data, error } = await supabase
      .from('recipes')
      .insert([
        {
          ...recipe,
          user_id: user.id,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving recipe:', error);
      throw new Error('Failed to save recipe');
    }

    return convertRowToRecipe(data);
  }

  /**
   * Update an existing recipe
   */
  static async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating recipe:', error);
      throw new Error('Failed to update recipe');
    }

    return convertRowToRecipe(data);
  }

  /**
   * Delete a recipe
   */
  static async deleteRecipe(id: string): Promise<void> {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting recipe:', error);
      throw new Error('Failed to delete recipe');
    }
  }

  /**
   * Search recipes by name or ingredients
   */
  static async searchRecipes(query: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .or(`name.ilike.%${query}%,search_query.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching recipes:', error);
      throw new Error('Failed to search recipes');
    }

    return (data || []).map(convertRowToRecipe);
  }

  /**
   * Get recipe statistics for the user
   */
  static async getRecipeStats(): Promise<{
    totalRecipes: number;
    recipesThisWeek: number;
    recipesThisMonth: number;
    favoriteIngredients: string[];
  }> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get total recipes
    const { count: totalRecipes } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true });

    // Get recipes this week
    const { count: recipesThisWeek } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString());

    // Get recipes this month
    const { count: recipesThisMonth } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthAgo.toISOString());

    return {
      totalRecipes: totalRecipes || 0,
      recipesThisWeek: recipesThisWeek || 0,
      recipesThisMonth: recipesThisMonth || 0,
      favoriteIngredients: [], // Can be implemented later with more complex logic
    };
  }
}