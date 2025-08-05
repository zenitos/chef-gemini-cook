
import { useState } from "react";
import { RecipeSearch } from "@/components/RecipeSearch";
import { RecipeCard } from "@/components/RecipeCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RecipeHistory } from "@/components/RecipeHistory";
import { RecipeLimitBanner } from "@/components/RecipeLimitBanner";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useRecipeLimit } from "@/hooks/useRecipeLimit";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: string;
  servings?: string;
  difficulty?: string;
  tips?: string[];
  image?: string;
}

const RecipeApp = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    usage, 
    maxRecipes, 
    remainingRecipes, 
    canGenerateRecipe, 
    incrementUsage,
    loading: limitLoading 
  } = useRecipeLimit();

  const handleSearch = async (query: string) => {
    // Check recipe limit first
    if (!canGenerateRecipe) {
      toast({
        title: "Daily Limit Reached",
        description: user 
          ? "You've used all 10 recipes for today. Try again tomorrow!" 
          : "You've used all 3 free recipes for today. Sign up for 10 recipes daily!",
        variant: "destructive",
      });
      if (!user) {
        setShowAuthModal(true);
      }
      return;
    }

    setIsLoading(true);
    setRecipe(null);

    try {
      // Use the edge function for both guests and authenticated users
      const session = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      
      // Add auth header only if user is authenticated
      if (session.data.session?.access_token) {
        headers.Authorization = `Bearer ${session.data.session.access_token}`;
      }

      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: { query },
        headers
      });

      if (error) throw error;
      setRecipe(data.recipe);

      // Increment usage count
      incrementUsage();
      
      // Show success message
      const remainingAfterGeneration = remainingRecipes - 1;
      const message = user 
        ? `Found a delicious recipe! ${remainingAfterGeneration} recipes remaining today.`
        : remainingAfterGeneration > 0 
          ? `Found a delicious recipe! ${remainingAfterGeneration} free recipes remaining today.`
          : "Found a delicious recipe! Sign up for 10 recipes daily instead of 3!";
      
      toast({
        title: "Recipe Generated!",
        description: message,
      });

    } catch (error) {
      console.error("Error generating recipe:", error);
      
      // Check if it's a validation error (400 status)
      const errorMessage = error?.message || "Failed to generate recipe. Please try again.";
      
      toast({
        title: errorMessage.includes("food-related") ? "Invalid Input" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onShowHistory={() => setShowHistory(true)} />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Recipe Limit Banner */}
          {!limitLoading && (
            <div className="animate-slide-up">
              <RecipeLimitBanner
                usage={usage}
                maxRecipes={maxRecipes}
                remainingRecipes={remainingRecipes}
                onSignUp={() => setShowAuthModal(true)}
              />
            </div>
          )}

          {/* Search Section */}
          <div className="animate-slide-up">
            <RecipeSearch 
              onSearch={handleSearch} 
              isLoading={isLoading}
              canGenerate={canGenerateRecipe}
              remainingRecipes={remainingRecipes}
            />
          </div>

          {/* Recipe Display */}
          {recipe && (
            <div className="animate-fade-in">
              <RecipeCard recipe={recipe} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      <RecipeHistory 
        open={showHistory} 
        onClose={() => setShowHistory(false)} 
        onSelectRecipe={setRecipe}
      />
      
      <AuthModal 
        open={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default RecipeApp;
