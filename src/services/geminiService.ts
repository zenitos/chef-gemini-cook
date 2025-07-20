import { GoogleGenerativeAI } from "@google/generative-ai";

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: string;
  servings?: string;
  difficulty?: string;
  tips?: string[];
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateRecipe(query: string): Promise<Recipe> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Create a detailed recipe based on: "${query}"

        Please provide a comprehensive recipe with the following structure:
        - Recipe name
        - Cooking time (e.g., "30 minutes")
        - Number of servings (e.g., "4 servings")
        - Difficulty level (Beginner/Intermediate/Advanced)
        - Complete ingredient list with measurements
        - Step-by-step cooking instructions
        - Helpful cooking tips

        Format your response as JSON with this exact structure:
        {
          "name": "Recipe Name",
          "cookingTime": "30 minutes",
          "servings": "4 servings",
          "difficulty": "Beginner",
          "ingredients": ["ingredient 1", "ingredient 2", ...],
          "instructions": ["step 1", "step 2", ...],
          "tips": ["tip 1", "tip 2", ...]
        }

        Make sure the recipe is:
        - Practical and easy to follow
        - Uses readily available ingredients
        - Includes specific measurements and cooking times
        - Contains helpful cooking techniques and tips
        - Is appropriate for home cooking

        Return only valid JSON, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up the response to ensure it's valid JSON
      let cleanedText = text.trim();
      
      // Remove any markdown code blocks
      cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Remove any leading/trailing non-JSON content
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
      }

      try {
        const recipe = JSON.parse(cleanedText);
        
        // Validate the recipe structure
        if (!recipe.name || !recipe.ingredients || !recipe.instructions) {
          throw new Error("Invalid recipe structure");
        }

        return {
          name: recipe.name || "Delicious Recipe",
          cookingTime: recipe.cookingTime || "30 minutes",
          servings: recipe.servings || "4 servings",
          difficulty: recipe.difficulty || "Beginner",
          ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
          instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
          tips: Array.isArray(recipe.tips) ? recipe.tips : []
        };
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Raw response:", text);
        
        // Fallback: extract recipe information using regex
        return this.extractRecipeFromText(text, query);
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
      throw new Error("Failed to generate recipe. Please check your API key and try again.");
    }
  }

  private extractRecipeFromText(text: string, query: string): Recipe {
    // Fallback method to extract recipe information from plain text
    const lines = text.split('\n').filter(line => line.trim());
    
    const recipe: Recipe = {
      name: `${query} Recipe`,
      ingredients: [],
      instructions: [],
      cookingTime: "30 minutes",
      servings: "4 servings",
      difficulty: "Beginner",
      tips: []
    };

    let currentSection = "";
    
    for (const line of lines) {
      const cleanLine = line.trim();
      
      if (cleanLine.toLowerCase().includes("ingredient")) {
        currentSection = "ingredients";
        continue;
      }
      
      if (cleanLine.toLowerCase().includes("instruction") || cleanLine.toLowerCase().includes("step")) {
        currentSection = "instructions";
        continue;
      }
      
      if (cleanLine.toLowerCase().includes("tip")) {
        currentSection = "tips";
        continue;
      }
      
      if (cleanLine && currentSection === "ingredients") {
        recipe.ingredients.push(cleanLine.replace(/^[-*•]\s*/, ''));
      } else if (cleanLine && currentSection === "instructions") {
        recipe.instructions.push(cleanLine.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, ''));
      } else if (cleanLine && currentSection === "tips") {
        recipe.tips.push(cleanLine.replace(/^[-*•]\s*/, ''));
      }
    }

    // If no structured data found, create a simple recipe
    if (recipe.ingredients.length === 0) {
      recipe.ingredients = ["Please check the original response for ingredients"];
    }
    
    if (recipe.instructions.length === 0) {
      recipe.instructions = ["Please check the original response for cooking instructions"];
    }

    return recipe;
  }
}