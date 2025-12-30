import React from 'react';
import { Notice } from './types';
import { Plus, Trash2 } from 'lucide-react';
import { createItem, updateItem, removeItem, insertTag, RICH_TEXT_TOOLS } from './adminUtils';

interface AdminNoticesTabProps {
  notices: Notice[];
}

export const AdminNoticesTab: React.FC<AdminNoticesTabProps> = ({ notices }) => {
  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">お知らせ（管理者通信）作成</h3>
        <button onClick={() => createItem('notices', { date: new Date().toISOString().split('T')[0], title: '新規お知らせ', category: 'INFO', content: '' })} className="bg-oct-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-oct-500 transition-all">
          <Plus size={18} className="inline mr-2"/> 新規作成
        </button>
      </div>
      <div className="grid gap-6">
        {notices.map(n => (
          <div key={n.id} className="border p-8 rounded-[2rem] flex flex-col gap-6 bg-white shadow-sm border-oct-100">
            <div className="flex justify-between items-center gap-4">
              <input value={n.title} onChange={e => updateItem('notices', n.id, {title: e.target.value})} className="font-bold text-xl flex-1 border-b-2 border-transparent focus:border-oct-500 outline-none p-1" placeholder="タイトル" />
              <select value={n.category} onChange={e => updateItem('notices', n.id, {category: e.target.value})} className="text-xs border rounded-xl px-4 py-2 font-bold bg-oct-50 outline-none">
                <option value="IMPORTANT">重要</option>
                <option value="EVENT">イベント</option>
                <option value="INFO">一般告知</option>
              </select>
              <button onClick={() => removeItem('notices', n.id)} className="text-red-400 p-2"><Trash2 size={24}/></button>
            </div>
             <div className="flex flex-wrap gap-2">
              {RICH_TEXT_TOOLS.slice(0, 8).map(tool => (
                <button key={tool.label} onClick={() => insertTag(n.content, 'content', 'notices', n.id, tool.tagStart, tool.tagEnd)} className="px-3 py-1.5 rounded-lg border text-[10px] font-bold bg-white shadow-sm">
                  {tool.label}
                </button>
              ))}
            </div>
            <textarea value={n.content} onChange={e => updateItem('notices', n.id, {content: e.target.value})} className="w-full h-48 text-sm border p-6 rounded-[2rem] bg-oct-50/10 outline-none focus:ring-2 ring-oct-100 shadow-inner" placeholder="本文を入力..." />
          </div>
        ))}
      </div>
    </div>
  );
};