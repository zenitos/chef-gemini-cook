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
  image?: string;
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

    // Get the authenticated user (optional for guests)
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    // Allow both authenticated users and guests
    const isGuest = userError || !user

    // Get request body
    const { query } = await req.json()
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Gemini API key from secrets
    const geminiApiKey = Deno.env.get('GEMINIAI_API_KEY')
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // First, validate if the input is food-related
    const validationPrompt = `Analyze this input: "${query}". 
    
    Determine if this input is related to food, cooking, recipes, ingredients, cuisine types, or culinary topics. 
    
    Respond with ONLY "VALID" if the input is food-related, or "INVALID" if it contains non-food items or is completely unrelated to cooking/food.
    
    Examples of VALID inputs: "chicken curry", "pasta", "Italian cuisine", "tomatoes and garlic", "chocolate cake recipe"
    Examples of INVALID inputs: "cars", "programming", "football", "mathematics", "vacation planning"`

    const validationResult = await model.generateContent(validationPrompt)
    const validationResponse = await validationResult.response
    const validationText = validationResponse.text().trim()

    if (validationText !== "VALID") {
      return new Response(
        JSON.stringify({ 
          error: "Please enter food-related items only. Try ingredients, recipe names, food types, or cuisine styles (e.g., 'chicken curry', 'Italian pasta', 'chocolate cake')." 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    // Generate image of the prepared recipe
    try {
      const imagePrompt = `A beautiful, appetizing photo of ${recipe.name}, professionally plated and photographed, high quality food photography, well-lit, attractive presentation`
      
      const { data: imageData, error: imageError } = await supabaseClient.functions.invoke('generate-recipe-image', {
        body: { prompt: imagePrompt }
      })

      if (!imageError && imageData?.image) {
        recipe.image = imageData.image
      }
    } catch (imageError) {
      console.error('Failed to generate recipe image:', imageError)
      // Continue without image if generation fails
    }

    // Save recipe to database (only for authenticated users)
    if (!isGuest && user) {
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
          image: recipe.image,
        })

      if (insertError) {
        console.error('Failed to save recipe:', insertError)
        // Still return the recipe even if saving fails
      }
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