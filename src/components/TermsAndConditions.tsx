import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Shield, Brain, Cookie } from "lucide-react"

export const TermsAndConditions = () => {
  return (
    <ScrollArea className="h-96 w-full">
      <div className="space-y-6 p-4">
        {/* AI Compliance Policy */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-primary" />
              AI Compliance Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>AI-Generated Content:</strong> All recipes are generated using artificial intelligence (Google Gemini AI). While we strive for accuracy, AI-generated content may contain errors or inaccuracies.
            </p>
            <p>
              <strong>Verification Required:</strong> Users must verify all ingredients, measurements, and cooking instructions before use. We recommend cross-referencing with trusted culinary sources.
            </p>
            <p>
              <strong>No Guarantee:</strong> We do not guarantee the safety, accuracy, or suitability of AI-generated recipes for any specific dietary needs or restrictions.
            </p>
          </CardContent>
        </Card>

        {/* Food Safety & Allergy Warning */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              Food Safety & Allergy Warning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-semibold text-orange-700">
              ⚠️ IMPORTANT: This service does not account for food allergies, dietary restrictions, or medical conditions.
            </p>
            <p>
              <strong>Allergy Responsibility:</strong> Users with food allergies must carefully review all ingredients and verify they are safe for consumption. Common allergens include but are not limited to: nuts, dairy, eggs, soy, gluten, shellfish, and fish.
            </p>
            <p>
              <strong>Dietary Restrictions:</strong> If you have dietary restrictions (vegetarian, vegan, kosher, halal, etc.) or medical conditions (diabetes, celiac disease, etc.), consult with healthcare professionals before following any recipes.
            </p>
            <p>
              <strong>Food Safety:</strong> Always follow proper food safety guidelines including proper cooking temperatures, storage, and handling procedures.
            </p>
          </CardContent>
        </Card>

        {/* GDPR & Privacy */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-green-600" />
              Privacy & Data Protection (GDPR)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Data Collection:</strong> We collect and process personal data including email addresses, recipe searches, and usage patterns to provide our services.
            </p>
            <p>
              <strong>Legal Basis:</strong> Processing is based on your consent and our legitimate interest in providing personalized recipe services.
            </p>
            <p>
              <strong>Your Rights:</strong> Under GDPR, you have the right to access, rectify, erase, restrict processing, data portability, and to object to processing of your personal data.
            </p>
            <p>
              <strong>Data Retention:</strong> Personal data is retained for as long as necessary to provide services or as required by law.
            </p>
            <p>
              <strong>Third Parties:</strong> We use Google Gemini AI for recipe generation and Supabase for data storage. Both services comply with GDPR requirements.
            </p>
            <p>
              <strong>Cookies:</strong> We use essential cookies and local storage to maintain your session and track usage limits.
            </p>
          </CardContent>
        </Card>

        {/* General Terms */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cookie className="w-5 h-5 text-blue-600" />
              Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Service Limits:</strong> Free users can generate up to 3 recipes per day. Registered users can generate up to 10 recipes per day.
            </p>
            <p>
              <strong>Acceptable Use:</strong> You agree to use this service only for personal, non-commercial purposes and not to abuse or overload our systems.
            </p>
            <p>
              <strong>Liability:</strong> We are not liable for any damages, injuries, or adverse effects resulting from the use of AI-generated recipes.
            </p>
            <p>
              <strong>Changes:</strong> We reserve the right to modify these terms at any time. Continued use constitutes acceptance of modified terms.
            </p>
            <p>
              <strong>Contact:</strong> For questions about these terms or to exercise your rights, please contact us through our support channels.
            </p>
          </CardContent>
        </Card>

        <Separator />
        
        <p className="text-xs text-muted-foreground text-center">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </ScrollArea>
  )
}