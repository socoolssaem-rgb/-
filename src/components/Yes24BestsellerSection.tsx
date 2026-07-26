import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Search, 
  RefreshCw, 
  BookOpen, 
  PenTool, 
  Award, 
  Filter, 
  ChevronDown, 
  Bookmark, 
  X, 
  AlertCircle, 
  Building2, 
  User, 
  Tag, 
  Trophy,
  Sparkles
} from 'lucide-react';
import { TabType } from '../types';

export interface Yes24Book {
  rank: number;
  title: string;
  author: string;
  publisher: string;
  description: string;
  category: string;
}

interface Yes24BestsellerSectionProps {
  onSelectBook: (title: string, author: string, publisher: string) => void;
  setActiveTab?: (tab: TabType) => void;
}

const YES24_API_URL = 'https://script.google.com/macros/s/AKfycbwrrL-qXGoZ7ZkYgR4jOSADT3Dppw8DzgGyk3JZM2k3TnAQV8TG2PPE97v1_LI_lojb/exec';

export const Yes24BestsellerSection: React.FC<Yes24BestsellerSectionProps> = ({
  onSelectBook,
  setActiveTab
}) => {
  const [books, setBooks] = useState<Yes24Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBookForModal, setSelectedBookForModal] = useState<Yes24Book | null>(null);
  const [displayLimit, setDisplayLimit] = useState<number>(18);

  const fetchBestsellers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(YES24_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
      }
      const json = await response.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        setBooks(json.data);
      } else if (Array.isArray(json)) {
        setBooks(json);
      } else {
        throw new Error(json.message || '데이터를 불러오는 데 실패했습니다.');
      }
    } catch (err: any) {
      console.error('YES24 Bestseller fetch error:', err);
      setError(err.message || '예스24 베스트셀러 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestsellers();
  }, []);

  // Extract unique categories dynamically
  const categories = Array.from(
    new Set(books.map((b) => b.category).filter(Boolean))
  ).sort();

  // Filter books
  const filteredBooks = books.filter((b) => {
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.publisher.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const visibleBooks = filteredBooks.slice(0, displayLimit);

  const handleApplyBook = (book: Yes24Book) => {
    onSelectBook(book.title, book.author, book.publisher);
    if (setActiveTab) {
      setActiveTab('write');
    }
  };

  // Helper for rank badge styling
  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) {
      return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 shadow-md ring-2 ring-amber-300';
    }
    if (rank === 2) {
      return 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-950 shadow-sm';
    }
    if (rank === 3) {
      return 'bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 shadow-sm';
    }
    return 'bg-stone-800 text-amber-200 border border-amber-900/40';
  };

  return (
    <div className="bg-gradient-to-b from-stone-900 via-stone-900/95 to-slate-900 text-amber-50 rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/40 my-8 space-y-6 relative overflow-hidden">
      
      {/* Decorative Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-900/50 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold">
            <Flame className="w-4 h-4 text-red-400 fill-red-400" />
            <span>실시간 연동 데이터</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-100 tracking-tight flex items-center gap-2">
            예스24 베스트셀러 라이브 서가 📖
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/70">
            실시간 예스24 인기도서 목록입니다. 관심 있는 책을 선택하여 바로 독서 기록을 작성해 보세요.
          </p>
        </div>

        <button
          onClick={fetchBestsellers}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 border border-amber-900/50 text-xs font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>{loading ? '불러오는 중...' : '데이터 새로고침'}</span>
        </button>
      </div>

      {/* Control Bar: Category Filters & Search */}
      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-stone-950/80 p-4 rounded-2xl border border-amber-900/40">
        
        {/* Category Tabs & Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          {/* '전체' Filter Button */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-800 text-amber-200 hover:bg-stone-700 border border-stone-700'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>전체 ({books.length})</span>
          </button>

          {/* Category Dropdown */}
          {categories.length > 0 && (
            <div className="relative inline-flex items-center">
              <Filter className="w-3.5 h-3.5 text-amber-400 absolute left-3 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-8 pr-8 py-2 rounded-xl bg-stone-800 text-amber-200 border border-stone-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
              >
                <option value="all">관리분류 선택 (전체)</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-3 pointer-events-none" />
            </div>
          )}

          {/* Category Pill Badges (First 4 for quick access) */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-stone-900 text-stone-400 hover:text-amber-200 border border-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="도서명, 저자, 출판사 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-900 text-amber-100 border border-stone-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-stone-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-amber-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center space-y-4">
          <div className="inline-block w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-200/80 text-sm font-serif">예스24 베스트셀러 도서 목록을 불러오는 중입니다...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={fetchBestsellers}
            className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold transition-all"
          >
            다시 시도하기
          </button>
        </div>
      )}

      {/* Content Grid */}
      {!loading && !error && (
        <>
          {filteredBooks.length === 0 ? (
            <div className="py-12 text-center text-amber-200/60 text-sm font-serif space-y-2">
              <BookOpen className="w-8 h-8 text-amber-500/40 mx-auto" />
              <p>검색 결과에 맞는 베스트셀러 도서가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleBooks.map((book) => (
                <motion.div
                  key={`${book.rank}-${book.title}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-stone-800/90 rounded-2xl p-5 border border-amber-900/30 hover:border-amber-500/50 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between group space-y-4 relative overflow-hidden"
                >
                  {/* Card Header: Rank & Category */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 ${getRankBadgeStyle(book.rank)}`}>
                        {book.rank <= 3 && <Award className="w-3.5 h-3.5" />}
                        <span>#{book.rank}위</span>
                      </span>

                      {book.category && (
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {book.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Author Info */}
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-amber-100 group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                      {book.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-amber-200/70 font-medium">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-amber-400/80" />
                        {book.author || '저자 미상'}
                      </span>
                      {book.publisher && (
                        <span className="flex items-center gap-1 text-amber-300/60">
                          <Building2 className="w-3.5 h-3.5 text-amber-400/80" />
                          {book.publisher}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description Preview */}
                  {book.description && (
                    <p className="text-xs text-stone-300/80 leading-relaxed line-clamp-3 bg-stone-950/50 p-3 rounded-xl border border-stone-800 font-serif">
                      {book.description}
                    </p>
                  )}

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-amber-950/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedBookForModal(book)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-700 text-amber-200 text-xs font-semibold border border-stone-700 transition-colors flex items-center gap-1"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                      <span>상세보기</span>
                    </button>

                    <button
                      onClick={() => handleApplyBook(book)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>기록 작성하기</span>
                    </button>
                  </div>

                </motion.div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {visibleBooks.length < filteredBooks.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setDisplayLimit((prev) => prev + 18)}
                className="px-6 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold transition-all"
              >
                베스트셀러 더보기 ({filteredBooks.length - visibleBooks.length}권 남음)
              </button>
            </div>
          )}
        </>
      )}

      {/* Book Detail Modal */}
      {selectedBookForModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-amber-900/60 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-amber-50 relative overflow-hidden">
            
            <button
              onClick={() => setSelectedBookForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-800 text-amber-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${getRankBadgeStyle(selectedBookForModal.rank)}`}>
                  #{selectedBookForModal.rank}위
                </span>
                {selectedBookForModal.category && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {selectedBookForModal.category}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-serif font-bold text-amber-100">
                {selectedBookForModal.title}
              </h3>

              <p className="text-xs text-amber-200/80">
                {selectedBookForModal.author} | 출판사: {selectedBookForModal.publisher || '미상'}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 도서 소개 및 설명
              </h4>
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs leading-relaxed text-amber-100/90 font-serif max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-900">
                {selectedBookForModal.description || '이 도서에 대한 상세 설명이 제공되지 않았습니다.'}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-amber-900/40">
              <button
                onClick={() => setSelectedBookForModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-amber-200 text-xs font-bold hover:bg-stone-700"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  handleApplyBook(selectedBookForModal);
                  setSelectedBookForModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md flex items-center gap-1.5"
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
