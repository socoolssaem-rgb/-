import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Lock, 
  Unlock, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  BookOpen, 
  BarChart3, 
  Users, 
  Award, 
  Calendar,
  Check,
  X,
  FileSpreadsheet,
  Star,
  RefreshCw
} from 'lucide-react';
import { BookRecord, GasConfig } from '../types';

interface TeacherDashboardTabProps {
  records: BookRecord[];
  gasConfig: GasConfig;
  onDeleteRecord: (id: string) => void;
  onRefreshFromGAS?: () => void;
}

export const TeacherDashboardTab: React.FC<TeacherDashboardTabProps> = ({
  records,
  gasConfig,
  onDeleteRecord,
  onRefreshFromGAS
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Filters
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [searchNameOrBook, setSearchNameOrBook] = useState('');

  // Selected Record Modal
  const [viewRecord, setViewRecord] = useState<BookRecord | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'teacher1234' || passwordInput === '1234') {
      setIsUnlocked(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchGrade = !selectedGrade || r.grade === selectedGrade;
      const matchClass = !selectedClass || r.classNum === selectedClass;
      const matchSearch = !searchNameOrBook.trim() ||
        r.studentName.includes(searchNameOrBook) ||
        r.title.toLowerCase().includes(searchNameOrBook.toLowerCase()) ||
        r.author.toLowerCase().includes(searchNameOrBook.toLowerCase());

      return matchGrade && matchClass && matchSearch;
    });
  }, [records, selectedGrade, selectedClass, searchNameOrBook]);

  // High-level Statistics
  const totalBooks = records.length;
  
  // Unique students count
  const uniqueStudents = useMemo(() => {
    const set = new Set(records.map((r) => `${r.grade}_${r.classNum}_${r.studentName}`));
    return set.size;
  }, [records]);

  // Average rating
  const avgRating = totalBooks > 0 
    ? (records.reduce((acc, r) => acc + r.rating, 0) / totalBooks).toFixed(1)
    : '0.0';

  // Top Reader Student
  const topStudent = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => {
      const name = `${r.grade} ${r.classNum} ${r.studentName}`;
      map.set(name, (map.get(name) || 0) + 1);
    });
    let topName = '없음';
    let max = 0;
    map.forEach((cnt, name) => {
      if (cnt > max) {
        max = cnt;
        topName = name;
      }
    });
    return { name: topName, count: max };
  }, [records]);

  // Grade Breakdown
  const gradeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => {
      map.set(r.grade, (map.get(r.grade) || 0) + 1);
    });
    return Array.from(map.entries());
  }, [records]);

  // Export to CSV / Excel
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }

    const headers = ['기록ID', '작성일시', '학년', '반', '학생이름', '도서명', '지은이', '출판사', '별점', '줄거리요약', '소감', '읽은날짜'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.createdAt,
      r.grade,
      r.classNum,
      r.studentName,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.author.replace(/"/g, '""')}"`,
      `"${r.publisher.replace(/"/g, '""')}"`,
      r.rating,
      `"${r.summary.replace(/"/g, '""')}"`,
      `"${r.thoughts.replace(/"/g, '""')}"`,
      r.readDate
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `우리반_독서기록_전체내역_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Password Lock Screen
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">교사 전용 대시보드 접근</h2>
          <p className="text-xs text-slate-500">
            학급 독서 통계 및 전체 기록 관리를 위한 교사 비밀번호를 입력해주세요.
          </p>
          <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mt-1">
            * 기본 비밀번호: <code className="font-mono">teacher1234</code>
          </div>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-center text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            {passwordError && (
              <p className="text-xs text-rose-600 font-bold mt-1.5">
                비밀번호가 올바르지 않습니다. (기본: teacher1234)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" /> 대시보드 잠금 해제
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <Unlock className="w-3.5 h-3.5" /> 교사 관리자 로그인됨
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-medium">
              구글 시트 연동: {gasConfig.isConnected ? '활성화' : '미연동(로컬 데이터)'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            우리반 독서 현황 통합 대시보드 📊
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {onRefreshFromGAS && gasConfig.isConnected && (
            <button
              onClick={onRefreshFromGAS}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> 실시간 새로고침
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> 엑셀/CSV 다운로드
          </button>

          <button
            onClick={() => setIsUnlocked(false)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs"
            title="대시보드 잠그기"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">누적 전체 완독 권수</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{totalBooks}권</div>
          <p className="text-[11px] text-slate-400">학급 전체 누적 독서 기록</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">참여 학생 수</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{uniqueStudents}명</div>
          <p className="text-[11px] text-slate-400">독서 기록을 작성한 학생</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">평균 도서 만족도</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{avgRating} <span className="text-lg font-normal text-slate-400">/ 5.0</span></div>
          <p className="text-[11px] text-slate-400">학생 평점 평균</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">최다 독서왕 학생</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 line-clamp-1">{topStudent.name}</div>
          <p className="text-[11px] text-purple-600 font-bold">{topStudent.count}권 작성 완료</p>
        </div>

      </div>

      {/* Grade / Class Stats Breakdown Visual Bar */}
      {gradeDistribution.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" /> 학년별 독서 비중 현황
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {gradeDistribution.map(([gName, count]) => {
              const pct = totalBooks > 0 ? Math.round((count / totalBooks) * 100) : 0;
              return (
                <div key={gName} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{gName}</span>
                    <span className="text-indigo-600">{count}권</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Filter & Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>전체 학생 독서기록 관리</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {filteredRecords.length}건
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="">모든 학년</option>
              {['1학년', '2학년', '3학년', '4학년', '5학년', '6학년', '중1', '중2', '중3', '고1', '고2', '고3'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="">모든 반</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                <option key={n} value={`${n}반`}>{n}반</option>
              ))}
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="학생 / 도서명 검색"
                value={searchNameOrBook}
                onChange={(e) => setSearchNameOrBook(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-4">학년/반</th>
                <th className="py-3 px-4">학생 이름</th>
                <th className="py-3 px-4">도서명 (저자)</th>
                <th className="py-3 px-4">별점</th>
                <th className="py-3 px-4">읽은 날짜</th>
                <th className="py-3 px-4 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    조건에 해당하는 독서 기록이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {r.grade} {r.classNum}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-700">
                      {r.studentName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{r.title}</div>
                      <div className="text-[11px] text-slate-400">{r.author} / {r.publisher}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-amber-500 font-bold">★ {r.rating}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {r.readDate}
                    </td>
                    <td className="py-3.5 px-4 text-center space-x-2">
                      <button
                        onClick={() => setViewRecord(r)}
                        className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        title="기록 상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`'${r.studentName}' 학생의 '${r.title}' 독서 기록을 정말 삭제하시겠습니까?`)) {
                            onDeleteRecord(r.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Record View Detail Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setViewRecord(null)}
              className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-1 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-indigo-600">
                {viewRecord.grade} {viewRecord.classNum} {viewRecord.studentName} 학생
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">{viewRecord.title}</h2>
              <p className="text-xs text-slate-500">저자: {viewRecord.author} | 출판사: {viewRecord.publisher}</p>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">줄거리 요약</span>
                <p>{viewRecord.summary}</p>
              </div>

              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-1">
                <span className="font-bold text-indigo-900 block">소감 및 감상</span>
                <p>"{viewRecord.thoughts}"</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewRecord(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
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
