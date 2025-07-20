import { UserMenu } from "./UserMenu"

interface HeaderProps {
  onShowHistory: () => void
}

export const Header = ({ onShowHistory }: HeaderProps) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4">
      <div className="container mx-auto flex justify-end">
        <UserMenu onShowHistory={onShowHistory} />
      </div>
    </header>
  )
}