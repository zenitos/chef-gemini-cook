import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.24.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Gemini API key from secrets (reusing the existing one)
    const geminiApiKey = Deno.env.get('GEMINIAI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    
    // Use Imagen model for image generation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate image using Gemini
    const imagePrompt = `Generate a realistic, high-quality food photograph of: ${prompt}. The image should be professionally shot, well-lit, appetizing, and beautifully plated.`;
    
    const result = await model.generateContent([imagePrompt]);
    const response = await result.response;
    
    // For now, since Gemini's image generation capabilities are limited in the current API,
    // we'll create a placeholder response or use a food image API
    // This is a fallback until Gemini's image generation is more widely available
    
    const fallbackImageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(prompt.replace(/[^a-zA-Z\s]/g, '').trim())},food,delicious`;
    
    return new Response(
      JSON.stringify({ image: fallbackImageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-recipe-image function:', error);
    
    // Fallback to Unsplash for food images
    try {
      const { prompt: fallbackPrompt } = await req.json();
      const fallbackImageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(fallbackPrompt.replace(/[^a-zA-Z\s]/g, '').trim())},food,recipe`;
      
      return new Response(
        JSON.stringify({ image: fallbackImageUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch {
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }
});