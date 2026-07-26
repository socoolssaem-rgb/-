import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Quote, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Bookmark, 
  BookOpen, 
  Headphones, 
  Lightbulb, 
  Grid, 
  X,
  Heart,
  Share2
} from 'lucide-react';
import { READING_QUOTES, ReadingQuote } from '../data/quotesData';
import { ambientSound, speakQuote, stopSpeaking } from '../utils/audioSynth';

interface ReadingQuotesBannerProps {
  onSelectBookPreset?: (title: string, author: string, publisher: string) => void;
}

export const ReadingQuotesBanner: React.FC<ReadingQuotesBannerProps> = ({
  onSelectBookPreset
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSpeakingQuote, setIsSpeakingQuote] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAllQuotesModal, setShowAllQuotesModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favoriteQuoteIds, setFavoriteQuoteIds] = useState<string[]>(['q1']);

  const currentQuote = READING_QUOTES[currentIndex];

  // Auto-slide quotes every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % READING_QUOTES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Handle Audio Ambient Toggle
  const handleToggleAmbient = () => {
    const active = ambientSound.toggleRainAmbient();
    setIsPlayingAudio(active);
  };

  // Handle Speech Synthesis
  const handleSpeak = (quoteObj: ReadingQuote) => {
    if (isSpeakingQuote) {
      stopSpeaking();
      setIsSpeakingQuote(false);
    } else {
      speakQuote(quoteObj.quote, quoteObj.author);
      setIsSpeakingQuote(true);
    }
  };

  // Handle Shuffle
  const handleShuffle = () => {
    let nextIdx = Math.floor(Math.random() * READING_QUOTES.length);
    if (nextIdx === currentIndex) {
      nextIdx = (currentIndex + 1) % READING_QUOTES.length;
    }
    setCurrentIndex(nextIdx);
  };

  // Copy quote
  const handleCopyQuote = (q: ReadingQuote) => {
    const textToCopy = `"${q.quote}" - ${q.author} (출처: 우리반 전자 독서기록장)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favoriteQuoteIds.includes(id)) {
      setFavoriteQuoteIds(favoriteQuoteIds.filter((fId) => fId !== id));
    } else {
      setFavoriteQuoteIds([...favoriteQuoteIds, id]);
    }
  };

  const filteredQuotes = selectedCategory === 'all'
    ? READING_QUOTES
    : READING_QUOTES.filter(q => q.category === selectedCategory);

  return (
    <div className="relative w-full mb-8">
      
      {/* Top Banner Container - Literary Bookstore Aesthetic */}
      <div className="relative bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-900/40 text-amber-50">
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(217,119,6,0.15),_transparent_70%)]" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 text-amber-500/10 pointer-events-none font-serif text-9xl leading-none select-none">
          “
        </div>

        {/* Top Header Bar inside Banner */}
        <div className="relative z-10 px-6 sm:px-8 pt-6 pb-2 flex flex-wrap items-center justify-between gap-3 border-b border-amber-950/80">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </span>
            <span className="text-xs font-bold text-amber-300 tracking-wider uppercase">
              오늘의 독서 감성 명언 · Literary Quotes
            </span>
          </div>

          {/* Utility Buttons */}
          <div className="flex items-center gap-2">
            {/* Ambient Sound Toggle */}
            <button
              onClick={handleToggleAmbient}
              title="북카페 백색소음 (빗소리) 켜기/끄기"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isPlayingAudio
                  ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20 animate-pulse'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-amber-200 border border-stone-700'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>{isPlayingAudio ? '북카페 BGM 재생 중' : '북카페 소리 켜기'}</span>
            </button>

            {/* View All Quotes Modal Trigger */}
            <button
              onClick={() => setShowAllQuotesModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-800/80 hover:bg-stone-700 text-amber-200 border border-stone-700 transition-all"
            >
              <Grid className="w-3.5 h-3.5 text-amber-400" />
              <span>명언 전체보기 ({READING_QUOTES.length})</span>
            </button>
          </div>
        </div>

        {/* Main Animated Quote Slide */}
        <div className="relative z-10 p-6 sm:p-10 min-h-[220px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Category Badge & Book Link */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  #{currentQuote.categoryLabel}
                </span>

                {currentQuote.bookTitle && (
                  <span className="text-xs text-amber-200/80 font-serif italic flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    출전: 『{currentQuote.bookTitle}』
                  </span>
                )}
              </div>

              {/* Quote Text Display */}
              <div className="relative">
                <Quote className="w-8 h-8 text-amber-500/30 absolute -top-4 -left-3 rotate-180 pointer-events-none" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amber-100 leading-relaxed sm:leading-snug tracking-tight px-3">
                  "{currentQuote.quote}"
                </h2>
              </div>

              {/* Author & Reflection Prompt */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-amber-900/40">
                <div>
                  <p className="text-sm font-semibold text-amber-300">
                    — {currentQuote.author}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-amber-200/70 mt-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{currentQuote.reflectionQuestion}</span>
                  </div>
                </div>

                {/* Quote Action Bar */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* TTS Voice Read */}
                  <button
                    onClick={() => handleSpeak(currentQuote)}
                    title="낭독 음성으로 듣기"
                    className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSpeakingQuote
                        ? 'bg-amber-400 text-stone-900 border-amber-300'
                        : 'bg-stone-800/90 text-amber-200 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    {isSpeakingQuote ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Copy Quote */}
                  <button
                    onClick={() => handleCopyQuote(currentQuote)}
                    title="명언 문구 복사"
                    className="p-2 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-amber-200 border border-stone-700 text-xs font-semibold transition-all flex items-center gap-1"
                  >
                    {copiedId === currentQuote.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {/* Favorite Toggle */}
                  <button
                    onClick={(e) => handleToggleFavorite(currentQuote.id, e)}
                    title="즐겨찾는 명언으로 보관"
                    className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                      favoriteQuoteIds.includes(currentQuote.id)
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-stone-800/90 text-amber-200 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favoriteQuoteIds.includes(currentQuote.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
                  </button>

                  {/* Shuffle Button */}
                  <button
                    onClick={handleShuffle}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>새 명언</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Carousel Pagination Dots & Controls */}
          <div className="flex items-center justify-between pt-6 mt-2 border-t border-amber-950/60">
            <div className="flex items-center gap-1.5">
              {READING_QUOTES.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-7 bg-amber-400'
                      : 'w-2 bg-stone-700 hover:bg-stone-600'
                  }`}
                  aria-label={`명언 ${idx + 1}번째로 이동`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => (prev === 0 ? READING_QUOTES.length - 1 : prev - 1))}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 transition-colors"
                aria-label="이전 명언"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-amber-300/70">
                {currentIndex + 1} / {READING_QUOTES.length}
              </span>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % READING_QUOTES.length)}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 transition-colors"
                aria-label="다음 명언"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Modal: All Quotes Gallery */}
      {showAllQuotesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-amber-900/50 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl text-amber-50 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-amber-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-100 font-serif">독서 감성 명언 컬렉션</h3>
                  <p className="text-xs text-amber-300/70">마음에 울림을 주는 명언을 읽고 간직해 보세요.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAllQuotesModal(false)}
                className="p-2 rounded-full hover:bg-stone-800 text-amber-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-6 py-3 bg-stone-950/60 border-b border-amber-900/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {[
                { id: 'all', label: '전체 보기' },
                { id: 'wisdom', label: '지혜' },
                { id: 'growth', label: '성장' },
                { id: 'comfort', label: '위로' },
                { id: 'courage', label: '용기' },
                { id: 'dream', label: '꿈' },
                { id: 'friendship', label: '우정' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'bg-stone-800 text-amber-200/80 hover:bg-stone-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Modal Body: Quotes Grid */}
            <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh] scrollbar-thin scrollbar-thumb-amber-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuotes.map((q) => {
                  const isFav = favoriteQuoteIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-stone-800/80 border border-amber-900/30 hover:border-amber-500/50 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            #{q.categoryLabel}
                          </span>
                          <button
                            onClick={(e) => handleToggleFavorite(q.id, e)}
                            className="text-stone-400 hover:text-rose-400 transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                        </div>
                        <p className="text-sm font-serif font-semibold text-amber-100 leading-relaxed">
                          "{q.quote}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-amber-950/80 flex items-center justify-between text-xs text-amber-300/80">
                        <span>— {q.author}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSpeak(q)}
                            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-700 text-amber-200"
                            title="음성 듣기"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopyQuote(q)}
                            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-700 text-amber-200"
                            title="복사하기"
                          >
                            {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-950/80 border-t border-amber-900/40 text-center text-xs text-amber-300/60">
              선택한 명언을 가슴에 새기고 오늘 나만의 특별한 독서 기록을 작성해 보세요. 📖
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
