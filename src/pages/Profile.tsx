import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { RecipeHistory } from "@/components/RecipeHistory"
import { useAuth } from "@/hooks/useAuth"
import { useRecipeLimit } from "@/hooks/useRecipeLimit"
import { useToast } from "@/hooks/use-toast"
import { ProfileService, UserProfile } from "@/services/profileService"
import { RecipeService } from "@/services/recipeService"
import { User, Calendar, ChefHat, History, LogOut, ArrowLeft, Edit2, Save, X, TrendingUp } from "lucide-react"
import { format } from "date-fns"

const Profile = () => {
  const { user, signOut } = useAuth()
  const { usage, maxRecipes, remainingRecipes } = useRecipeLimit()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showHistory, setShowHistory] = useState(false)
  const [signOutLoading, setSignOutLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editedName, setEditedName] = useState("")
  const [recipeStats, setRecipeStats] = useState({
    totalRecipes: 0,
    recipesThisWeek: 0,
    recipesThisMonth: 0,
    favoriteIngredients: []
  })
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/")
    } else {
      loadUserData()
    }
  }, [user, navigate])

  const loadUserData = async () => {
    if (!user) return
    
    setLoadingProfile(true)
    try {
      // Load user profile
      const userProfile = await ProfileService.getUserProfile()
      setProfile(userProfile)
      setEditedName(userProfile?.full_name || "")

      // Load recipe statistics
      const stats = await RecipeService.getRecipeStats()
      setRecipeStats(stats)
    } catch (error) {
      console.error("Error loading user data:", error)
      toast({
        title: "Error loading profile",
        description: "Failed to load your profile data.",
        variant: "destructive",
      })
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleSignOut = async () => {
    setSignOutLoading(true)
    try {
      await signOut()
      toast({
        title: "Signed out successfully",
        description: "You've been logged out. You can still generate 3 free recipes!",
      })
      navigate("/")
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSignOutLoading(false)
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
    setEditedName(profile?.full_name || "")
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const updatedProfile = await ProfileService.updateProfile({
        full_name: editedName.trim() || null
      })
      setProfile(updatedProfile)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedName(profile?.full_name || "")
  }

  if (!user) {
    return null
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header onShowHistory={() => setShowHistory(true)} />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onShowHistory={() => setShowHistory(true)} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Recipes
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-2xl">
                      {profile?.full_name || user.user_metadata?.full_name || "Recipe Chef"}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {user.email}
                    </CardDescription>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  Premium Member
                </Badge>
                {isEditing ? (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                    >
                      {savingProfile ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={savingProfile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEditProfile}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Account Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Recipes
                </CardTitle>
                <ChefHat className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recipeStats.totalRecipes}</div>
                <p className="text-xs text-muted-foreground">
                  recipes saved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Recipes Today
                </CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usage}</div>
                <p className="text-xs text-muted-foreground">
                  out of {maxRecipes} daily limit
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Week
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {recipeStats.recipesThisWeek}
                </div>
                <p className="text-xs text-muted-foreground">
                  recipes created
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Remaining Today
                </CardTitle>
                <User className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {remainingRecipes}
                </div>
                <p className="text-xs text-muted-foreground">
                  recipes left
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p className="text-sm">
                    {profile?.full_name || user.user_metadata?.full_name || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Account Type
                  </label>
                  <p className="text-sm">Premium (10 recipes/day)</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Sign In
                  </label>
                  <p className="text-sm">
                    {user.last_sign_in_at 
                      ? format(new Date(user.last_sign_in_at), "MMM dd, yyyy 'at' HH:mm")
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </label>
                  <p className="text-sm">
                    {format(new Date(user.created_at), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Recipes This Month
                  </label>
                  <p className="text-sm">
                    {recipeStats.recipesThisMonth} recipes created
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your recipes and account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setShowHistory(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  View Recipe History
                </Button>
                <Button 
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2"
                >
                  <ChefHat className="w-4 h-4" />
                  Generate New Recipe
                </Button>
              </div>
              
              <Separator />
              
              <div className="pt-4">
                <Button 
                  onClick={handleSignOut}
                  variant="destructive"
                  disabled={signOutLoading}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {signOutLoading ? "Signing out..." : "Sign Out"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
      
      <RecipeHistory 
        open={showHistory} 
        onClose={() => setShowHistory(false)} 
        onSelectRecipe={() => {
          setShowHistory(false)
          navigate("/")
        }}
      />
    </div>
  )
}

export default Profile