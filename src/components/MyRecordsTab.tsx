import React, { useState, useMemo } from 'react';
import { 
  BookMarked, 
  Search, 
  Filter, 
  Calendar, 
  Star, 
  Award, 
  Printer, 
  BookOpen, 
  X, 
  Share2, 
  Sparkles, 
  User, 
  ChevronRight,
  TrendingUp,
  Clock,
  Building2,
  Trash2
} from 'lucide-react';
import { BookRecord } from '../types';

interface MyRecordsTabProps {
  records: BookRecord[];
  initialName?: string;
  initialGrade?: string;
  initialClassNum?: string;
  onDeleteRecord?: (id: string) => void;
}

export const MyRecordsTab: React.FC<MyRecordsTabProps> = ({
  records,
  initialName = '',
  initialGrade = '5학년',
  initialClassNum = '2반',
  onDeleteRecord
}) => {
  const [filterGrade, setFilterGrade] = useState(initialGrade);
  const [filterClass, setFilterClass] = useState(initialClassNum);
  const [filterName, setFilterName] = useState(initialName);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<BookRecord | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Filter records matching selected grade, class, and name
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchGrade = !filterGrade || r.grade === filterGrade;
      const matchClass = !filterClass || r.classNum === filterClass;
      const matchName = !filterName.trim() || r.studentName.trim().includes(filterName.trim());
      
      const matchSearch = !searchQuery.trim() || 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return matchGrade && matchClass && matchName && matchSearch;
    });
  }, [records, filterGrade, filterClass, filterName, searchQuery]);

  // Unique list of students found in records for quick auto-complete chips
  const studentChips = useMemo(() => {
    const map = new Map<string, { name: string; grade: string; classNum: string; count: number }>();
    records.forEach((r) => {
      const key = `${r.grade}_${r.classNum}_${r.studentName}`;
      if (!map.has(key)) {
        map.set(key, { name: r.studentName, grade: r.grade, classNum: r.classNum, count: 1 });
      } else {
        map.get(key)!.count += 1;
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [records]);

  // Compute student level & badge
  const totalCount = filteredRecords.length;
  const getBadgeInfo = (count: number) => {
    if (count >= 10) return { title: '전설의 독서왕 👑', color: 'bg-amber-500 text-white', level: 5 };
    if (count >= 7) return { title: '열정의 독서 마스터 ⭐', color: 'bg-purple-600 text-white', level: 4 };
    if (count >= 4) return { title: '지혜로운 독서가 📚', color: 'bg-indigo-600 text-white', level: 3 };
    if (count >= 2) return { title: '새싹 독서 탐험가 🌱', color: 'bg-emerald-600 text-white', level: 2 };
    if (count >= 1) return { title: '첫걸음 독서가 ✨', color: 'bg-sky-600 text-white', level: 1 };
    return { title: '독서 입문생', color: 'bg-slate-200 text-slate-700', level: 0 };
  };

  const badge = getBadgeInfo(totalCount);

  // Compute stats
  const avgRating = totalCount > 0 
    ? (filteredRecords.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1)
    : '0.0';

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Search Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
              <BookMarked className="w-3.5 h-3.5" /> 나의 누적 독서 기록 보관함
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              이름과 반을 입력해 작성했던 기록을 찾아보세요
            </h1>
            <p className="text-xs text-slate-500">
              학급에서 내가 차곡차곡 쌓아온 독서 감상문과 추천 도서들을 한눈에 감상할 수 있습니다.
            </p>
          </div>

          {totalCount > 0 && filterName && (
            <button
              onClick={() => setShowCertificateModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-200 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
            >
              <Award className="w-4 h-4" /> 독서 상장/기록증 발급
            </button>
          )}
        </div>

        {/* Input Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">학년</label>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">전체 학년</option>
              {['1학년', '2학년', '3학년', '4학년', '5학년', '6학년', '중1', '중2', '중3', '고1', '고2', '고3'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">반</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">전체 반</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                <option key={num} value={`${num}반`}>{num}반</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">학생 이름</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="학생 이름 (예: 김민준)"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">도서 검색</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="책 제목 / 저자 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Quick Student Chips */}
        {studentChips.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-medium">자주 조회되는 학생:</span>
            {studentChips.slice(0, 6).map((s) => (
              <button
                key={`${s.grade}_${s.classNum}_${s.name}`}
                onClick={() => {
                  setFilterGrade(s.grade);
                  setFilterClass(s.classNum);
                  setFilterName(s.name);
                }}
                className={`px-2.5 py-1 rounded-full border text-xs transition-all ${
                  filterName === s.name && filterGrade === s.grade
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {s.grade} {s.classNum} {s.name} ({s.count}권)
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Student Profile & Badge Stats Card */}
      {filterName.trim() && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-900 font-extrabold text-2xl flex items-center justify-center shadow-md">
                {filterName.charAt(0) || '독'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">
                    {filterGrade} {filterClass} {filterName} 학생
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${badge.color}`}>
                    {badge.title}
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-1">
                  지혜의 숲을 가꾸며 꾸준히 독서 생활을 이어가고 있습니다!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full sm:w-auto bg-white/10 p-3.5 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-center px-2">
                <div className="text-[10px] text-slate-300 font-semibold">총 완독 권수</div>
                <div className="text-xl font-extrabold text-amber-300">{totalCount}권</div>
              </div>
              <div className="text-center px-2 border-x border-white/10">
                <div className="text-[10px] text-slate-300 font-semibold">평균 도서 별점</div>
                <div className="text-xl font-extrabold text-sky-300">★ {avgRating}</div>
              </div>
              <div className="text-center px-2">
                <div className="text-[10px] text-slate-300 font-semibold">독서 레벨</div>
                <div className="text-xl font-extrabold text-emerald-300">Lv.{badge.level}</div>
              </div>
            </div>
          </div>

          {/* Reading Level Progress Bar */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>다음 등급까지 목표 독서 달성률</span>
              <span>{totalCount % 3} / 3권 ({Math.min(100, Math.round(((totalCount % 3) / 3) * 100))}%)</span>
            </div>
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, ((totalCount % 3) / 3) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Book Records List */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>독서 기록 목록</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              총 {filteredRecords.length}개
            </span>
          </h2>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">검색된 독서 기록이 없습니다</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {filterName 
                  ? `'${filterName}' 학생의 기록이 아직 등록되지 않았습니다. [독서 기록하기] 탭에서 첫 기록을 남겨보세요!`
                  : '학생 이름이나 검색 조건을 확인해보세요.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => setSelectedBook(record)}
                className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                      {record.grade} {record.classNum} · {record.studentName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      {'★'.repeat(record.rating)}
                      <span className="text-slate-400 font-normal ml-0.5">({record.rating})</span>
                    </div>
                  </div>

                  {/* Book Title & Author */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {record.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <span>저자: {record.author}</span>
                      <span>•</span>
                      <span>출판사: {record.publisher}</span>
                    </p>
                  </div>

                  {/* Thoughts Preview */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">소감 및 감상</span>
                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                      "{record.thoughts}"
                    </p>
                  </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>읽은날: {record.readDate}</span>
                  </div>
                  <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    상세보기 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit">
                {selectedBook.grade} {selectedBook.classNum} {selectedBook.studentName} 학생의 독서기록
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">{selectedBook.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>지은이: <strong>{selectedBook.author}</strong></span>
                <span>•</span>
                <span>출판사: <strong>{selectedBook.publisher}</strong></span>
                <span>•</span>
                <span>읽은 날짜: <strong>{selectedBook.readDate}</strong></span>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-2xl border border-amber-200/80">
              <span className="text-xs font-bold text-amber-800">나의 별점 평가:</span>
              <div className="flex text-amber-400 text-base">
                {'★'.repeat(selectedBook.rating)}{'☆'.repeat(5 - selectedBook.rating)}
              </div>
              <span className="text-xs font-bold text-amber-900 ml-auto">{selectedBook.rating}점 / 5점</span>
            </div>

            {/* Summary Block */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" /> 줄거리 요약
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm leading-relaxed text-slate-800">
                {selectedBook.summary}
              </div>
            </div>

            {/* Thoughts Block */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> 소감 및 느낀 점
              </h3>
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 text-sm leading-relaxed text-slate-800 font-medium">
                "{selectedBook.thoughts}"
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {onDeleteRecord && (
                <button
                  onClick={() => {
                    if (confirm('이 독서 기록을 삭제하시겠습니까?')) {
                      onDeleteRecord(selectedBook.id);
                      setSelectedBook(null);
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> 기록 삭제
                </button>
              )}

              <button
                onClick={() => setSelectedBook(null)}
                className="ml-auto px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Reading Certificate Printable Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 border-4 border-amber-300 shadow-2xl space-y-6 relative print:p-0 print:border-none">
            
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 print:hidden"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Certificate Printable Area */}
            <div className="text-center space-y-6 p-6 border-2 border-amber-200 rounded-2xl bg-amber-50/30">
              <div className="space-y-1">
                <div className="text-xs font-extrabold text-amber-700 tracking-widest uppercase">Reading Achievement Certificate</div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">독 서 명 예 상 장</h1>
              </div>

              <div className="py-2 text-sm font-semibold text-slate-700">
                <span className="text-base font-extrabold text-indigo-700 underline decoration-amber-400">{filterGrade} {filterClass} {filterName}</span> 귀하
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-md mx-auto">
                위 학생은 우리반 전자 독서기록장을 통하여 총 <strong className="text-indigo-700 font-extrabold text-base">{totalCount}권</strong>의 양서를 열람하고 깊이 있는 독서 감상문을 성실히 작성하여 타의 모범이 되므로 이 상장을 수여합니다.
              </p>

              <div className="pt-6 border-t border-amber-200/80 flex items-center justify-around text-xs text-slate-600 font-bold">
                <div>발급일자: {new Date().toLocaleDateString('ko-KR')}</div>
                <div className="text-indigo-900 font-extrabold text-sm">우리반 학급 독서지도 교사 직인 💮</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 print:hidden">
              <button
                onClick={handlePrintCertificate}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> 인쇄 / PDF 저장
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
