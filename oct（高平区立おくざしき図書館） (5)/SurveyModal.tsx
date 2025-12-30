
import React from 'react';
import { SurveyQuestion } from './types';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface SurveyModalProps {
  questions: SurveyQuestion[];
  onSubmit: () => void;
}

export const SurveyModal: React.FC<SurveyModalProps> = ({ questions, onSubmit }) => {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmit();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-oct-950">ご協力ありがとうございました</h2>
        <p className="text-gray-500">
          お送りいただいた貴重なご意見は、<br/>
          より良い図書館づくりのために活用させていただきます。
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 animate-fade-in">
      <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-oct-100">
        <div className="w-16 h-16 bg-oct-50 text-oct-900 rounded-2xl flex items-center justify-center mb-8 mx-auto">
          <MessageSquare size={32} />
        </div>
        
        <h2 className="text-3xl font-bold mb-4 text-center text-oct-950">利用者アンケート</h2>
        <p className="text-center text-gray-500 text-sm mb-12 leading-relaxed">
          OCTおくざしき図書館をより快適にご利用いただくため、<br/>
          皆様の率直なご感想をお聞かせください。
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-10">
          {questions.map((q) => (
            <div key={q.id} className="space-y-4">
              <label className="block font-bold text-lg text-oct-900">
                <span className="text-oct-400 mr-2 text-sm uppercase tracking-tighter">Question</span><br/>
                {q.text}
              </label>
              
              {q.type === 'choice' ? (
                <div className="grid grid-cols-2 gap-3">
                   {['毎日', '週に1回程度', '月に1回程度', 'たまに'].map(choice => (
                     <label key={choice} className="flex items-center gap-3 p-4 border border-oct-100 rounded-2xl cursor-pointer hover:bg-oct-50 transition-colors group">
                       <input type="radio" name={q.id} className="w-4 h-4 text-oct-900 focus:ring-oct-500" />
                       <span className="text-sm font-medium text-gray-600 group-hover:text-oct-900">{choice}</span>
                     </label>
                   ))}
                </div>
              ) : (
                <textarea 
                  className="w-full border-2 border-oct-50 p-6 rounded-3xl h-40 outline-none focus:border-oct-200 focus:ring-4 ring-oct-50/50 transition-all text-sm leading-relaxed" 
                  placeholder="こちらにご記入ください（匿名でも構いません）"
                  required
                />
              )}
            </div>
          ))}
          
          <button className="w-full bg-oct-900 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-oct-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
            <Send size={20} /> アンケートを送信する
          </button>
        </form>
        
        <p className="mt-8 text-[10px] text-center text-gray-400 uppercase tracking-widest">
          Privacy Protection Enabled &bull; Secure Submission
        </p>
      </div>
    </div>
  );
};
