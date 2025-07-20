import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Sparkles, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RecipeSearchProps {
  onSearch: (query: string, apiKey: string) => void;
  isLoading: boolean;
}

export const RecipeSearch = ({ onSearch, isLoading }: RecipeSearchProps) => {
  const [query, setQuery] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    const savedApiKey = localStorage.getItem("gemini-api-key");
    if (!savedApiKey && !apiKey.trim()) {
      setShowApiKeyInput(true);
      return;
    }

    const keyToUse = apiKey.trim() || savedApiKey;
    if (apiKey.trim()) {
      localStorage.setItem("gemini-api-key", apiKey.trim());
    }
    
    onSearch(query, keyToUse);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-soft">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              What would you like to cook today?
            </h2>
            <p className="text-muted-foreground">
              Enter ingredients, dish names, or cuisine types to get personalized recipes
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="e.g., chicken breast and vegetables, pasta carbonara, Thai curry..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-base border-2 border-border/50 focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="h-12 px-6 bg-gradient-warm hover:shadow-warm transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Cooking...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Get Recipe
                </div>
              )}
            </Button>
          </div>

          {showApiKeyInput && (
            <Alert className="border-spice-red/20 bg-spice-red/5">
              <AlertCircle className="h-4 w-4 text-spice-red" />
              <AlertDescription className="text-spice-red">
                <div className="space-y-3">
                  <p>Please enter your Google Gemini API key to get recipes:</p>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="Enter your Gemini API key..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSearch}
                      disabled={!apiKey.trim() || !query.trim()}
                      size="sm"
                    >
                      Save & Search
                    </Button>
                  </div>
                  <p className="text-xs">
                    Get your API key from{" "}
                    <a 
                      href="https://makersuite.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-primary"
                    >
                      Google AI Studio
                    </a>
                    . For better security, consider integrating with Supabase.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Chicken stir-fry",
              "Vegetarian pasta",
              "Salmon with quinoa",
              "Thai green curry",
              "Mediterranean salad",
              "Beef tacos"
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setQuery(suggestion)}
                className="text-xs hover:bg-accent hover:text-accent-foreground transition-colors"
                disabled={isLoading}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};