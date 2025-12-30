import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

export const RICH_TEXT_TOOLS = [
  { label: '大見出し', tagStart: '<div class="rt-h1-style">', tagEnd: '</div>', color: 'text-oct-900', bg: 'bg-white' },
  { label: '中見出し', tagStart: '<div class="rt-h2-style">', tagEnd: '</div>', color: 'text-oct-700', bg: 'bg-white' },
  { label: '強調大', tagStart: '<span class="rt-text-lg">', tagEnd: '</span>', color: 'text-oct-900', bg: 'bg-white font-bold' },
  { label: '赤字', tagStart: '<span class="rt-text-red">', tagEnd: '</span>', color: 'text-red-600', bg: 'bg-white' },
  { label: '青字', tagStart: '<span class="rt-text-blue">', tagEnd: '</span>', color: 'text-blue-600', bg: 'bg-white' },
  { label: '黄マーカー', tagStart: '<span class="rt-marker-yellow">', tagEnd: '</span>', color: 'text-black', bg: 'bg-yellow-200' },
  { label: '桃マーカー', tagStart: '<span class="rt-marker-pink">', tagEnd: '</span>', color: 'text-black', bg: 'bg-pink-200' },
  { label: '情報BOX', tagStart: '<div class="rt-box-info">', tagEnd: '</div>', color: 'text-blue-700', bg: 'bg-blue-50' },
  { label: '警告BOX', tagStart: '<div class="rt-box-warning">', tagEnd: '</div>', color: 'text-amber-700', bg: 'bg-amber-50' },
  { label: '引用', tagStart: '<div class="rt-box-quote">', tagEnd: '</div>', color: 'text-gray-600', bg: 'bg-gray-100' },
];

export const createItem = async (collectionName: string, data: any) => {
  await addDoc(collection(db, collectionName), data);
};

export const updateItem = async (collectionName: string, id: string, data: any) => {
  await updateDoc(doc(db, collectionName, id), data);
};

export const removeItem = async (collectionName: string, id: string) => {
  if (confirm('本当に削除しますか？')) {
    await deleteDoc(doc(db, collectionName, id));
  }
};

export const insertTag = (current: string, field: string, collectionName: string, id: string, tagStart: string, tagEnd: string, isFeature = false, featureData?: any) => {
  const newVal = (current || '') + `${tagStart}テキスト${tagEnd}`;
  if (isFeature && featureData) {
    setDoc(doc(db, 'features', 'current_feature'), { ...featureData, content: newVal });
  } else {
    updateDoc(doc(db, collectionName, id), { [field]: newVal });
  }
};

export const handleFileUpload = (file: File, id: string, collectionName: string, field: 'pdfUrl' | 'previewImageUrl') => {
  const reader = new FileReader();
  reader.onload = (e) => {
    updateDoc(doc(db, collectionName, id), { 
      [field]: e.target?.result as string, 
      fileName: file.name 
    });
  };
  reader.readAsDataURL(file);
};