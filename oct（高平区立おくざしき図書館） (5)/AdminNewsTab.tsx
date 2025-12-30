import React from 'react';
import { NewsItem } from './types';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { createItem, updateItem, removeItem, insertTag, handleFileUpload, RICH_TEXT_TOOLS } from './adminUtils';

interface AdminNewsTabProps {
  news: NewsItem[];
}

export const AdminNewsTab: React.FC<AdminNewsTabProps> = ({ news }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">図書館だより（PDF保存・画像プレビュー）</h3>
        <button onClick={() => createItem('news', { date: new Date().toISOString().split('T')[0], title: '新規図書館だより', content: '' })} className="bg-oct-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-oct-800 transition-all flex items-center gap-2">
          <Plus size={18}/> だより新規作成
        </button>
      </div>
      <div className="grid gap-12">
        {news.map(item => (
          <div key={item.id} className="border p-8 rounded-[3rem] bg-oct-50/20 border-oct-100 shadow-sm">
            <div className="flex justify-between mb-8">
              <input value={item.title} onChange={e => updateItem('news', item.id, {title: e.target.value})} className="text-2xl font-bold bg-transparent border-b-2 border-oct-200 flex-1 mr-4 outline-none focus:border-oct-500" placeholder="タイトルを入力" />
              <button onClick={() => removeItem('news', item.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-full"><Trash2 size={24}/></button>
            </div>
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {RICH_TEXT_TOOLS.map(tool => (
                    <button key={tool.label} onClick={() => insertTag(item.content, 'content', 'news', item.id, tool.tagStart, tool.tagEnd)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${tool.bg} ${tool.color} shadow-sm hover:scale-105 transition-transform`}>
                      {tool.label}
                    </button>
                  ))}
                </div>
                <textarea value={item.content} onChange={e => updateItem('news', item.id, {content: e.target.value})} className="w-full h-80 p-6 border rounded-[2rem] text-sm font-mono shadow-inner outline-none focus:ring-2 ring-oct-100 bg-white" placeholder="本文を入力..." />
              </div>
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center justify-between gap-4 cursor-pointer bg-white border border-oct-200 p-4 rounded-2xl hover:bg-oct-50 transition-colors shadow-sm">
                    <div className="flex items-center gap-3">
                      <Upload size={20} className="text-red-500"/>
                      <div>
                         <p className="text-xs font-bold">PDF（配布用）</p>
                         <p className="text-[10px] text-gray-400">{item.fileName || '未アップロード'}</p>
                      </div>
                    </div>
                    <input type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], item.id, 'news', 'pdfUrl')} />
                  </label>
                  <label className="flex items-center justify-between gap-4 cursor-pointer bg-white border border-oct-200 p-4 rounded-2xl hover:bg-oct-50 transition-colors shadow-sm">
                    <div className="flex items-center gap-3">
                      <ImageIcon size={20} className="text-blue-500"/>
                      <div>
                         <p className="text-xs font-bold">PNGプレビュー（表示用）</p>
                         <p className="text-[10px] text-gray-400">{item.previewImageUrl ? 'アップロード済' : '未アップロード'}</p>
                      </div>
                    </div>
                    <input type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], item.id, 'news', 'previewImageUrl')} />
                  </label>
                </div>
                <div className="border rounded-[2rem] p-8 h-80 overflow-y-auto rich-text bg-white shadow-sm border-oct-100" dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};