// Chatbot Configuration
export const CHATBOT_CONFIG = {
  // Zapier Chatbot ID - Replace with your actual chatbot ID
  chatbotId: process.env.REACT_APP_ZAPIER_CHATBOT_ID || "cmdn65jpx000dfawvaf0ea4o3",
  
  // Legacy webhook URL (kept for reference)
  zapierWebhookUrl: process.env.REACT_APP_ZAPIER_WEBHOOK_URL || "https://hooks.zapier.com/hooks/catch/your-webhook-url",
  
  // Chatbot settings
  maxMessageLength: 500,
  typingIndicatorDelay: 1000,
  
  // Default messages
  welcomeMessage: "Hello! I'm your nutrition assistant. How can I help you today?",
  errorMessage: "I'm having trouble connecting right now. Please try again later or contact support.",
  loadingMessage: "Thinking...",
}; 