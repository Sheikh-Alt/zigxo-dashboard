import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Send, Cpu, Check } from 'lucide-react';

type Stage = 'name' | 'phone' | 'chat';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: string;
}

interface UserInfo {
  name: string;
  phone: string;
}

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function uid() {
  return `${Date.now()}-${Math.random()}`;
}

const STEPS: { key: Stage; label: string }[] = [
  { key: 'name',  label: 'Name'  },
  { key: 'phone', label: 'Phone' },
];

const STAGE_PLACEHOLDER: Record<Stage, string> = {
  name:  'Enter your full name…',
  phone: 'Enter your phone number…',
  chat:  'Ask about your devices…',
};

export default function ThingsBoardChatbot() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      role: 'bot',
      time: nowTime(),
      text: "Welcome to ThingsBoard Bot! Before we begin, I need a few details. What's your full name?",
    },
  ]);
  const [input, setInput]           = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const [stage, setStage]           = useState<Stage>('name');
  const [userInfo, setUserInfo]     = useState<UserInfo>({ name: '', phone: '' });
  const [sessionId, setSessionId]   = useState<number | null>(null);
  const bottomRef                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /** Append a bot message with a short simulated typing delay (onboarding only). */
  const localBotReply = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: uid(), role: 'bot', text, time: nowTime() }]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setMessages(prev => [...prev, { id: uid(), role: 'user', text, time: nowTime() }]);
    setInput('');

    // ── Onboarding: collect name ──────────────────────────────
    if (stage === 'name') {
      setUserInfo(prev => ({ ...prev, name: text }));
      setStage('phone');
      localBotReply(`Nice to meet you, ${text}! What's your phone number?`);
      return;
    }

    // ── Onboarding: collect phone, register session ───────────
    if (stage === 'phone') {
      const name = userInfo.name;
      setUserInfo(prev => ({ ...prev, phone: text }));
      setIsTyping(true);

      try {
        const res  = await fetch('/api/chat/register', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ name, phone: text }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Registration failed');

        setSessionId(data.id);
        setStage('chat');
        setMessages(prev => [
          ...prev,
          {
            id:   uid(),
            role: 'bot',
            text: `All set, ${name}! Your details have been saved. How can I help you today?`,
            time: nowTime(),
          },
        ]);
      } catch {
        setMessages(prev => [
          ...prev,
          {
            id:   uid(),
            role: 'bot',
            text: "Sorry, I couldn't save your details right now. Please try again.",
            time: nowTime(),
          },
        ]);
        // Stay on 'phone' so the user can retry
        setStage('phone');
        setUserInfo(prev => ({ ...prev, phone: '' }));
      } finally {
        setIsTyping(false);
      }
      return;
    }

    // ── Regular chat: call backend ────────────────────────────
    setIsTyping(true);
    try {
      const res  = await fetch('/api/chat/message', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ sessionId, message: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to get reply');

      setMessages(prev => [...prev, { id: uid(), role: 'bot', text: data.reply, time: nowTime() }]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id:   uid(),
          role: 'bot',
          text: "Sorry, I couldn't reach the server. Please try again.",
          time: nowTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const stepIndex = STEPS.findIndex(s => s.key === stage);

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden border border-white/5 shadow-2xl h-[calc(100vh-8rem)]"
      style={{ background: '#16161a' }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] shrink-0"
        style={{ background: '#1e1e24' }}
      >
        <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <Cpu className="w-[18px] h-[18px] text-indigo-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-100 leading-none">ThingsBoard Bot</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[11px] text-emerald-400 font-medium">Online</span>
          </div>
        </div>

        {stage !== 'chat' ? (
          <span className="shrink-0 text-[11px] font-medium text-zinc-500">
            Step {stepIndex + 1} of {STEPS.length}
          </span>
        ) : (
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-600/15 border border-indigo-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
            <span className="text-[11px] text-indigo-300 font-medium max-w-[100px] truncate">
              {userInfo.name}
            </span>
          </div>
        )}
      </div>

      {/* ── Onboarding step progress bar ───────────────────────── */}
      {stage !== 'chat' && (
        <div
          className="flex items-center gap-0 px-5 py-3 border-b border-white/[0.04] shrink-0"
          style={{ background: '#1a1a21' }}
        >
          {STEPS.map((step, i) => {
            const isDone    = i < stepIndex;
            const isCurrent = i === stepIndex;

            return (
              <div key={step.key} className="flex items-center">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isDone
                        ? 'bg-indigo-600 text-white'
                        : isCurrent
                        ? 'bg-indigo-600/25 border border-indigo-500/50 text-indigo-400'
                        : 'bg-zinc-800 border border-zinc-700 text-zinc-600'
                    }`}
                  >
                    {isDone
                      ? <Check className="w-3 h-3" />
                      : <span className="text-[10px] font-bold">{i + 1}</span>
                    }
                  </span>
                  <span
                    className={`text-[11px] font-medium transition-colors duration-300 ${
                      isDone    ? 'text-indigo-400' :
                      isCurrent ? 'text-zinc-100'   :
                                  'text-zinc-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-3 h-px w-8 shrink-0 transition-colors duration-300 ${
                      i < stepIndex ? 'bg-indigo-600/50' : 'bg-zinc-800'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Message list ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center shrink-0 mb-0.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            )}
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'text-zinc-200 rounded-bl-sm'
              }`}
              style={msg.role === 'bot' ? { background: '#2a2a35' } : undefined}
            >
              <p>{msg.text}</p>
              <span
                className={`block text-[10px] mt-1.5 ${
                  msg.role === 'user' ? 'text-indigo-300 text-right' : 'text-zinc-500'
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center shrink-0 mb-0.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="px-4 py-3.5 rounded-2xl rounded-bl-sm" style={{ background: '#2a2a35' }}>
              <div className="flex items-center gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ──────────────────────────────────────────────── */}
      <div
        className="px-4 py-3.5 border-t border-white/[0.06] shrink-0"
        style={{ background: '#1e1e24' }}
      >
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/[0.08]"
          style={{ background: '#16161a' }}
        >
          <input
            type={stage === 'phone' ? 'tel' : 'text'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={STAGE_PLACEHOLDER[stage]}
            disabled={isTyping}
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition-colors duration-150"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <p className="text-center text-[10px] text-zinc-700 mt-2">Press Enter to send</p>
      </div>
    </div>
  );
}
