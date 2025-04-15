import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { MessageCircle, X } from 'lucide-react';
import { BUSINESS_FAQ } from '@/data/business-faq';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const initialMessages: Message[] = [
  { sender: 'bot', text: 'Hi! How can I help you today?' },
];

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    // Find answer from business FAQ
    const match = BUSINESS_FAQ.find(faq => {
      const q = faq.question.toLowerCase();
      const userQ = input.toLowerCase();
      return userQ.includes(q) || q.includes(userQ) || userQ.split(' ').some(word => q.includes(word));
    });
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: match ? match.answer : "Sorry, I don't know that yet! Please ask something else or contact us directly." },
      ]);
    }, 800);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Chatbot Toggle Button */}
      <button
        className={cn(
          'fixed bottom-8 right-8 z-50 flex items-center justify-center rounded-full shadow-lg transition-all focus:outline-none',
          open ? 'opacity-0 pointer-events-none' : 'opacity-100',
          theme === 'dark'
            ? 'bg-white text-black border border-black'
            : 'bg-black text-white border border-white'
        )}
        style={{ width: 56, height: 56 }}
        aria-label="Open chatbot"
        onClick={() => setOpen(true)}
      >
        <MessageCircle size={28} />
      </button>
      {/* Chatbot Popup */}
      <section
        className={cn(
          'fixed bottom-8 right-8 z-50 w-72 max-w-full bg-white/90 dark:bg-black/90 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300',
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        )}
        style={{ maxWidth: '90vw' }}
        aria-modal="true"
        role="dialog"
      >
        <div className="flex items-center px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-t-xl justify-between">
          <span className="font-semibold text-lg text-slate-900 dark:text-slate-100">Chatbot</span>
          <button
            className="ml-2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none"
            onClick={() => setOpen(false)}
            aria-label="Close chatbot"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2" style={{ maxHeight: 220 }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={cn(
              'flex',
              msg.sender === 'user' ? 'justify-end' : 'justify-start')
            }>
              <div className={cn(
                'px-3 py-2 rounded-lg',
                msg.sender === 'user'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-slate-200 text-black dark:bg-slate-800 dark:text-white'
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center gap-2 p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-b-xl">
          <input
            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 bg-white dark:bg-black text-black dark:text-white"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type your message..."
            aria-label="Type your message"
          />
          <Button
            type="button"
            onClick={handleSend}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg shadow hover:bg-slate-800 dark:hover:bg-slate-100"
          >
            Send
          </Button>
        </div>
      </section>
    </>
  );
};

export default Chatbot;
