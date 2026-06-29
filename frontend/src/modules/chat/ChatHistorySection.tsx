import { useState } from 'react';
import { Search, MessageSquare } from 'lucide-react';

interface LocalMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  contactName: string;
  initials: string;
  agentName: string;
  channel: 'WhatsApp' | 'Web' | 'Telegram';
  lastMessage: string;
  lastTime: string;
  dateISO: string;
  status: 'active' | 'ended';
  unread: number;
  messages: LocalMessage[];
}

const CHANNEL_COLOR: Record<string, string> = {
  WhatsApp: 'bg-emerald-500',
  Web: 'bg-blue-500',
  Telegram: 'bg-sky-500',
};

const CONVERSATIONS: Conversation[] = [
  {
    id: 'C-001', contactName: 'Ananya Sharma', initials: 'AS',
    agentName: 'Zigxo Assistant', channel: 'WhatsApp',
    lastMessage: 'Great, thank you!', lastTime: '09:07', dateISO: '2026-06-25',
    status: 'active', unread: 0,
    messages: [
      { id: 'm1', sender: 'user', text: 'Hi, I want to check my order status.', time: '09:05' },
      { id: 'm2', sender: 'bot', text: 'Sure! Could you share your order ID?', time: '09:05' },
      { id: 'm3', sender: 'user', text: 'ORD-44231', time: '09:06' },
      { id: 'm4', sender: 'bot', text: 'Your order is out for delivery and should arrive today by 6 PM.', time: '09:06' },
      { id: 'm5', sender: 'user', text: 'Great, thank you!', time: '09:07' },
    ],
  },
  {
    id: 'C-002', contactName: 'Rohan Mehta', initials: 'RM',
    agentName: 'BDA Sales Bot', channel: 'Web',
    lastMessage: 'Can I schedule a demo?', lastTime: '08:55', dateISO: '2026-06-25',
    status: 'active', unread: 2,
    messages: [
      { id: 'm1', sender: 'user', text: 'Hello, I heard about your enterprise plan.', time: '08:50' },
      { id: 'm2', sender: 'bot', text: 'Hi Rohan! Yes, our Enterprise plan includes unlimited devices and priority support.', time: '08:51' },
      { id: 'm3', sender: 'user', text: "What's the pricing?", time: '08:53' },
      { id: 'm4', sender: 'bot', text: 'Pricing starts at ₹49,999/month. I can share a detailed breakdown.', time: '08:53' },
      { id: 'm5', sender: 'user', text: 'Can I schedule a demo?', time: '08:55' },
    ],
  },
  {
    id: 'C-003', contactName: 'Priya Nair', initials: 'PN',
    agentName: 'ThingsBoard Bot', channel: 'WhatsApp',
    lastMessage: 'Device DEV-1003 reconnected.', lastTime: '08:32', dateISO: '2026-06-25',
    status: 'ended', unread: 0,
    messages: [
      { id: 'm1', sender: 'user', text: 'My sensor went offline.', time: '08:28' },
      { id: 'm2', sender: 'bot', text: 'I see DEV-1003 is currently offline. Let me run a diagnostics check.', time: '08:29' },
      { id: 'm3', sender: 'bot', text: 'The device appears to have lost connectivity. Try power-cycling the sensor.', time: '08:30' },
      { id: 'm4', sender: 'user', text: "Done, it's back online now.", time: '08:31' },
      { id: 'm5', sender: 'bot', text: 'Device DEV-1003 reconnected. All telemetry resumed.', time: '08:32' },
    ],
  },
  {
    id: 'C-004', contactName: 'Dev Chandna', initials: 'DC',
    agentName: 'ThingsBoard Bot', channel: 'WhatsApp',
    lastMessage: 'Thanks for the update.', lastTime: '18:46', dateISO: '2026-06-24',
    status: 'ended', unread: 0,
    messages: [
      { id: 'm1', sender: 'user', text: "What's the uptime for DEV-1005?", time: '18:44' },
      { id: 'm2', sender: 'bot', text: 'DEV-1005 has been online for 5 days 9 hours. Battery at 68%.', time: '18:45' },
      { id: 'm3', sender: 'user', text: 'Thanks for the update.', time: '18:46' },
    ],
  },
  {
    id: 'C-005', contactName: 'Sneha Kapoor', initials: 'SK',
    agentName: 'citygreen-bot', channel: 'Telegram',
    lastMessage: 'Invoice sent to your email.', lastTime: '17:35', dateISO: '2026-06-24',
    status: 'ended', unread: 0,
    messages: [
      { id: 'm1', sender: 'user', text: 'I need my invoice for last month.', time: '17:30' },
      { id: 'm2', sender: 'bot', text: 'Generating invoice for May 2026. Please wait...', time: '17:31' },
      { id: 'm3', sender: 'bot', text: 'Invoice sent to your email at sneha.kapoor@example.com.', time: '17:35' },
    ],
  },
  {
    id: 'C-006', contactName: 'Fatima Malik', initials: 'FM',
    agentName: 'BDA Sales Bot', channel: 'Web',
    lastMessage: "We'll follow up tomorrow.", lastTime: '16:22', dateISO: '2026-06-23',
    status: 'ended', unread: 0,
    messages: [
      { id: 'm1', sender: 'user', text: "I'm interested in upgrading from Pro to Enterprise.", time: '16:15' },
      { id: 'm2', sender: 'bot', text: "Great choice! I'll connect you with our account manager.", time: '16:16' },
      { id: 'm3', sender: 'user', text: "What's the migration process?", time: '16:19' },
      { id: 'm4', sender: 'bot', text: 'Migration typically takes 24 hours with zero downtime. We handle the full process.', time: '16:20' },
      { id: 'm5', sender: 'user', text: 'Sounds good.', time: '16:21' },
      { id: 'm6', sender: 'bot', text: "We'll follow up tomorrow with a detailed proposal.", time: '16:22' },
    ],
  },
  {
    id: 'C-007', contactName: 'Arjun Pillai', initials: 'AP',
    agentName: 'Zigxo Assistant', channel: 'WhatsApp',
    lastMessage: 'Session ended by user.', lastTime: '11:14', dateISO: '2026-06-23',
    status: 'ended', unread: 0,
    messages: [
      { id: 'm1', sender: 'user', text: 'I want to update my delivery address.', time: '11:05' },
      { id: 'm2', sender: 'bot', text: 'Sure! Please share your order ID and the new address.', time: '11:06' },
      { id: 'm3', sender: 'user', text: 'ORD-44190 — 14 Park Street, Mumbai 400001', time: '11:09' },
      { id: 'm4', sender: 'bot', text: 'Address updated for ORD-44190. You will receive a confirmation SMS shortly.', time: '11:12' },
      { id: 'm5', sender: 'bot', text: 'Session ended by user.', time: '11:14' },
    ],
  },
];

type DateGroup = { label: string; items: Conversation[] };

function buildGroups(conversations: Conversation[]): DateGroup[] {
  const groups: DateGroup[] = [];
  const today = '2026-06-25';
  const yesterday = '2026-06-24';

  const todayItems = conversations.filter((c) => c.dateISO === today);
  const yesterdayItems = conversations.filter((c) => c.dateISO === yesterday);
  const olderItems = conversations.filter((c) => c.dateISO < yesterday);

  if (todayItems.length) groups.push({ label: 'Today', items: todayItems });
  if (yesterdayItems.length) groups.push({ label: 'Yesterday', items: yesterdayItems });
  if (olderItems.length) groups.push({ label: 'Earlier', items: olderItems });
  return groups;
}

export default function ChatHistorySection() {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [query, setQuery] = useState('');

  const filtered = CONVERSATIONS.filter((c) =>
    !query ||
    c.contactName.toLowerCase().includes(query.toLowerCase()) ||
    c.agentName.toLowerCase().includes(query.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(query.toLowerCase())
  );

  const groups = buildGroups(filtered);
  const active = CONVERSATIONS.find((c) => c.id === activeId)!;

  return (
    <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm overflow-hidden flex h-[calc(100vh-8rem)]">

      {/* ── Left panel: conversation list ── */}
      <div className="w-72 shrink-0 border-r border-zinc-200/50 dark:border-zinc-800/40 flex flex-col">

        {/* Search */}
        <div className="px-3 py-3 border-b border-zinc-200/50 dark:border-zinc-800/40">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/40 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
            />
          </div>
        </div>

        {/* Groups + items */}
        <div className="flex-1 overflow-y-auto">
          {groups.length === 0 && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-10">No conversations found.</p>
          )}
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-4 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {group.label}
              </p>
              {group.items.map((conv) => {
                const isSelected = conv.id === activeId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveId(conv.id)}
                    className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 transition-colors duration-100 ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-500/10'
                        : 'hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    {/* Avatar */}
                    <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {conv.initials}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-semibold truncate ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
                          {conv.contactName}
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 shrink-0">{conv.lastTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${CHANNEL_COLOR[conv.channel]}`} />
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">{conv.agentName}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>

                    {conv.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-1">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel: message thread ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Thread header */}
        <div className="px-5 py-3.5 border-b border-zinc-200/50 dark:border-zinc-800/40 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold flex items-center justify-center shrink-0">
            {active.initials}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{active.contactName}</p>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  active.status === 'active'
                    ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${active.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
                {active.status === 'active' ? 'Active' : 'Ended'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${CHANNEL_COLOR[active.channel]}`} />
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{active.channel}</span>
              <span className="text-[11px] text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{active.agentName}</span>
              <span className="text-[11px] text-zinc-300 dark:text-zinc-700">·</span>
              <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">{active.id}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {active.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mr-2 mt-1">
                  <MessageSquare className="w-3 h-3" />
                </span>
              )}
              <div className={`max-w-[70%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white rounded-br-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-sm'
              }`}>
                <p>{msg.text}</p>
                <span className={`block text-[10px] mt-1 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Ended notice */}
        {active.status === 'ended' && (
          <div className="px-5 py-3 border-t border-zinc-200/50 dark:border-zinc-800/40 text-center">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">This session has ended.</p>
          </div>
        )}
      </div>
    </div>
  );
}
