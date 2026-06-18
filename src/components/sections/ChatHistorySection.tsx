import Card from '../common/Card';
import type { ChatMessage } from '../../types';
interface Props { messages: ChatMessage[]; }

export default function ChatHistorySection({ messages }: Props) {
  return (
    <Card title="Chat History">
      <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
              msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              <p>{msg.message}</p>
              <span className={`block text-[10px] mt-1 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}