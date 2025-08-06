import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FeedbackModal } from "@/components/FeedbackModal"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { ProfileService, UserProfile } from "@/services/profileService"
import { User, Mail, MapPin, Save } from "lucide-react"

const Profile = () => {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editedName, setEditedName] = useState("")
  const [editedAddress, setEditedAddress] = useState("")
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate("/")
    } else if (user) {
      loadUserData()
    }
  }, [user, loading, navigate])

  const loadUserData = async () => {
    if (!user) return
    
    setLoadingProfile(true)
    try {
      const userProfile = await ProfileService.getUserProfile()
      setProfile(userProfile)
      setEditedName(userProfile?.full_name || "")
      setEditedAddress(userProfile?.address || "")
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

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const updatedProfile = await ProfileService.updateProfile({
        full_name: editedName.trim() || null,
        address: editedAddress.trim() || null
      })
      setProfile(updatedProfile)
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

  if (!user) {
    return null
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header onShowHistory={() => {}} />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
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
      <Header onShowHistory={() => {}} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="rounded-3xl border border-border/50 shadow-lg bg-card">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold">User Profile</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Email Address */}
            <div className="space-y-2">
              <Label className="text-base font-medium text-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <div className="pl-11 py-3 px-4 bg-muted/30 rounded-2xl border border-border/30 text-muted-foreground">
                  {user.email}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-base font-medium text-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="full-name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-11 py-3 rounded-2xl border-border/30 bg-background"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-base font-medium text-foreground">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="address"
                  value={editedAddress}
                  onChange={(e) => setEditedAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="pl-11 py-3 rounded-2xl border-border/30 bg-background"
                />
              </div>
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium"
            >
              {savingProfile ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Changes
                </div>
              )}
            </Button>

            {/* Feedback */}
            <div className="pt-4 border-t border-border/30">
              <FeedbackModal>
                <Button variant="outline" className="w-full py-3 rounded-2xl">
                  Send Feedback
                </Button>
              </FeedbackModal>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

export default Profile