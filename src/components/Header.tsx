import React, { useState } from 'react';
import { 
  BookOpen, 
  PenTool, 
  BookMarked, 
  Trophy, 
  GraduationCap, 
  Settings, 
  Menu, 
  X, 
  FileSpreadsheet, 
  Database,
  Sparkles
} from 'lucide-react';
import { TabType, GasConfig } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  gasConfig: GasConfig;
  totalRecordsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  gasConfig,
  totalRecordsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'write', label: '독서 기록하기', icon: <PenTool className="w-4 h-4" /> },
    { id: 'my-records', label: '나의 기록보기', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'hall-of-fame', label: '이달의 독서왕', icon: <Trophy className="w-4 h-4" />, badge: '이벤트' },
    { id: 'teacher-dashboard', label: '교사 대시보드', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'settings', label: '구글 연동 설정', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleTabClick('write')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight">
                  우리반 <span className="text-indigo-600">전자 독서기록장</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-500" /> 초·중·고 학급용
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                함께 읽고 성장하는 우리들의 똑똑한 독서 나눔터
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-sm transition-all duration-200 select-none ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-amber-400 text-slate-900 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Connection Status & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Status Pill */}
            <button
              onClick={() => handleTabClick('settings')}
              title="구글 연동 상태 확인 및 설정"
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                gasConfig.isConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80'
              }`}
            >
              {gasConfig.isConnected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>구글시트 연동됨</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-amber-600" />
                  <span>로컬 체험 모드</span>
                </>
              )}
            </button>

            {/* Total Count Chip */}
            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
              누적 독서 {totalRecordsCount}권
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-2 mb-2 bg-slate-50 rounded-xl text-xs font-medium text-slate-600">
            <span>연동 상태:</span>
            {gasConfig.isConnected ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5" /> 구글시트 연동중
              </span>
            ) : (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <Database className="w-3.5 h-3.5" /> 로컬 저장 모드
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                    isActive ? 'bg-amber-300 text-slate-900' : 'bg-amber-400 text-slate-900'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
