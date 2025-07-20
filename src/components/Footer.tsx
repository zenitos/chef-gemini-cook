import { Sparkles } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm">
              © 2024 Recipefy. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-golden" />
            <span>Powered by Google Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};