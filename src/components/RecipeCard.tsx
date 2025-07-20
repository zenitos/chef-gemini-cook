import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat } from "lucide-react";

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: string;
  servings?: string;
  difficulty?: string;
  tips?: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-soft animate-fade-in">
      <CardHeader className="bg-gradient-warm text-primary-foreground rounded-t-lg">
        <CardTitle className="text-2xl font-heading flex items-center gap-2">
          <ChefHat className="w-6 h-6" />
          {recipe.name}
        </CardTitle>
        <div className="flex gap-4 text-sm opacity-90">
          {recipe.cookingTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.cookingTime}
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {recipe.servings}
            </div>
          )}
          {recipe.difficulty && (
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {recipe.difficulty}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Ingredients Section */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">Ingredients</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recipe.ingredients.map((ingredient, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg bg-accent/50 transition-colors hover:bg-accent"
              >
                <div className="w-2 h-2 rounded-full bg-warm-orange"></div>
                <span className="text-sm">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Section */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">Instructions</h3>
          <div className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <div 
                key={index} 
                className="flex gap-3 p-4 rounded-lg bg-card border border-border transition-all hover:shadow-soft"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-warm text-white flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Cooking Tips</h3>
            <div className="space-y-2">
              {recipe.tips.map((tip, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-lg bg-soft-green/20 border border-soft-green/30"
                >
                  <p className="text-sm text-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};