import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  User, 
  Calendar, 
  Star, 
  PenTool, 
  CheckCircle2, 
  Sparkles, 
  Bookmark, 
  Building2, 
  MessageSquareText, 
  ArrowRight,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookRecord, GasConfig, TabType } from '../types';
import { getStoredLastStudentInfo, saveLastStudentInfo } from '../utils/storage';
import { ReadingQuotesBanner } from './ReadingQuotesBanner';
import { BookstoreLibraryShelf } from './BookstoreLibraryShelf';
import { Yes24BestsellerSection } from './Yes24BestsellerSection';

interface WriteRecordTabProps {
  onAddRecord: (record: BookRecord) => Promise<void>;
  gasConfig: GasConfig;
  setActiveTab: (tab: TabType) => void;
  setSelectedStudentFilter?: (name: string, grade: string, classNum: string) => void;
  totalRecordsCount?: number;
}

export const WriteRecordTab: React.FC<WriteRecordTabProps> = ({
  onAddRecord,
  gasConfig,
  setActiveTab,
  setSelectedStudentFilter,
  totalRecordsCount = 0
}) => {
  const lastInfo = getStoredLastStudentInfo();

  const [grade, setGrade] = useState(lastInfo.grade || '5학년');
  const [classNum, setClassNum] = useState(lastInfo.classNum || '2반');
  const [studentName, setStudentName] = useState(lastInfo.studentName || '');

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [readDate, setReadDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [summary, setSummary] = useState('');
  const [thoughts, setThoughts] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<BookRecord | null>(null);

  // Quick book recommendations preset list for primary/middle/high schoolers
  const SAMPLE_BOOKS = [
    { title: '어린 왕자', author: '생텍쥐페리', publisher: '열린책들' },
    { title: '모모', author: '미하엘 엔데', publisher: '비룡소' },
    { title: '불편한 편의점', author: '김호연', publisher: '나무옆의자' },
    { title: '지구 끝의 온실', author: '김초엽', publisher: '자이언트북스' },
    { title: '마당을 나온 암탉', author: '황선미', publisher: '사계절' },
  ];

  const handleApplyPreset = (b: { title: string; author: string; publisher: string }) => {
    setTitle(b.title);
    setAuthor(b.author);
    setPublisher(b.publisher);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!grade.trim() || !classNum.trim() || !studentName.trim()) {
      alert('학년, 반, 이름을 정확히 입력해주세요.');
      return;
    }
    if (!title.trim()) {
      alert('도서명을 입력해주세요.');
      return;
    }
    if (!summary.trim() || summary.trim().length < 10) {
      alert('줄거리 요약을 최소 10자 이상 작성해주세요.');
      return;
    }
    if (!thoughts.trim() || thoughts.trim().length < 10) {
      alert('소감 및 느낀 점을 최소 10자 이상 작성해주세요.');
      return;
    }

    setIsSubmitting(true);

    // Save student info for next time
    saveLastStudentInfo({ grade, classNum, studentName });

    const newRecord: BookRecord = {
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      grade: grade.trim(),
      classNum: classNum.trim(),
      studentName: studentName.trim(),
      title: title.trim(),
      author: author.trim() || '미상',
      publisher: publisher.trim() || '미상',
      summary: summary.trim(),
      thoughts: thoughts.trim(),
      rating: rating,
      readDate: readDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    try {
      await onAddRecord(newRecord);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setSubmittedRecord(newRecord);
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedRecord(null);
    setTitle('');
    setAuthor('');
    setPublisher('');
    setSummary('');
    setThoughts('');
    setRating(5);
  };

  const handleGoToMyRecords = () => {
    if (submittedRecord && setSelectedStudentFilter) {
      setSelectedStudentFilter(submittedRecord.studentName, submittedRecord.grade, submittedRecord.classNum);
    }
    setActiveTab('my-records');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Emotional & Dynamic Reading Quotes Carousel Banner */}
      <ReadingQuotesBanner
        onSelectBookPreset={(t, a, p) => {
          setTitle(t);
          setAuthor(a);
          setPublisher(p);
        }}
      />

      {/* 2. YES24 Live Bestseller Shelf */}
      <Yes24BestsellerSection
        onSelectBook={(t, a, p) => {
          setTitle(t);
          setAuthor(a);
          setPublisher(p);
        }}
        setActiveTab={setActiveTab}
      />

      {/* 3. Online Bookstore & Digital Library Shelf */}
      <BookstoreLibraryShelf
        onSelectBook={(t, a, p) => {
          setTitle(t);
          setAuthor(a);
          setPublisher(p);
        }}
        setActiveTab={setActiveTab}
        totalRecordsCount={totalRecordsCount}
      />

      {/* 3. Intro Form Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 오늘의 독서 한 장 쌓기
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              나만의 독서 감상기록 작성하기 ✍️
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              위의 추천 서가에서 선택하거나 내가 오늘 읽은 책의 줄거리와 마음 소감을 자유롭게 적어보세요.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xl">
              ★
            </div>
            <div>
              <div className="text-xs text-slate-300 font-medium font-mono">실시간 연동 상태</div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                {gasConfig.isConnected ? (
                  <span className="text-emerald-300 flex items-center gap-1">
                    <FileSpreadsheet className="w-4 h-4" /> 구글 시트 저장 중
                  </span>
                ) : (
                  <span className="text-amber-300">로컬 브라우저 저장</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal / State Overlay */}
      {submittedRecord ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              독서 기록 작성이 완료되었습니다! 🎉
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              <strong className="text-indigo-600 font-bold">{submittedRecord.grade} {submittedRecord.classNum} {submittedRecord.studentName}</strong> 학생의{' '}
              <span className="font-bold underline decoration-indigo-300">「{submittedRecord.title}」</span> 독서 기록이 정상적으로 저장되었습니다.
            </p>
          </div>

          {/* Record Summary Card */}
          <div className="max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-semibold text-slate-500">읽은 날짜: {submittedRecord.readDate}</span>
              <div className="flex items-center text-amber-400 text-xs font-bold">
                {'★'.repeat(submittedRecord.rating)}{'☆'.repeat(5 - submittedRecord.rating)}
              </div>
            </div>
            <div className="text-sm font-bold text-slate-800">
              {submittedRecord.title} <span className="text-xs font-normal text-slate-500">({submittedRecord.author} / {submittedRecord.publisher})</span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2 bg-white p-2.5 rounded-lg border border-slate-200/80">
              "{submittedRecord.thoughts}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleGoToMyRecords}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Bookmark className="w-4 h-4" /> 나의 기록 모아보기 <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetForm}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <PenTool className="w-4 h-4" /> 또 다른 독서기록 작성하기
            </button>
          </div>
        </div>
      ) : (
        /* Main Entry Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Student Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">1. 작성자 학생 정보</h2>
              <span className="text-xs text-slate-400 font-normal ml-auto">* 필수 입력 항목</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">학년</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  required
                >
                  {['1학년', '2학년', '3학년', '4학년', '5학년', '6학년', '중1', '중2', '중3', '고1', '고2', '고3'].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">반</label>
                <select
                  value={classNum}
                  onChange={(e) => setClassNum(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                    <option key={num} value={`${num}반`}>{num}반</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">이름</label>
                <input
                  type="text"
                  placeholder="예: 김민준"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Book Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">2. 도서 상세 정보</h2>
              </div>

              {/* Sample Book Quick Picker */}
              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-600">빠른 입력 예시:</span>
                {SAMPLE_BOOKS.slice(0, 3).map((b) => (
                  <button
                    key={b.title}
                    type="button"
                    onClick={() => handleApplyPreset(b)}
                    className="px-2 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs transition-colors"
                  >
                    {b.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">도서명 (책 제목)</label>
                <input
                  type="text"
                  placeholder="예: 어린 왕자"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">지은이 (저자)</label>
                <input
                  type="text"
                  placeholder="예: 앙투안 드 생텍쥐페리"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">출판사</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="예: 열린책들"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">읽은 날짜</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={readDate}
                    onChange={(e) => setReadDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">내 별점 평가</label>
                <div className="flex items-center gap-1 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            active
                              ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {rating}점 / 5점
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Summary and Thoughts */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">3. 줄거리 요약 및 느낀 점</h2>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">줄거리 요약</label>
                  <span className={`text-[11px] ${summary.length < 10 ? 'text-amber-600 font-semibold' : 'text-slate-400'}`}>
                    {summary.length}자 (최소 10자)
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="책의 핵심 내용을 3~5문장 내외로 자유롭게 요약해 보세요..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-2xl border border-slate-300 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">소감 및 느낀 점 / 깨달은 점</label>
                  <span className={`text-[11px] ${thoughts.length < 10 ? 'text-amber-600 font-semibold' : 'text-slate-400'}`}>
                    {thoughts.length}자 (최소 10자)
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="가장 인상 깊었던 인물, 기억에 남는 구절, 나에게 어떤 감명이나 변화를 주었는지 솔직하게 적어주세요..."
                  value={thoughts}
                  onChange={(e) => setThoughts(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-2xl border border-slate-300 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              * 작성된 기록은 우리반 학급 보관함과 선생님 대시보드에 안전하게 저장됩니다.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-base shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>저장 및 동기화 중...</span>
                </>
              ) : (
                <>
                  <PenTool className="w-5 h-5" />
                  <span>독서 기록 작성 완료하기</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
