import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Lightbulb, Sparkles, TrendingUp, Clock, Users, X } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  error?: boolean;
}

interface ChatResponse {
  answer: string;
  sql?: string;
  data?: any[];
  suggestions?: string[];
}

const QUICK_ACTIONS = [
  { icon: TrendingUp, label: 'Productivity', query: 'Show productivity summary' },
  { icon: Clock, label: 'Time Analysis', query: 'How much time was spent today?' },
  { icon: Users, label: 'Team Activity', query: 'What is everyone working on?' },
  { icon: Sparkles, label: 'Automation', query: 'Find automation opportunities' },
];

export function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '👋 Hello! I\'m Genesis AI, your analytics assistant. I can help you:\n\n📊 Analyze productivity trends\n⏱️ Track time spent on tasks\n🤖 Find automation opportunities\n👥 Monitor team activity\n\nTry asking a question or use the quick actions below!',
      timestamp: new Date(),
      suggestions: ['Who was most productive today?', 'Show repetitive tasks', 'Time spent by app']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
  };

  const sendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: messageText })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        suggestions: data.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Sorry, I encountered an error processing your question. Please check your connection and try again.',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.error ? 'bg-red-100' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}>
                {message.error ? (
                  <X className="w-5 h-5 text-red-600" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
            )}
            
            <div className={`max-w-[75%] ${message.role === 'user' ? 'order-1' : ''}`}>
              <div
                className={`rounded-2xl px-5 py-3 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.error
                    ? 'bg-red-50 text-red-900 border border-red-200'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestion(suggestion)}
                      disabled={isLoading}
                      className="text-xs px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-all disabled:opacity-50 flex items-center gap-1.5 border border-blue-200 shadow-sm"
                    >
                      <Lightbulb className="w-3 h-3" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              <span className="text-xs text-gray-400 mt-2 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {message.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 order-2">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {/* Quick Actions */}
        {showQuickActions && messages.length === 1 && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-3 font-medium">Quick Actions</p>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.query)}
                  disabled={isLoading}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{action.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{action.query}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white rounded-2xl px-5 py-3 flex items-center gap-3 border border-gray-200 shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-600">Analyzing your data...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-5 border-t bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Genesis AI about your team's productivity..."
            className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all shadow-sm hover:shadow-md"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Try: "Who was most productive today?" or "Show me automation opportunities"
        </p>
      </form>
    </div>
  );
}
