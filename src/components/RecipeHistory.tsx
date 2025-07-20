import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { Clock, Users, ChefHat, Calendar } from "lucide-react"
import { format } from "date-fns"

interface Recipe {
  id: string
  name: string
  ingredients: string[]
  instructions: string[]
  cooking_time: string | null
  servings: string | null
  difficulty: string | null
  tips: string[] | null
  search_query: string
  created_at: string
}

interface RecipeHistoryProps {
  open: boolean
  onClose: () => void
  onSelectRecipe: (recipe: any) => void
}

export const RecipeHistory = ({ open, onClose, onSelectRecipe }: RecipeHistoryProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (open && user) {
      fetchRecipes()
    }
  }, [open, user])

  const fetchRecipes = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('get-user-recipes', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })

      if (error) throw error

      setRecipes(data.recipes || [])
    } catch (error) {
      toast({
        title: "Error loading recipes",
        description: "Failed to load your recipe history.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    const formattedRecipe = {
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cookingTime: recipe.cooking_time,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      tips: recipe.tips,
    }
    onSelectRecipe(formattedRecipe)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" />
            Your Recipe History
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-96">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-8">
              <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recipes found yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first recipe to see it here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{recipe.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(recipe.created_at), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      {recipe.difficulty && (
                        <Badge variant="outline">{recipe.difficulty}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {recipe.cooking_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {recipe.cooking_time}
                        </div>
                      )}
                      {recipe.servings && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {recipe.servings}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Search:</strong> {recipe.search_query}
                    </p>
                    <Button 
                      onClick={() => handleSelectRecipe(recipe)}
                      className="w-full"
                      size="sm"
                    >
                      View Recipe
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}