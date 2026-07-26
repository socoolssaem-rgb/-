import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Star, 
  Sparkles, 
  PenTool, 
  Flame, 
  Award, 
  HeartHandshake, 
  Compass, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Bookmark,
  Library
} from 'lucide-react';
import { RECOMMENDED_BOOKS, RecommendedBook } from '../data/quotesData';
import { TabType } from '../types';

interface BookstoreLibraryShelfProps {
  onSelectBook: (title: string, author: string, publisher: string) => void;
  setActiveTab: (tab: TabType) => void;
  totalRecordsCount: number;
}

export const BookstoreLibraryShelf: React.FC<BookstoreLibraryShelfProps> = ({
  onSelectBook,
  setActiveTab,
  totalRecordsCount
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookForModal, setSelectedBookForModal] = useState<RecommendedBook | null>(null);

  // Monthly Class Goal (e.g. 30 books)
  const monthlyGoal = 30;
  const progressPercent = Math.min(100, Math.round((totalRecordsCount / monthlyGoal) * 100));

  const filteredBooks = RECOMMENDED_BOOKS.filter((b) => {
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleApplyBookAndWrite = (b: RecommendedBook) => {
    onSelectBook(b.title, b.author, b.publisher);
    setActiveTab('write');
  };

  return (
    <div className="space-y-8 my-8">
      
      {/* Top Bookstore Banner & Reading Thermometer */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/40 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200/60 text-amber-900 border border-amber-300 text-xs font-bold">
              <Library className="w-4 h-4 text-amber-700" />
              <span>온라인 학급 서점 · 디지털 서가</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-stone-900 tracking-tight">
              책향기 감성 서가 & 추천 도서 📚
            </h2>
            <p className="text-stone-600 text-sm max-w-xl leading-relaxed">
              선생님과 학생들이 직접 고른 베스트셀러 및 따뜻한 추천작입니다. 마음에 드는 책을 선택하여 바로 나만의 독서 소감을 남겨보세요.
            </p>
          </div>

          {/* Reading Thermometer Widget */}
          <div className="w-full md:w-80 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-amber-200 shadow-sm space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800">
              <span className="flex items-center gap-1.5 text-amber-800">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>이달의 학급 독서 온도계</span>
              </span>
              <span className="text-amber-600 font-extrabold">{totalRecordsCount} / {monthlyGoal}권 ({progressPercent}%)</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3.5 bg-amber-100 rounded-full overflow-hidden border border-amber-200 p-0.5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-stone-500 text-center font-medium">
              {progressPercent >= 100 
                ? '🎉 이달의 목표 달성! 대단합니다!' 
                : `목표까지 ${monthlyGoal - totalRecordsCount}권 남았습니다! 힘내세요 💪`}
            </p>
          </div>
        </div>
      </div>

      {/* Bookstore Controls: Category Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
          {[
            { id: 'all', label: '전체 도서', icon: <Library className="w-3.5 h-3.5" /> },
            { id: 'bestseller', label: '베스트셀러', icon: <Flame className="w-3.5 h-3.5 text-amber-500" /> },
            { id: 'teacher', label: '교사추천', icon: <Award className="w-3.5 h-3.5 text-indigo-500" /> },
            { id: 'emotional', label: '감성소설', icon: <HeartHandshake className="w-3.5 h-3.5 text-rose-500" /> },
            { id: 'growth', label: '성장 & SF', icon: <Compass className="w-3.5 h-3.5 text-teal-500" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="도서명, 저자 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
          />
        </div>

      </div>

      {/* Book Grid - 3D Realistic Book Cover Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <motion.div
            key={book.id}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
          >
            {/* Upper Section: Stylized 3D Book Cover Visual */}
            <div className={`p-6 bg-gradient-to-br ${book.coverGradient} text-white relative overflow-hidden min-h-[170px] flex flex-col justify-between`}>
              
              {/* Book Spine Simulation */}
              <div className="absolute top-0 left-0 bottom-0 w-3 bg-white/20 backdrop-blur-xs border-r border-white/20 shadow-inner" />

              {/* Top Badges */}
              <div className="flex items-center justify-between pl-2 relative z-10">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-black/40 backdrop-blur-md text-amber-200 border border-white/20">
                  {book.categoryLabel}
                </span>
                {book.badge && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-900 shadow-sm">
                    {book.badge}
                  </span>
                )}
              </div>

              {/* Title & Author on Book Cover */}
              <div className="pl-2 relative z-10 mt-4 space-y-1">
                <h3 className="text-xl font-serif font-bold text-white leading-tight drop-shadow-md">
                  {book.title}
                </h3>
                <p className="text-xs text-amber-100/90 font-medium">
                  {book.author} · {book.publisher}
                </p>
              </div>

              {/* Quote Ribbon snippet */}
              <div className="pl-2 mt-3 pt-2 border-t border-white/20 text-xs font-serif italic text-amber-200 line-clamp-1">
                {book.quoteSnippet}
              </div>

            </div>

            {/* Lower Section: Book Information & Actions */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between bg-white">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center text-amber-500 font-bold gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{book.rating}</span>
                    <span className="text-slate-400 font-normal">({book.reviewCount}명 추천)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {book.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedBookForModal(book)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Bookmark className="w-3.5 h-3.5" /> 상세보기
                </button>

                <button
                  onClick={() => handleApplyBookAndWrite(book)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>이 책으로 기록쓰기</span>
                </button>
              </div>

            </div>

          </motion.div>
        ))}
      </div>

      {/* Book Detail Modal */}
      {selectedBookForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative overflow-hidden">
            
            <div className={`-mx-6 sm:-mx-8 -mt-6 sm:-mt-8 p-6 bg-gradient-to-br ${selectedBookForModal.coverGradient} text-white space-y-2 relative`}>
              <button
                onClick={() => setSelectedBookForModal(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 p-1.5 rounded-full"
              >
                ✕
              </button>
              <span className="px-2.5 py-0.5 rounded bg-black/30 text-amber-200 text-xs font-bold">
                {selectedBookForModal.categoryLabel}
              </span>
              <h3 className="text-2xl font-serif font-bold">{selectedBookForModal.title}</h3>
              <p className="text-xs text-amber-100">{selectedBookForModal.author} / {selectedBookForModal.publisher}</p>
            </div>

            <div className="space-y-3 text-slate-700 text-sm">
              <div>
                <h4 className="text-xs font-bold text-slate-400 mb-1">핵심 명언 / 대표 구절</h4>
                <p className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-serif italic text-xs">
                  {selectedBookForModal.quoteSnippet}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 mb-1">책 줄거리</h4>
                <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedBookForModal.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedBookForModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  handleApplyBookAndWrite(selectedBookForModal);
                  setSelectedBookForModal(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <PenTool className="w-4 h-4" />
                <span>이 책 독서기록 작성하기</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
