import { useState } from "react";
import { RecipeSearch } from "@/components/RecipeSearch";
import { RecipeCard } from "@/components/RecipeCard";
import { Footer } from "@/components/Footer";
import { GeminiService } from "@/services/geminiService";
import { useToast } from "@/hooks/use-toast";
import { ChefHat, Sparkles } from "lucide-react";
import heroImage from "@/assets/cooking-hero.jpg";

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: string;
  servings?: string;
  difficulty?: string;
  tips?: string[];
}

const Index = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (query: string, apiKey: string) => {
    setIsLoading(true);
    setRecipe(null);

    try {
      const geminiService = new GeminiService(apiKey);
      const generatedRecipe = await geminiService.generateRecipe(query);
      setRecipe(generatedRecipe);
      
      toast({
        title: "Recipe Generated!",
        description: `Found a delicious recipe for ${generatedRecipe.name}`,
      });
    } catch (error) {
      console.error("Error generating recipe:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-[60vh] bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
          <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ChefHat className="w-12 h-12 text-white" />
                <h1 className="text-5xl md:text-6xl font-heading font-bold text-white">
                  Recipefy
                </h1>
                <Sparkles className="w-12 h-12 text-golden animate-bounce-gentle" />
              </div>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                Transform any ingredient or craving into a personalized recipe with the power of AI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Search Section */}
        <div className="animate-slide-up">
          <RecipeSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Recipe Display */}
        {recipe && (
          <div className="animate-fade-in">
            <RecipeCard recipe={recipe} />
          </div>
        )}

        {/* Features Section */}
        {!recipe && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-card border border-border shadow-soft">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-warm rounded-full flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Recipe Generation</h3>
              <p className="text-muted-foreground">
                AI analyzes your ingredients and preferences to create perfect recipes
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-card border border-border shadow-soft">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-fresh rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-soft-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Instructions</h3>
              <p className="text-muted-foreground">
                Step-by-step cooking instructions with timing and helpful tips
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-card border border-border shadow-soft">
              <div className="w-16 h-16 mx-auto mb-4 bg-spice-red/80 rounded-full flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cuisine Variety</h3>
              <p className="text-muted-foreground">
                Explore recipes from different cuisines and cooking styles
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;
