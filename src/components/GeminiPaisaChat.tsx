import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';
import {
  Bot,
  Send,
  X,
  Sparkles,
  User,
  Scissors,
  HelpCircle,
  RotateCcw,
  PlusCircle,
} from 'lucide-react';

interface GeminiPaisaChatProps {
  isOpen?: boolean;
  onClose?: () => void;
  isFloatingDrawer?: boolean;
  onNavigateBooking?: () => void;
}

const QUICK_PROMPTS = [
  '¿Qué corte me queda bien si tengo cara redonda?',
  '¿Cuánto cuesta el Combo Rey Paisa?',
  '¿Cómo cuidar la barba para que no quede reseca?',
  '¿En qué sede atiende Camilo El Duro?',
];

export const GeminiPaisaChat: React.FC<GeminiPaisaChatProps> = ({
  isOpen = true,
  onClose,
  isFloatingDrawer = true,
  onNavigateBooking,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: '¡Qué más pues, parce! Bienvenido a VANGUAR Barbería. Soy tu parcero AI. Preguntame lo que querás sobre cortes, estilos para tu rostro, cuidado de barba o precios y te colaboro de una.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      // Map message history
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error en el servidor');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || '¡Oído cocina, parce! Cualquier otra duda decime.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: '¡Ay parce! Tuve un cruce de cables con la red, pero probemos de nuevo en un segundo.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-0.5 shadow-lg shadow-purple-950/50">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">El Parcero AI</h3>
              <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-300 bg-emerald-950 rounded-full border border-emerald-800">
                Gemini Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Asesor de Imagen & Barbería VANGUAR</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setMessages([
                {
                  id: 'msg-welcome',
                  sender: 'bot',
                  text: '¡Qué más pues, parce! Bienvenido a VANGUAR Barbería. Soy tu parcero AI. Preguntame lo que querás sobre cortes, estilos para tu rostro, cuidado de barba o precios y te colaboro de una.',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Reiniciar chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isFloatingDrawer && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-purple-900/80 text-purple-200 border border-purple-700/50'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className="block text-[9px] text-slate-400 text-right mt-1.5 font-mono">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-900/80 flex items-center justify-center text-purple-200">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>El parcero está pensando...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Pills */}
      <div className="p-2.5 bg-slate-900/60 border-t border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 shrink-0 flex items-center gap-1 pl-1">
          <Sparkles className="w-3 h-3" />
          Preguntas:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:border-purple-500 hover:text-white whitespace-nowrap transition-all shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        {onNavigateBooking && (
          <div className="mb-2 text-center">
            <button
              onClick={() => {
                if (onClose) onClose();
                onNavigateBooking();
              }}
              className="text-[11px] text-purple-300 hover:text-purple-200 font-semibold underline flex items-center justify-center gap-1 mx-auto"
            >
              <Scissors className="w-3 h-3" />
              <span>¿Ya sabés qué corte querés? Agendá tu cita aquí</span>
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribile al parcero AI..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:brightness-110 disabled:opacity-40 transition-all shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );

  if (!isFloatingDrawer) {
    return <div className="max-w-3xl mx-auto h-[600px] my-6">{content}</div>;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-0 sm:p-6 bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="w-full sm:max-w-md h-[85vh] sm:h-[650px] shadow-2xl"
      >
        {content}
      </motion.div>
    </div>
  );
};
