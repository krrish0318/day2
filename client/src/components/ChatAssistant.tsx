import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

/**
 * ChatAssistant Component - Manages AI queries, micro-animations, and AI text integration.
 * Incorporates aria-labels for usability and manages state locally for chat threads.
 * 
 * @returns {JSX.Element} Interactive chat interface.
 */
export default function ChatAssistant(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Hi there! I am your Smart Venue Assistant. Need help finding the shortest queue or the best route to your seat?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Determine the base URL (relative for deployed, absolute for local dev)
      const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:8080' : '';
      const response = await fetch(`${baseUrl}/api/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: data.reply || 'Sorry, I couldn\'t understand that.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: 'Error connecting to the intelligence core.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const toggleMic = () => {
    setIsListening(!isListening);
    // In actual implementation, connect to SpeechRecognition API
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInput('Where is the nearest food stall?');
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-white/5 rounded-xl shadow-inner relative">
      <div className="p-4 border-b border-white/5 bg-gradient-to-r from-primary/20 to-transparent flex items-center gap-3">
        <div className="p-2 bg-primary/20 rounded-full text-primary">
          <Bot size={20} />
        </div>
        <h3 className="font-semibold text-lg">Smart Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              m.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-700/50 text-gray-100 rounded-bl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-gray-700/50 rounded-2xl rounded-bl-none px-4 py-2 flex gap-1 items-center">
               <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0ms'}}></span>
               <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '150ms'}}></span>
               <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '300ms'}}></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-white/5 bg-surface/50">
        <div className="relative flex items-center">
          <button 
            title="Toggle Voice Input"
            aria-label="Toggle Voice Input"
            onClick={toggleMic}
            className={`absolute left-3 p-2 rounded-full transition-colors ${isListening ? 'text-alert bg-alert/20 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            {isListening ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
          
          <input 
            type="text" 
            aria-label="Ask the assistant"
            placeholder="Ask for directions or wait times..." 
            className="w-full bg-black/40 border border-white/10 rounded-full pl-12 pr-12 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <button 
            title="Send Message"
            aria-label="Send Message"
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 p-2 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:bg-primary rounded-full transition-colors"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
