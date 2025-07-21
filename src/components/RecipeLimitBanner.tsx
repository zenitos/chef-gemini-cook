import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Crown, Clock, User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface RecipeLimitBannerProps {
  usage: number
  maxRecipes: number
  remainingRecipes: number
  onSignUp?: () => void
}

export const RecipeLimitBanner = ({ 
  usage, 
  maxRecipes, 
  remainingRecipes, 
  onSignUp 
}: RecipeLimitBannerProps) => {
  const { user } = useAuth()
  const progressPercentage = (usage / maxRecipes) * 100

  return (
    <Card className="w-full max-w-4xl mx-auto mb-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {user ? (
              <Crown className="w-6 h-6 text-yellow-500" />
            ) : (
              <User className="w-6 h-6 text-muted-foreground" />
            )}
            <div>
              <h3 className="font-semibold text-lg">
                {user ? 'Premium Account' : 'Guest User'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {remainingRecipes} of {maxRecipes} recipes remaining today
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="min-w-[120px]">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Daily Limit</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2"
              />
            </div>

            {!user && remainingRecipes > 0 && (
              <Button 
                onClick={onSignUp}
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to 10/day
              </Button>
            )}

            {remainingRecipes === 0 && (
              <div className="text-right">
                <p className="text-sm font-medium text-orange-600">Limit Reached</p>
                <p className="text-xs text-muted-foreground">
                  {user ? 'Try again tomorrow' : 'Sign up for more recipes'}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}