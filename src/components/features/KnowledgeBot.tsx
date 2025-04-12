"use client";

// Note: If integrating with AI services or external APIs in the future,
// add any required API keys to Netlify environment variables
// Client-side variables must use NEXT_PUBLIC_ prefix

import { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { defaultLocationData } from '@/contexts/LocationContext';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Pre-defined knowledge base for the bot
const knowledgeBase = {
  // Location information
  locations: defaultLocationData,
  
  // FAQs and common questions
  faqs: [
    {
      question: ["hours", "when are you open", "opening hours", "closing time", "close"],
      answer: "Our Portland location is open Sunday-Wednesday 10AM-11PM, Thursday 10AM-1AM, and Friday-Saturday 10AM-2:30AM. Our Salem location is open Sunday-Wednesday 10AM-11PM, Thursday 10AM-12AM, and Friday-Saturday 10AM-2AM."
    },
    {
      question: ["menu", "food", "drinks", "what do you serve", "specials"],
      answer: "We serve a variety of Mexican-inspired food including tacos, burritos, and appetizers. Our bar features craft cocktails, margaritas, and local beers. Check our menu page for the full selection and daily specials!"
    },
    {
      question: ["parking", "park", "where to park"],
      answer: "Parking is available in nearby public lots and street parking. Our Portland location is also easily accessible via public transportation."
    },
    {
      question: ["reservations", "reserve", "book a table", "large group", "catering", "birthday", "party booking"],
      answer: "We accept reservations for groups of 6 or more. Please call us directly to make a reservation or book through our website. We also offer catering and special event bookings for birthdays and private parties. For smaller groups, we operate on a first-come, first-served basis."
    },
    {
      question: ["events", "private events", "host an event", "party"],
      answer: "We can accommodate private events and parties! Please contact us for more information about pricing and availability or fill out our reservation form for catering and birthday party bookings."
    },
    {
      question: ["happy hour", "deals", "discounts"],
      answer: "Happy Hour runs Monday-Friday from 3PM to 6PM with special pricing on select appetizers and drinks. Check our social media for additional weekly specials!"
    },
    {
      question: ["contact", "phone number", "email", "reach you"],
      answer: "You can reach us at (503) 391-9977 for both locations, or email us at contact@thesidehustleportland.com for Portland and contact@thesidehustlesalem.com for Salem."
    },
    {
      question: ["directions", "address", "how to get there", "where are you located"],
      answer: "Our Portland location is at 327 SW Morrison St, Portland, OR 97204. Our Salem location is at 145 Liberty St NE Suite #101, Salem, OR 97301. Check our locations page for maps and directions."
    },
    {
      question: ["wifi", "internet", "password"],
      answer: "Yes, we offer free WiFi for our customers. Please ask your server for the current password."
    },
    {
      question: ["vegan", "vegetarian", "gluten free", "dietary restrictions", "allergies"],
      answer: "We offer several vegetarian and vegan options, and can accommodate most dietary restrictions. Please inform your server about any allergies or special dietary needs."
    }
  ],
  
  // Greeting responses
  greetings: ["hello", "hi", "hey", "howdy", "greetings", "sup", "what's up"],
  greetingResponses: [
    "Hey there! Welcome to Side Hustle Bar. How can I help you today?",
    "Hi! I'm the Side Hustle Bar assistant. What would you like to know?",
    "Hello! Looking for info about Side Hustle Bar? I'm here to help!",
    "Hey! Ask me anything about our locations, menu, events, or services!"
  ],
  
  // Fallback responses when no answer is found
  fallbacks: [
    "I'm not sure about that. Can you ask something about our locations, hours, menu, or events?",
    "I don't have that information right now. Feel free to ask about our food, drinks, locations, or hours!",
    "I'm still learning! Try asking about our hours, locations, menu items, or upcoming events.",
    "I don't know the answer to that yet. For detailed questions, please call us at (503) 391-9977."
  ]
};

export default function KnowledgeBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Add initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage = {
        id: Date.now().toString(),
        text: "👋 Hi there! I'm your Side Hustle Bar assistant. How can I help you today? Ask me about our locations, menu, or events!",
        isBot: true,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Function to find the most relevant answer from the knowledge base
  const findAnswer = (question: string): string => {
    // Convert question to lowercase for case-insensitive matching
    const lowerQuestion = question.toLowerCase();
    
    // Check for greetings
    if (knowledgeBase.greetings.some(greeting => lowerQuestion.includes(greeting))) {
      const randomIndex = Math.floor(Math.random() * knowledgeBase.greetingResponses.length);
      return knowledgeBase.greetingResponses[randomIndex];
    }
    
    // Check Portland location specific questions
    if (lowerQuestion.includes('portland')) {
      if (lowerQuestion.includes('hours') || lowerQuestion.includes('open')) {
        return `Portland hours: ${Object.entries(knowledgeBase.locations.portland.hours).map(([day, hours]) => `${day}: ${hours}`).join(', ')}`;
      }
      if (lowerQuestion.includes('address') || lowerQuestion.includes('location') || lowerQuestion.includes('where')) {
        return `Portland address: ${knowledgeBase.locations.portland.address}`;
      }
      if (lowerQuestion.includes('phone') || lowerQuestion.includes('call') || lowerQuestion.includes('contact')) {
        return `Portland contact: ${knowledgeBase.locations.portland.phone} or ${knowledgeBase.locations.portland.email}`;
      }
    }
    
    // Check Salem location specific questions
    if (lowerQuestion.includes('salem')) {
      if (lowerQuestion.includes('hours') || lowerQuestion.includes('open')) {
        return `Salem hours: ${Object.entries(knowledgeBase.locations.salem.hours).map(([day, hours]) => `${day}: ${hours}`).join(', ')}`;
      }
      if (lowerQuestion.includes('address') || lowerQuestion.includes('location') || lowerQuestion.includes('where')) {
        return `Salem address: ${knowledgeBase.locations.salem.address}`;
      }
      if (lowerQuestion.includes('phone') || lowerQuestion.includes('call') || lowerQuestion.includes('contact')) {
        return `Salem contact: ${knowledgeBase.locations.salem.phone} or ${knowledgeBase.locations.salem.email}`;
      }
    }
    
    // Check for FAQ matches
    for (const faq of knowledgeBase.faqs) {
      if (faq.question.some(keyword => lowerQuestion.includes(keyword))) {
        return faq.answer;
      }
    }
    
    // Return a fallback response if no match is found
    const randomIndex = Math.floor(Math.random() * knowledgeBase.fallbacks.length);
    return knowledgeBase.fallbacks[randomIndex];
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    
    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: findAnswer(input),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    // Add initial greeting again
    const initialMessage = {
      id: Date.now().toString(),
      text: "👋 Hi there! I'm your Side Hustle Bar assistant. How can I help you today? Ask me about our locations, menu, or events!",
      isBot: true,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  };

  return (
    <>
      {/* 3D Hustle Bot (fixed position in top left) */}
      <div 
        className="fixed z-50 left-4 top-20 flex flex-col items-center"
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        <motion.div
          animate={{ 
            y: isButtonHovered ? [0, -5, 0] : 0,
            rotate: isButtonHovered ? [-5, 5, -5, 5, 0] : 0
          }}
          transition={{
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 0.5, repeat: 0, ease: "easeInOut" }
          }}
          className="cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="relative w-16 h-16 md:w-20 md:h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-800 to-gray-600 animate-pulse blur-sm"></div>
            <div className="relative z-10 w-full h-full">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 via-gray-500 to-slate-800 border-2 border-gray-600 shadow-lg overflow-hidden flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Robot face */}
                  <div className="absolute w-full h-full flex flex-col items-center justify-center p-2">
                    {/* Eyes */}
                    <div className="flex justify-center gap-3 w-full">
                      <motion.div 
                        animate={{ 
                          backgroundColor: isButtonHovered ? "#38bdf8" : "#60a5fa"
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-400 opacity-90"
                      ></motion.div>
                      <motion.div 
                        animate={{ 
                          backgroundColor: isButtonHovered ? "#38bdf8" : "#60a5fa"
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-400 opacity-90"
                      ></motion.div>
                    </div>
                    {/* Mouth */}
                    <motion.div 
                      animate={{ 
                        width: isButtonHovered ? "50%" : "30%"
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-6 h-1 md:h-1.5 rounded-lg bg-blue-400 mt-3 opacity-90"
                    ></motion.div>
                  </div>
                  {/* Overlay - metallic sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-10"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <div className={`mt-2 text-xs font-medium ${isDark ? 'text-white' : 'text-black'} bg-opacity-70 px-2 py-1 rounded transition-opacity duration-200 ${isButtonHovered ? 'opacity-100' : 'opacity-0'}`}>
          Ask Hustle Bot
        </div>
      </div>

      {/* Mobile chat button (only visible on smaller screens) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 bottom-6 right-6 p-3 rounded-full shadow-lg ${
          isDark ? 'bg-white text-black' : 'bg-black text-white'
        } flex md:hidden items-center justify-center`}
        aria-label="Chat with Side Hustle Bot"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div 
          className={`fixed z-40 bottom-20 right-6 w-full max-w-sm overflow-hidden rounded-lg shadow-xl ${
            isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          {/* Chat header */}
          <div className={`p-3 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} flex justify-between items-center`}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center ${
                isDark ? 'bg-white' : 'bg-black'
              }`}>
                <svg 
                  className={`w-5 h-5 ${isDark ? 'text-black' : 'text-white'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M12 14a2 2 0 100-4 2 2 0 000 4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                  Side Hustle Assistant
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Online • Ready to help
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetChat}
              className={`rounded-full ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-black'}`}
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Chat messages */}
          <div 
            className={`h-96 overflow-y-auto p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.isBot
                      ? isDark 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-gray-200 text-black'
                      : isDark 
                          ? 'bg-white text-black'
                          : 'bg-black text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.isBot
                      ? isDark ? 'text-gray-400' : 'text-gray-500'
                      : isDark ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <div className={`p-3 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about hours, menu, events..."
                className={`flex-1 resize-none rounded-lg px-3 py-2 text-sm focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                    : 'bg-gray-100 text-black placeholder-gray-500 border-gray-200'
                } border`}
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                disabled={input.trim() === ''}
                variant="ghost"
                size="icon"
                className={`rounded-full ${isDark ? 'bg-white text-black' : 'bg-black text-white'} p-2`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}