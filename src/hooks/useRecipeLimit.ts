import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

interface RecipeUsage {
  date: string
  count: number
}

export const useRecipeLimit = () => {
  const { user } = useAuth()
  const [usage, setUsage] = useState<RecipeUsage>({ date: '', count: 0 })
  const [loading, setLoading] = useState(true)

  const today = new Date().toDateString()
  const maxRecipes = user ? 10 : 1 // 10 for logged-in users, 1 for guests
  const remainingRecipes = Math.max(0, maxRecipes - usage.count)
  const canGenerateRecipe = remainingRecipes > 0

  useEffect(() => {
    const loadUsage = () => {
      const storageKey = user ? `recipe_usage_${user.id}` : 'recipe_usage_guest'
      const stored = localStorage.getItem(storageKey)
      
      if (stored) {
        const parsedUsage = JSON.parse(stored)
        if (parsedUsage.date === today) {
          setUsage(parsedUsage)
        } else {
          // Reset for new day
          const newUsage = { date: today, count: 0 }
          setUsage(newUsage)
          localStorage.setItem(storageKey, JSON.stringify(newUsage))
        }
      } else {
        const newUsage = { date: today, count: 0 }
        setUsage(newUsage)
        localStorage.setItem(storageKey, JSON.stringify(newUsage))
      }
      
      setLoading(false)
    }

    // Always reload usage when user changes (including login/logout)
    setLoading(true)
    loadUsage()
  }, [user, today])

  const incrementUsage = () => {
    const storageKey = user ? `recipe_usage_${user.id}` : 'recipe_usage_guest'
    const newUsage = { date: today, count: usage.count + 1 }
    setUsage(newUsage)
    localStorage.setItem(storageKey, JSON.stringify(newUsage))
  }

  const resetUsage = () => {
    const storageKey = user ? `recipe_usage_${user.id}` : 'recipe_usage_guest'
    const newUsage = { date: today, count: 0 }
    setUsage(newUsage)
    localStorage.setItem(storageKey, JSON.stringify(newUsage))
  }

  return {
    usage: usage.count,
    maxRecipes,
    remainingRecipes,
    canGenerateRecipe: remainingRecipes > 0,
    isLastFreeRecipe: !user && remainingRecipes === 1, // Show signup prompt on last guest recipe
    incrementUsage,
    resetUsage,
    loading
  }
}