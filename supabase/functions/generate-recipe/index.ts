import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.24.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: string;
  servings?: string;
  difficulty?: string;
  tips?: string[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get request body
    const { query } = await req.json()
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Gemini API key from secrets
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Create a detailed recipe based on: "${query}". 
    
    Please respond with a JSON object in this exact format:
    {
      "name": "Recipe Name",
      "ingredients": ["ingredient 1", "ingredient 2", ...],
      "instructions": ["step 1", "step 2", ...],
      "cookingTime": "X minutes",
      "servings": "X people",
      "difficulty": "Easy/Medium/Hard",
      "tips": ["tip 1", "tip 2", ...]
    }
    
    Make sure the recipe is practical, detailed, and includes cooking times and serving information.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean and parse the JSON response
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
    let recipe: Recipe
    
    try {
      recipe = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
      return new Response(
        JSON.stringify({ error: 'Failed to parse recipe response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Save recipe to database
    const { error: insertError } = await supabaseClient
      .from('recipes')
      .insert({
        user_id: user.id,
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cooking_time: recipe.cookingTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        tips: recipe.tips,
        search_query: query,
      })

    if (insertError) {
      console.error('Failed to save recipe:', insertError)
      // Still return the recipe even if saving fails
    }

    return new Response(
      JSON.stringify({ recipe }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-recipe function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})