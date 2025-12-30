export interface Review {
  id: string;
  user: string;
  comment: string;
  rating: number;
  timestamp: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  publishedDate?: string;
  description: string;
  coverUrl: string;
  category: string;
  isNew: boolean;
  isRecommended: boolean;
  reviews?: Review[];
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  userName: string;
  passphrase: string;
  timestamp: string;
  status: 'PENDING' | 'READY' | 'COMPLETED';
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  content: string;
  pdfUrl?: string;
  fileName?: string;
  previewImageUrl?: string;
}

export interface Notice {
  id: string;
  date: string;
  title: string;
  category: 'IMPORTANT' | 'EVENT' | 'INFO';
  content: string;
  thumbnailUrl?: string;
}

export interface ClosedDate {
  id: string;
  date: string;
  reason: string;
}

export interface MonthlyFeature {
  title: string;
  subtitle: string;
  description: string;
  content: string;
  imageUrl: string;
  books: string[];
}

export interface Librarian {
  name: string;
  role: string;
  message: string;
  imageUrl: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'text' | 'rating' | 'choice';
}

export type ModalType = 
  | 'NONE'
  | 'ADMIN'
  | 'BOOK_DETAIL'
  | 'NEWS_DETAIL'
  | 'NOTICE_DETAIL'
  | 'ACCESS'
  | 'FEATURE'
  | 'LIBRARIAN'
  | 'SURVEY'
  | 'CALENDAR'
  | 'ALL_BOOKS';

export interface ModalState {
  type: ModalType;
  data?: any;
}