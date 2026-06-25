import { useState } from 'react';
import Card from '../../components/common/Card';
import type { TopicTag } from '../../types';
import { mockTopics } from '../../utils/mockData';

export default function TopicsSection() {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [topics, setTopics] = useState<TopicTag[]>(mockTopics);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    mockTopics.find((t) => t.selected)?.id ?? mockTopics[0]?.id ?? ''
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;
    const newTopic: TopicTag = {
      id: `t-${Date.now()}`,
      name: newTopicName.trim(),
      description: newTopicDesc.trim() || 'Custom topic',
      icon: '🏷️',
    };
    setTopics((prev) => [...prev, newTopic]);
    setNewTopicName('');
    setNewTopicDesc('');
    setShowAddForm(false);
  };

  return (
    <Card title="Assign Topic Tag">
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setMode('manual')}
          className={mode === 'manual'
            ? 'px-3.5 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white'
            : 'px-3.5 py-2 rounded-lg text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'}
        >
          Manual tag
        </button>
        <button
          onClick={() => setMode('auto')}
          className={mode === 'auto'
            ? 'px-3.5 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white'
            : 'px-3.5 py-2 rounded-lg text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'}
        >
          Auto detect
        </button>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Select which topic this data source belongs to</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map((topic) => {
          const isSelected = selectedTopicId === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className={
                isSelected
                  ? 'relative text-left p-4 rounded-xl border-[1.5px] border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/10 transition-all duration-200'
                  : 'relative text-left p-4 rounded-xl border-[0.5px] border-zinc-200/60 dark:border-zinc-700/50 bg-white/40 dark:bg-zinc-900/30 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-all duration-200'
              }
            >
              {isSelected && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">✓</span>
              )}
              <span className="text-xl">{topic.icon}</span>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2">{topic.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{topic.description}</p>
            </button>
          );
        })}

        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex flex-col items-center justify-center gap-1 p-4 rounded-xl border-[1.5px] border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 transition-colors duration-200"
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-sm font-medium">New topic</span>
          </button>
        ) : (
          <div className="p-4 rounded-xl border-[0.5px] border-zinc-200/60 dark:border-zinc-700/50 bg-white/40 dark:bg-zinc-900/30 space-y-2">
            <input
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Topic name"
              className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <input
              value={newTopicDesc}
              onChange={(e) => setNewTopicDesc(e.target.value)}
              placeholder="Short description"
              className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2 pt-1">
              <button onClick={handleAddTopic} className="text-xs font-medium text-white bg-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-700">Add</button>
              <button onClick={() => setShowAddForm(false)} className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
