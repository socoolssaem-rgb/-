import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  Medal, 
  Award, 
  Heart, 
  Send, 
  BookOpen, 
  MessageSquare, 
  Calendar,
  Star,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookRecord, CheerMessage } from '../types';

interface HallOfFameTabProps {
  records: BookRecord[];
  cheerMessages: CheerMessage[];
  onAddCheerMessage: (msg: CheerMessage) => void;
  onLikeCheerMessage: (id: string) => void;
}

export const HallOfFameTab: React.FC<HallOfFameTabProps> = ({
  records,
  cheerMessages,
  onAddCheerMessage,
  onLikeCheerMessage
}) => {
  const [fromName, setFromName] = useState('');
  const [toStudent, setToStudent] = useState('우리반 전체');
  const [messageText, setMessageText] = useState('');

  // Calculate monthly reading totals per student
  const rankingList = useMemo(() => {
    const studentMap = new Map<string, {
      studentName: string;
      grade: string;
      classNum: string;
      count: number;
      books: string[];
      avgRating: number;
    }>();

    records.forEach((r) => {
      const key = `${r.grade}_${r.classNum}_${r.studentName}`;
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          studentName: r.studentName,
          grade: r.grade,
          classNum: r.classNum,
          count: 1,
          books: [r.title],
          avgRating: r.rating
        });
      } else {
        const item = studentMap.get(key)!;
        item.count += 1;
        item.books.push(r.title);
        item.avgRating += r.rating;
      }
    });

    const result = Array.from(studentMap.values()).map((s) => ({
      ...s,
      avgRating: parseFloat((s.avgRating / s.count).toFixed(1))
    }));

    // Sort by count descending, then by avgRating descending
    return result.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.avgRating - a.avgRating;
    });
  }, [records]);

  const top1 = rankingList[0];
  const top2 = rankingList[1];
  const top3 = rankingList[2];
  const remaining = rankingList.slice(3, 10);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  const handleSendCheer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromName.trim() || !messageText.trim()) {
      alert('보내는 사람 이름과 응원 메시지를 작성해주세요.');
      return;
    }

    const newCheer: CheerMessage = {
      id: 'cheer_' + Date.now(),
      fromStudent: fromName.trim(),
      toStudent: toStudent,
      message: messageText.trim(),
      createdAt: new Date().toISOString(),
      likes: 1
    };

    onAddCheerMessage(newCheer);
    setMessageText('');
    triggerConfetti();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300">
      
      {/* Event Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/30 border border-amber-300/40 text-amber-100 text-xs font-extrabold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" /> 7월의 명예의 전당 이벤트
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              🏆 이달의 독서왕 시상식
            </h1>
            <p className="text-amber-100 text-sm max-w-xl leading-relaxed">
              이번 달 다독과 열정으로 학급의 지혜를 밝혀준 독서왕 친구들을 축하합니다! 따뜻한 응원의 한마디도 전해보세요.
            </p>
          </div>

          <button
            onClick={triggerConfetti}
            className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm shadow-lg shadow-amber-900/30 transition-transform active:scale-95 flex items-center gap-2 shrink-0"
          >
            <PartyPopper className="w-5 h-5" /> 축하 꽃가루 터뜨리기 🎉
          </button>
        </div>
      </div>

      {/* Top 3 Podium Ceremony Card */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" /> TOP 3 명예의 독서왕
          </h2>
          <span className="text-xs text-slate-500">실시간 누적 완독 기준</span>
        </div>

        {rankingList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 font-medium">아직 등록된 독서기록이 없습니다. 첫 번째 독서왕에 도전해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            
            {/* 2nd Place Silver */}
            {top2 ? (
              <div className="order-2 md:order-1 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lg relative overflow-hidden flex flex-col items-center text-center space-y-4">
                <div className="absolute top-0 inset-x-0 h-2 bg-slate-300" />
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 font-black text-xl flex items-center justify-center border-2 border-slate-300 shadow-inner">
                  2등
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500">{top2.grade} {top2.classNum}</span>
                  <h3 className="text-xl font-extrabold text-slate-900">{top2.studentName}</h3>
                  <div className="inline-block mt-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                    총 {top2.count}권 완독 🥈
                  </div>
                </div>

                <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-100 text-left text-xs space-y-1">
                  <span className="font-bold text-slate-500 block">읽은 주요 책:</span>
                  <p className="text-slate-700 line-clamp-2">
                    {top2.books.join(', ')}
                  </p>
                </div>
              </div>
            ) : null}

            {/* 1st Place Gold (Center - Higher) */}
            {top1 ? (
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white rounded-3xl p-8 border-4 border-amber-400 shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-4 md:-translate-y-4">
                <div className="absolute top-0 inset-x-0 h-3 bg-amber-400" />
                
                <div className="relative">
                  <Crown className="w-8 h-8 text-amber-500 absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce" />
                  <div className="w-20 h-20 rounded-full bg-amber-400 text-slate-900 font-black text-2xl flex items-center justify-center border-4 border-white shadow-md">
                    1등
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    {top1.grade} {top1.classNum}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{top1.studentName}</h3>
                  <div className="inline-block mt-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-900 font-black text-sm shadow-sm">
                    최고 독서왕 · 총 {top1.count}권 완독 🥇
                  </div>
                </div>

                <div className="w-full bg-amber-100/50 p-3.5 rounded-2xl border border-amber-200 text-left text-xs space-y-1">
                  <span className="font-bold text-amber-900 block">대표 독서 리스트:</span>
                  <p className="text-slate-800 font-medium line-clamp-3">
                    {top1.books.join(', ')}
                  </p>
                </div>
              </div>
            ) : null}

            {/* 3rd Place Bronze */}
            {top3 ? (
              <div className="order-3 bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-lg relative overflow-hidden flex flex-col items-center text-center space-y-4">
                <div className="absolute top-0 inset-x-0 h-2 bg-amber-600" />
                <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 font-black text-xl flex items-center justify-center border-2 border-amber-300 shadow-inner">
                  3등
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500">{top3.grade} {top3.classNum}</span>
                  <h3 className="text-xl font-extrabold text-slate-900">{top3.studentName}</h3>
                  <div className="inline-block mt-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                    총 {top3.count}권 완독 🥉
                  </div>
                </div>

                <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-100 text-left text-xs space-y-1">
                  <span className="font-bold text-slate-500 block">읽은 주요 책:</span>
                  <p className="text-slate-700 line-clamp-2">
                    {top3.books.join(', ')}
                  </p>
                </div>
              </div>
            ) : null}

          </div>
        )}
      </div>

      {/* Rankings 4th ~ 10th Table */}
      {remaining.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Medal className="w-5 h-5 text-indigo-600" /> 독서 열정 순위 (4위 ~ 10위)
          </h3>

          <div className="divide-y divide-slate-100">
            {remaining.map((item, idx) => (
              <div key={item.studentName + idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-bold flex items-center justify-center">
                    {idx + 4}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{item.studentName}</span>
                    <span className="text-xs text-slate-400 ml-2">({item.grade} {item.classNum})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 hidden sm:inline">대표작: {item.books[0]}</span>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs">
                    {item.count}권
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cheering Board Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        {/* Send Cheer Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">친구에게 응원 메시지 보내기</h3>
          </div>

          <form onSubmit={handleSendCheer} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">보내는 사람</label>
              <input
                type="text"
                placeholder="예: 5반 김민준"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">응원할 대상</label>
              <select
                value={toStudent}
                onChange={(e) => setToStudent(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="우리반 전체">우리반 전체 친구들</option>
                {rankingList.map((r) => (
                  <option key={r.studentName} value={r.studentName}>{r.studentName} 학생</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">칭찬/응원 내용</label>
              <textarea
                rows={3}
                placeholder="독서왕이 된 친구나 함께 열심히 책을 읽는 친구들에게 멋진 칭찬을 건네주세요!"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> 응원 메시지 게시하기
            </button>
          </form>
        </div>

        {/* Cheer Messages Feed */}
        <div className="lg:col-span-2 bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>우리반 응원과 칭찬 한마디</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900">
                {cheerMessages.length}개
              </span>
            </h3>
            <span className="text-xs text-slate-400">실시간 피드</span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {cheerMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2 hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-slate-800">{msg.fromStudent}</span>
                    <span className="text-slate-400">➔</span>
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {msg.toStudent}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  "{msg.message}"
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onLikeCheerMessage(msg.id)}
                    className="flex items-center gap-1 text-xs text-rose-500 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span className="font-bold">{msg.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
