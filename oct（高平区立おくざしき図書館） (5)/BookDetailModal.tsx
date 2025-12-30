import React, { useState } from 'react';
import { Book, Review } from './types';
import { BookOpen, User, Tag, Heart, CheckCircle, Info, MessageSquare, Star, Send, ShieldCheck, PenTool } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';

interface BookDetailModalProps {
  book: Book;
  isReserved: boolean;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ 
  book, 
  isReserved, 
  isBookmarked, 
  onToggleBookmark 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [reservationData, setReservationData] = useState({ name: '', pass: '' });
  const [reviewData, setReviewData] = useState({ user: '', comment: '', rating: 5 });
  const [isReserving, setIsReserving] = useState(false);

  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationData.name || !reservationData.pass) return;

    try {
      await addDoc(collection(db, 'reservations'), {
        bookId: book.id,
        bookTitle: book.title,
        userName: reservationData.name,
        passphrase: reservationData.pass,
        timestamp: new Date().toLocaleString('ja-JP'),
        status: 'PENDING'
      });
      setShowConfirm(true);
      setReservationData({ name: '', pass: '' });
      setIsReserving(false);
      setTimeout(() => setShowConfirm(false), 3000);
    } catch (err) {
      alert('予約に失敗しました。');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewData.comment || !reviewData.user) return;

    const newReview: Review = {
      id: Date.now().toString(),
      user: reviewData.user,
      comment: reviewData.comment,
      rating: reviewData.rating,
      timestamp: new Date().toLocaleString('ja-JP')
    };

    try {
      await updateDoc(doc(db, 'books', book.id), {
        reviews: arrayUnion(newReview)
      });
      setReviewData({ user: '', comment: '', rating: 5 });
    } catch (err) {
      alert('口コミの投稿に失敗しました。');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Book Main Section - No Image Layout */}
      <div className="bg-white rounded-[3rem] shadow-xl border border-oct-100 animate-fade-in relative p-12 overflow-hidden">
        {showConfirm && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up bg-oct-900 text-white px-8 py-3 rounded-full flex items-center gap-3 shadow-2xl">
            <CheckCircle size={18} className="text-oct-300" />
            <span className="text-sm font-bold">予約を受け付けました</span>
          </div>
        )}
        
        {/* Decorative Background Icon */}
        <BookOpen className="absolute -right-10 -bottom-10 text-oct-50 w-96 h-96 opacity-50" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
           <div className="inline-flex items-center gap-2 bg-oct-50 px-4 py-2 rounded-full">
              <Tag size={14} className="text-oct-500" />
              <span className="text-sm font-bold text-oct-800">{book.category}</span>
           </div>
           
           <h2 className="text-4xl md:text-5xl font-bold text-oct-950 leading-tight">{book.title}</h2>
           
           <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-oct-500">
             <div className="flex items-center gap-2">
               <User size={18} /> <span className="text-lg">{book.author} 著</span>
             </div>
             {book.publisher && (
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-oct-300 rounded-full"></span>
                  <span>{book.publisher}</span>
               </div>
             )}
             {book.publishedDate && (
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-oct-300 rounded-full"></span>
                  <span>{book.publishedDate} 発行</span>
               </div>
             )}
           </div>

           <div className="py-8">
             <div className="bg-oct-50/50 p-8 rounded-3xl border border-oct-100 text-left">
               <p className="text-gray-700 leading-loose font-medium text-lg">
                 {book.description}
               </p>
             </div>
           </div>

           <div className="flex flex-col md:flex-row gap-4 justify-center max-w-xl mx-auto">
            {!isReserving ? (
              <button 
                onClick={() => setIsReserving(true)}
                disabled={isReserved}
                className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg ${isReserved ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-oct-900 text-white hover:bg-oct-800 active:scale-95'}`}
              >
                <BookOpen size={20} /> {isReserved ? '現在貸出中です' : 'この本を予約する'}
              </button>
            ) : (
              <form onSubmit={handleReserveSubmit} className="w-full p-6 bg-oct-50 rounded-3xl border border-oct-200 animate-slide-up space-y-4 text-left">
                <div className="flex items-center gap-2 mb-2 text-oct-900 justify-center">
                  <ShieldCheck size={18} /> <span className="text-xs font-bold">予約フォーム</span>
                </div>
                <input 
                  required 
                  placeholder="お名前" 
                  className="w-full p-3 text-sm border rounded-xl outline-none" 
                  value={reservationData.name} 
                  onChange={e => setReservationData({...reservationData, name: e.target.value})}
                />
                <input 
                  required 
                  type="password" 
                  placeholder="合言葉 (受け取り時に確認します)" 
                  className="w-full p-3 text-sm border rounded-xl outline-none" 
                  value={reservationData.pass} 
                  onChange={e => setReservationData({...reservationData, pass: e.target.value})}
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-oct-900 text-white py-3 rounded-xl font-bold text-xs">予約を確定する</button>
                  <button type="button" onClick={() => setIsReserving(false)} className="px-4 border rounded-xl text-xs text-gray-500 bg-white">キャンセル</button>
                </div>
              </form>
            )}
            {!isReserving && (
              <button 
                onClick={onToggleBookmark}
                className={`px-6 py-4 rounded-2xl transition-all border flex items-center justify-center gap-2 ${isBookmarked ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white border-oct-200 text-oct-300 hover:bg-oct-50'}`}
              >
                <Heart size={20} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <h3 className="text-2xl font-bold flex items-center gap-3 serif"><MessageSquare className="text-oct-500" /> みなさんの口コミ</h3>
          <div className="space-y-6">
            {book.reviews && book.reviews.length > 0 ? (
              book.reviews.map(r => (
                <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-oct-100 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-oct-900 flex items-center gap-2"><User size={14}/> {r.user}</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} />)}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                  <span className="text-[10px] text-gray-300 block mt-4">{r.timestamp}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic text-center py-10 bg-oct-50/30 rounded-2xl border border-dashed border-oct-100">まだ口コミがありません。最初の一人になりませんか？</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white p-8 rounded-3xl shadow-xl border border-oct-100">
            <h4 className="font-bold mb-6 text-oct-900 flex items-center gap-2"><PenTool size={16}/> 口コミを書く</h4>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <input required placeholder="お名前" className="w-full p-3 text-sm border rounded-xl outline-none" value={reviewData.user} onChange={e => setReviewData({...reviewData, user: e.target.value})} />
              <div className="flex gap-2 items-center mb-2">
                <span className="text-xs text-gray-400">評価:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setReviewData({...reviewData, rating: star})}>
                    <Star size={20} className={reviewData.rating >= star ? 'text-amber-400' : 'text-gray-200'} fill={reviewData.rating >= star ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              <textarea required placeholder="本を読んだ感想を教えてください..." className="w-full h-32 p-4 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-oct-50" value={reviewData.comment} onChange={e => setReviewData({...reviewData, comment: e.target.value})} />
              <button className="w-full bg-oct-900 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-oct-800">
                <Send size={16} /> 感想を投稿する
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};