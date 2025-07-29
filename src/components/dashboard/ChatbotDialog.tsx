import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CHATBOT_CONFIG } from '../../config/chatbot';

interface ChatbotDialogProps {
  zapierWebhookUrl?: string;
}

export const ChatbotDialog: React.FC<ChatbotDialogProps> = ({ 
  zapierWebhookUrl = CHATBOT_CONFIG.zapierWebhookUrl 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot'; content: string; timestamp: Date }>>([
    { type: 'bot', content: CHATBOT_CONFIG.welcomeMessage, timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user' as const, content: inputMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to Zapier webhook
      const response = await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = { 
          type: 'bot' as const, 
          content: data.response || 'Thank you for your message! I\'ll get back to you soon.', 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback response if webhook fails
        const botMessage = { 
          type: 'bot' as const, 
          content: CHATBOT_CONFIG.errorMessage, 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const botMessage = { 
        type: 'bot' as const, 
        content: CHATBOT_CONFIG.errorMessage, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#7cfb8b] to-[#51B73B] hover:from-[#6aeb7a] hover:to-[#45a732] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20 backdrop-blur-sm"
              style={{
                boxShadow: '0 8px 32px rgba(124, 251, 139, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md w-[90vw] h-[70vh] flex flex-col bg-[rgba(124,251,139,0.08)] backdrop-blur-[18px] rounded-2xl border border-[#7cfb8b]/30 shadow-[0_2px_16px_0_rgba(124,251,139,0.10)] text-white">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#7cfb8b]" />
                Nutrition Assistant
              </DialogTitle>
            </DialogHeader>
            
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-[#7cfb8b] to-[#51B73B] text-white'
                        : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#7cfb8b] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#7cfb8b] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#7cfb8b] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Container */}
            <div className="flex-shrink-0 flex gap-2 p-4 border-t border-white/10">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#7cfb8b]/50 focus:border-[#7cfb8b]/50"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-gradient-to-r from-[#7cfb8b] to-[#51B73B] hover:from-[#6aeb7a] hover:to-[#45a732] text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}; 