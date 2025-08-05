
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, Utensils, Clock, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/cooking-hero.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-primary" />
          <span className="text-2xl font-heading font-bold">Recipefy</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/app" className="text-muted-foreground hover:text-foreground transition-colors">
            Generate Recipe
          </Link>
          <Button asChild>
            <Link to="/app">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="h-[80vh] bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
          <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <ChefHat className="w-16 h-16 text-white" />
                <h1 className="text-6xl md:text-7xl font-heading font-bold text-white">
                  Recipefy
                </h1>
                <Sparkles className="w-16 h-16 text-golden animate-bounce-gentle" />
              </div>
              
              <h2 className="text-2xl md:text-4xl font-semibold text-white/95 max-w-4xl mx-auto leading-relaxed">
                Transform Any Ingredient Into a 
                <span className="text-golden"> Culinary Masterpiece</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Powered by advanced AI, Recipefy turns your ingredients, cravings, or dietary preferences 
                into personalized, step-by-step recipes that make cooking an adventure.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-warm hover:shadow-warm transition-all duration-300">
                  <Link to="/app" className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    Start Cooking Magic
                  </Link>
                </Button>
                <div className="text-white/70 text-sm">
                  3 free recipes daily • No signup required
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Why Choose Recipefy?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of cooking with AI-powered recipe generation that understands your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="group text-center p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-warm transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-warm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">AI-Powered Intelligence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our advanced AI analyzes your ingredients, dietary restrictions, and preferences to create perfectly tailored recipes just for you.
              </p>
            </div>
            
            <div className="group text-center p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-warm transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-fresh rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-10 h-10 text-soft-green" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Instant Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get detailed recipes with cooking times, difficulty levels, and step-by-step instructions in seconds, not hours of searching.
              </p>
            </div>
            
            <div className="group text-center p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-warm transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-spice-red/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Utensils className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Global Cuisines</h3>
              <p className="text-muted-foreground leading-relaxed">
                Explore recipes from every corner of the world. From Italian pasta to Thai curries, discover new flavors and cooking techniques.
              </p>
            </div>
            
            <div className="group text-center p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-warm transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-golden to-warm-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Dietary Friendly</h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're vegan, keto, gluten-free, or have other dietary needs, our AI creates recipes that fit your lifestyle perfectly.
              </p>
            </div>
            
            <div className="group text-center p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-warm transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-soft-green to-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Family Portions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cooking for one or feeding a crowd? Our recipes automatically scale to serve exactly the number of people you need.
              </p>
            </div>
            
            <div className="group text-center p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-warm transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-spice-red to-golden rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChefHat className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Expert Tips</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every recipe comes with professional cooking tips, techniques, and tricks to help you cook like a chef from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From ingredients to incredible meals in three simple steps
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-warm rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Tell Us What You Have</h3>
                <p className="text-muted-foreground">
                  Enter your ingredients, dietary preferences, or describe what you're craving. Be as specific or general as you like.
                </p>
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
              </div>
              
              <div className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-fresh rounded-full flex items-center justify-center text-soft-green text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">AI Creates Your Recipe</h3>
                <p className="text-muted-foreground">
                  Our intelligent AI analyzes your input and generates a personalized recipe with detailed instructions and cooking tips.
                </p>
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-spice-red/80 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Start Cooking!</h3>
                <p className="text-muted-foreground">
                  Follow the step-by-step instructions, use our helpful tips, and create amazing meals that wow your family and friends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-golden/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-heading font-bold">
              Ready to Transform Your Cooking?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of home cooks who've discovered the joy of AI-powered recipe creation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-warm hover:shadow-warm transition-all duration-300">
                <Link to="/app" className="flex items-center gap-3">
                  <ChefHat className="w-5 h-5" />
                  Start Your Culinary Journey
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Free to start • 3 recipes daily • Premium plans available
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-primary" />
              <span className="text-xl font-heading font-bold">Recipefy</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Recipefy. Transforming ingredients into culinary magic.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
