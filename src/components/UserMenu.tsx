import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { User, LogOut, History, ChefHat, Settings } from "lucide-react"
import { AuthModal } from "./AuthModal"

interface UserMenuProps {
  onShowHistory: () => void
}

export const UserMenu = ({ onShowHistory }: UserMenuProps) => {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out successfully",
        description: "You've been logged out. You can still generate 3 free recipes daily!",
      })
      // Reload the page to reset all state and redirect to home
      window.location.href = "/"
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <>
        <Button onClick={() => setShowAuthModal(true)} variant="outline">
          <User className="w-4 h-4 mr-2" />
          Sign In
        </Button>
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">
            {user.user_metadata?.full_name || user.email}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <Settings className="w-4 h-4 mr-2" />
          User Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShowHistory}>
          <History className="w-4 h-4 mr-2" />
          Recipe History
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}