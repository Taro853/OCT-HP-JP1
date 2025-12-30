import React, { useState } from 'react';
import { Book } from './types';
import { Plus, Trash2, Sparkles, Bot, Send } from 'lucide-react';
import { createItem, updateItem, removeItem } from './adminUtils';
import { GoogleGenAI, Type } from "@google/genai";

interface AdminBooksTabProps {
  books: Book[];
}

export const AdminBooksTab: React.FC<AdminBooksTabProps> = ({ books }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiMessage, setAiMessage] = useState('');

  const fetchBookDetailsAI = async (bookId: string, title: string) => {
    if (!title) return alert('タイトルを入力してください');
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `書籍「${title}」の情報を日本語で取得してください。`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              author: { type: Type.STRING, description: '著者名' },
              publisher: { type: Type.STRING, description: '出版社名' },
              publishedDate: { type: Type.STRING, description: '出版年月日' },
              description: { type: Type.STRING, description: '100文字程度の内容紹介' },
              category: { type: Type.STRING, description: '書籍のジャンル' },
            },
            required: ["author", "publisher", "publishedDate", "description", "category"],
          }
        }
      });
      
      const text = response.text;
      if (text) {
        const data = JSON.parse(text.trim());
        await updateItem('books', bookId, data);
      }
    } catch (err) {
      console.error(err);
      alert('AIによる情報取得に失敗しました');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiBulkRegister = async () => {
    if (!aiChatInput) return;
    setIsAiLoading(true);
    setAiMessage('AI司書が蔵書データを作成中...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `司書の要望「${aiChatInput}」に基づき、登録すべき蔵書リストを作成してください。`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                author: { type: Type.STRING },
                publisher: { type: Type.STRING },
                publishedDate: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
              },
              required: ["title", "author", "publisher", "publishedDate", "description", "category"]
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const newBooks = JSON.parse(text.trim());
        for (const b of newBooks) {
          await createItem('books', { ...b, isNew: true, isRecommended: false, reviews: [], coverUrl: '' });
        }
        setAiMessage(`${newBooks.length}件の蔵書を登録しました。`);
        setAiChatInput('');
      }
    } catch (err) {
      setAiMessage('エラーが発生しました。');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* AI司書セクション */}
      <div className="bg-oct-50 rounded-[2rem] p-8 border border-oct-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-oct-900 text-white rounded-full flex items-center justify-center shadow-lg">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI司書アシスタント</h3>
            <p className="text-[10px] text-gray-400">蔵書の追加を自然な言葉で頼んでください</p>
          </div>
        </div>
        <div className="flex gap-3">
          <input 
            value={aiChatInput}
            onChange={e => setAiChatInput(e.target.value)}
            placeholder="例：夏目漱石の代表作を3冊追加して / 最近のミステリーのおすすめを5冊登録"
            className="flex-1 bg-white border border-oct-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-oct-100 shadow-inner"
            onKeyDown={e => e.key === 'Enter' && handleAiBulkRegister()}
          />
          <button 
            onClick={handleAiBulkRegister}
            disabled={isAiLoading || !aiChatInput}
            className="bg-oct-900 text-white px-8 rounded-2xl font-bold shadow-lg hover:bg-oct-800 disabled:opacity-50 flex items-center gap-2"
          >
            {isAiLoading ? <Sparkles className="animate-spin" size={20}/> : <Send size={20}/>}
            一括登録
          </button>
        </div>
        {aiMessage && <p className="mt-4 text-sm font-bold text-oct-600 animate-fade-in">{aiMessage}</p>}
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">蔵書データベース</h3>
        <button onClick={() => createItem('books', { title: '新規タイトル', author: '著者名', category: '小説', isNew: true, isRecommended: false, reviews: [], coverUrl: '' })} className="bg-oct-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-transform">
          <Plus size={18} className="inline mr-2"/> 本を手動で追加
        </button>
      </div>

      <div className="grid gap-4">
        {books.map(book => (
          <div key={book.id} className="border-2 border-oct-50 rounded-[2rem] p-8 bg-oct-50/10 hover:border-oct-100 transition-colors">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                   <input value={book.title} onChange={e => updateItem('books', book.id, {title: e.target.value})} className="text-2xl font-bold w-full bg-transparent border-b-2 border-oct-200 outline-none focus:border-oct-500" placeholder="タイトル" />
                   <div className="flex gap-2">
                     <button 
                      disabled={isAiLoading}
                      onClick={() => fetchBookDetailsAI(book.id, book.title)} 
                      className="flex items-center gap-2 bg-oct-100 text-oct-700 px-3 py-1.5 rounded-full text-[10px] font-bold hover:bg-oct-200 transition-colors disabled:opacity-50"
                     >
                      <Sparkles size={12} className={isAiLoading ? "animate-spin" : ""}/> AIで詳細を取得
                     </button>
                   </div>
                </div>
                <button onClick={() => removeItem('books', book.id)} className="text-red-300 hover:text-red-500"><Trash2 size={24}/></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-400 mb-1">著者</label>
                  <input value={book.author} onChange={e => updateItem('books', book.id, {author: e.target.value})} className="text-sm border-b p-1 bg-transparent" placeholder="著者名" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-400 mb-1">出版社</label>
                  <input value={book.publisher || ''} onChange={e => updateItem('books', book.id, {publisher: e.target.value})} className="text-sm border-b p-1 bg-transparent" placeholder="出版社" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-400 mb-1">出版年月日</label>
                  <input value={book.publishedDate || ''} onChange={e => updateItem('books', book.id, {publishedDate: e.target.value})} className="text-sm border-b p-1 bg-transparent" placeholder="出版日" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-400 mb-1">ジャンル</label>
                  <input value={book.category} onChange={e => updateItem('books', book.id, {category: e.target.value})} className="text-sm border-b p-1 bg-transparent" placeholder="ジャンル" />
                </div>
              </div>
              <textarea value={book.description} onChange={e => updateItem('books', book.id, {description: e.target.value})} className="w-full h-24 text-xs border p-4 rounded-2xl bg-white outline-none" placeholder="内容紹介" />
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={book.isRecommended} onChange={e => updateItem('books', book.id, {isRecommended: e.target.checked})} className="w-4 h-4 text-oct-900 rounded" />
                  <span className="text-xs font-bold">おすすめ記事に掲載</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={book.isNew} onChange={e => updateItem('books', book.id, {isNew: e.target.checked})} className="w-4 h-4 text-oct-900 rounded" />
                  <span className="text-xs font-bold">新刊マークを表示</span>
                </label>
                <div className="text-[10px] text-gray-400 font-bold ml-auto italic">口コミ累計: {book.reviews?.length || 0} 件</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};