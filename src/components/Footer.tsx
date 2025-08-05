import { Sparkles, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Logo and Description */}
          <div className="flex flex-col gap-2">
            <Link 
              to="/" 
              className="flex items-center gap-2 font-bold text-lg text-primary hover:text-primary/80 transition-colors"
            >
              <ChefHat className="h-5 w-5" />
              <span>Recipefy</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Discover delicious recipes powered by AI. Create amazing meals with ingredients you have at home.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-sm">Quick Links</h4>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link to="/app" className="hover:text-foreground transition-colors">Recipe Generator</Link>
            </div>
          </div>

          {/* AI Attribution */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-golden" />
              <span>Powered by Google Gemini AI</span>
            </div>
            <p className="text-muted-foreground text-xs">
              © 2024 Recipefy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};