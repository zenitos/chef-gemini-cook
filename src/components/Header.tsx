import { UserMenu } from "./UserMenu"
import { Link } from "react-router-dom"
import { ChefHat } from "lucide-react"

interface HeaderProps {
  onShowHistory: () => void
}

export const Header = ({ onShowHistory }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary/80 transition-colors"
        >
          <ChefHat className="h-6 w-6" />
          <span>Recipefy</span>
        </Link>

        {/* User Menu */}
        <UserMenu onShowHistory={onShowHistory} />
      </div>
    </header>
  )
}