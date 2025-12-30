import React from 'react';
import { NewsItem } from './types';
import { FileText, Download, Calendar, Image as ImageIcon } from 'lucide-react';

interface NewsDetailModalProps {
  news: NewsItem;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white p-8 md:p-16 rounded-3xl shadow-xl border border-oct-100 animate-fade-in">
      <header className="mb-12 border-b border-oct-100 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-oct-400 tracking-widest mb-4 uppercase">
          <Calendar size={14} />
          <time>{news.date}</time>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-oct-950 leading-tight">{news.title}</h2>
      </header>
      
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <div className="rich-text leading-loose" dangerouslySetInnerHTML={{ __html: news.content }} />
          
          {/* Large Preview Image */}
          {(news.previewImageUrl || news.pdfUrl) && (
            <div className="rounded-2xl border-4 border-oct-50 overflow-hidden shadow-inner bg-oct-50">
               <img src={news.previewImageUrl || news.pdfUrl} alt="Newsletter Page 1" className="w-full h-auto" />
            </div>
          )}
        </div>
        
        <aside className="space-y-6">
          <div className="bg-oct-50 p-8 rounded-3xl border border-oct-100 shadow-sm sticky top-24">
            <h4 className="font-bold text-sm mb-6 text-oct-900 border-b border-oct-200 pb-2">アーカイブ</h4>
            
            <div className="space-y-4">
              {news.pdfUrl && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-red-500 bg-white p-3 rounded-xl border">
                    <FileText size={20} /> <span className="text-[10px] font-bold">PDFバージョン</span>
                  </div>
                  <a 
                    href={news.pdfUrl} 
                    download={news.fileName || 'newsletter.pdf'}
                    className="flex items-center justify-center gap-2 bg-oct-900 text-white p-4 rounded-xl text-xs font-bold w-full hover:bg-oct-800 transition-all shadow-md active:scale-95"
                  >
                    <Download size={14}/> PDFダウンロード
                  </a>
                </div>
              )}
              
              {news.previewImageUrl && (
                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-blue-500 bg-white p-3 rounded-xl border">
                    <ImageIcon size={20} /> <span className="text-[10px] font-bold">画像(PNG)バージョン</span>
                  </div>
                  <a 
                    href={news.previewImageUrl} 
                    download={`oct_newsletter_${news.date}.png`}
                    className="flex items-center justify-center gap-2 bg-white border-2 border-oct-900 text-oct-900 p-4 rounded-xl text-xs font-bold w-full hover:bg-oct-50 transition-all"
                  >
                    <Download size={14}/> 画像保存
                  </a>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-oct-200">
              <p className="text-[9px] text-gray-400 leading-relaxed italic">
                ※「図書館だより」のバックナンバーは、館内備え付けのファイルでも閲覧可能です。
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};