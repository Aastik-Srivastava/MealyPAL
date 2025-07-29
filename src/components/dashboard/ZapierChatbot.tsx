import React, { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

interface ZapierChatbotProps {
  chatbotId: string;
}

export const ZapierChatbot: React.FC<ZapierChatbotProps> = ({ chatbotId }) => {
  useEffect(() => {
    // Load Zapier interfaces script if not already loaded
    if (!document.querySelector('script[src*="zapier-interfaces"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.type = 'module';
      script.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
      document.head.appendChild(script);
    }

    // Create the chatbot embed element
    const chatbotElement = document.createElement('zapier-interfaces-chatbot-embed');
    chatbotElement.setAttribute('is-popup', 'true');
    chatbotElement.setAttribute('chatbot-id', chatbotId);
    
    // Add the chatbot to the page
    document.body.appendChild(chatbotElement);

    // Cleanup function
    return () => {
      const existingChatbot = document.querySelector('zapier-interfaces-chatbot-embed');
      if (existingChatbot) {
        existingChatbot.remove();
      }
    };
  }, [chatbotId]);

  return null; // This component doesn't render anything visible
}; 