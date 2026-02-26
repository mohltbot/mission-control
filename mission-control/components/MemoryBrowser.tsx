'use client';

import { useState } from 'react';
import { Memory } from '@/lib/models';

interface MemoryBrowserProps {
  memories: Memory[];
}

export function MemoryBrowser({ memories }: MemoryBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...new Set(memories.map(m => m.category).filter(Boolean))];

  // Filter memories
  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || memory.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort by importance (high to low) and then by date
  const sortedMemories = [...filteredMemories].sort((a, b) => {
    if (b.importance !== a.importance) return b.importance - a.importance;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const importanceStars = (level: number) => '★'.repeat(level) + '☆'.repeat(3 - level);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Memory Browser</h2>
      
      {/* Search and Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search memories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-gray-700 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Memory Count */}
      <p className="text-xs text-gray-500 mb-3">
        Showing {sortedMemories.length} of {memories.length} memories
      </p>

      {/* Memory List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedMemories.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            {memories.length === 0 
              ? "No memories stored yet" 
              : "No memories match your search"}
          </p>
        ) : (
          sortedMemories.map((memory) => (
            <div 
              key={memory.id} 
              className="bg-gray-700 rounded p-3 hover:bg-gray-600 transition-colors"
            >
              <p className="text-sm text-gray-200 whitespace-pre-wrap">{memory.content}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-xs">{importanceStars(memory.importance)}</span>
                  {memory.category && (
                    <span className="text-xs px-2 py-0.5 bg-gray-600 rounded text-gray-400">
                      {memory.category}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(memory.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
