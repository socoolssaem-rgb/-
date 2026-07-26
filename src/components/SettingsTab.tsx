import React, { useState } from 'react';
import { 
  Settings, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  Database,
  Code2,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { GasConfig } from '../types';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/sampleData';
import { testGASConnection } from '../utils/storage';

interface SettingsTabProps {
  gasConfig: GasConfig;
  onSaveGasConfig: (config: GasConfig) => void;
  onResetLocalData: () => void;
  onFetchLatestFromGAS: () => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  gasConfig,
  onSaveGasConfig,
  onResetLocalData,
  onFetchLatestFromGAS
}) => {
  const [gasUrlInput, setGasUrlInput] = useState(gasConfig.url || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = gasUrlInput.trim();

    if (!cleanUrl) {
      onSaveGasConfig({ url: '', isConnected: false });
      setTestResult({ success: false, message: 'URL이 제거되었습니다. 이제 로컬 저장 모드로 작동합니다.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await testGASConnection(cleanUrl);
    setIsTesting(false);
    setTestResult(result);

    const newConfig: GasConfig = {
      url: cleanUrl,
      isConnected: result.success,
      lastSyncedAt: result.success ? new Date().toISOString() : gasConfig.lastSyncedAt
    };

    onSaveGasConfig(newConfig);

    if (result.success) {
      await onFetchLatestFromGAS();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold w-fit">
          <FileSpreadsheet className="w-3.5 h-3.5" /> 실시간 데이터 동기화
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          구글 시트(Google Sheets) 연동 및 설정 가이드 🟢
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
          무료 구글 드라이브와 구글 앱스 스크립트(Google Apps Script)를 활용하여 학생들의 독서 기록을 나만의 구글 스프레드시트에 실시간으로 자동 축적할 수 있습니다.
        </p>
      </div>

      {/* Connection Control Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" /> 웹 앱 URL 등록 및 연결
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              배포된 구글 앱스 스크립트의 웹 앱 URL을 아래에 입력해 주세요.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {gasConfig.isConnected ? (
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 구글 시트 연동 활성화
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> 미연동 (로컬 체험 모드)
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleTestAndSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              구글 앱스 스크립트 웹 앱 URL (Web App URL)
            </label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
              value={gasUrlInput}
              onChange={(e) => setGasUrlInput(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {testResult && (
            <div className={`p-4 rounded-2xl text-xs font-medium border flex items-center gap-2.5 ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-400">
              * 설정한 URL은 브라우저의 localStorage에 자동 저장되어 유지됩니다.
            </span>

            <button
              type="submit"
              disabled={isTesting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>연동 상태 테스트 중...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>연동 테스트 및 URL 저장</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Step-by-Step Installation Guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
          <HelpCircle className="w-5 h-5 text-indigo-600" /> 구글 시트 연동 방법 (초간단 3분 가이드)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900">구글 시트 생성 & Apps Script</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              새 구글 시트를 만들고 상단 메뉴에서 <strong>[확장 프로그램] ➔ [Apps Script]</strong>를 실행하세요.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900">스크립트 코드 복사 & 붙여넣기</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              아래의 <strong>Code.gs 코드 복사하기</strong> 버튼을 눌러 스크립트 에디터에 붙여넣고 저장(Ctrl+S)하세요.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900">웹 앱 배포 및 URL 등록</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>[배포] ➔ [새 배포] ➔ 유형: [웹 앱]</strong> 설정 시 <u>액세스 권한: 모든 사용자(Anyone)</u>로 지정 후 배포된 URL을 위 입력창에 등록하세요!
            </p>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-600" /> 구글 앱스 스크립트 완성 소스코드 (Code.gs)
            </span>

            <button
              onClick={handleCopyCode}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>복사되었습니다!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Code.gs 소스 전체 복사</span>
                </>
              )}
            </button>
          </div>

          <div className="relative bg-slate-900 text-slate-200 rounded-2xl p-4 font-mono text-xs max-h-72 overflow-y-auto leading-relaxed border border-slate-800 select-all">
            <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
          </div>
        </div>
      </div>

      {/* Local Storage & Reset Utility */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">로컬 데이터 초기화 및 데모 데이터 복원</h3>
          <p className="text-xs text-slate-500">
            테스트용 샘플 데이터를 다시 불러오거나 로컬 저장소를 초기화할 수 있습니다.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('로컬에 저장된 데모 데이터를 초기 샘플 데이터로 초기화하시겠습니까?')) {
              onResetLocalData();
              alert('샘플 데이터가 복원되었습니다.');
            }
          }}
          className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs shrink-0"
        >
          샘플 데이터 복원
        </button>
      </div>

    </div>
  );
};
