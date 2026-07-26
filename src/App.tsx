/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TabType, 
  BookRecord, 
  CheerMessage, 
  GasConfig 
} from './types';
import { 
  getStoredRecords, 
  saveRecordsToLocal, 
  getStoredCheerMessages, 
  saveCheerMessagesToLocal, 
  getStoredGasConfig, 
  saveGasConfig, 
  fetchRecordsFromGAS, 
  addRecordToGAS, 
  deleteRecordFromGAS 
} from './utils/storage';
import { Header } from './components/Header';
import { WriteRecordTab } from './components/WriteRecordTab';
import { MyRecordsTab } from './components/MyRecordsTab';
import { HallOfFameTab } from './components/HallOfFameTab';
import { TeacherDashboardTab } from './components/TeacherDashboardTab';
import { SettingsTab } from './components/SettingsTab';
import { INITIAL_BOOK_RECORDS, INITIAL_CHEER_MESSAGES } from './data/sampleData';
import { BookOpen, Sparkles, FileSpreadsheet } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('write');
  const [records, setRecords] = useState<BookRecord[]>([]);
  const [cheerMessages, setCheerMessages] = useState<CheerMessage[]>([]);
  const [gasConfig, setGasConfig] = useState<GasConfig>({ url: '', isConnected: false });

  // Initial student filter for MyRecordsTab
  const [myRecordsFilter, setMyRecordsFilter] = useState({
    name: '',
    grade: '5학년',
    classNum: '2반'
  });

  // Load initial data on mount
  useEffect(() => {
    const localRecords = getStoredRecords();
    setRecords(localRecords);

    const localCheers = getStoredCheerMessages();
    setCheerMessages(localCheers);

    const config = getStoredGasConfig();
    setGasConfig(config);

    // If GAS URL is set, attempt initial fetch
    if (config.url && config.url.startsWith('http')) {
      syncWithGAS(config.url);
    }
  }, []);

  const syncWithGAS = async (url: string) => {
    const res = await fetchRecordsFromGAS(url);
    if (res.success && res.records) {
      if (res.records.length > 0) {
        setRecords(res.records);
        saveRecordsToLocal(res.records);
      }
      const updatedConfig = { url, isConnected: true, lastSyncedAt: new Date().toISOString() };
      setGasConfig(updatedConfig);
      saveGasConfig(updatedConfig);
    }
  };

  // Add Record Handler
  const handleAddRecord = async (newRecord: BookRecord) => {
    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    saveRecordsToLocal(updatedRecords);

    // Push to GAS if connected
    if (gasConfig.isConnected && gasConfig.url) {
      await addRecordToGAS(gasConfig.url, newRecord);
    }
  };

  // Delete Record Handler
  const handleDeleteRecord = async (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    saveRecordsToLocal(updated);

    if (gasConfig.isConnected && gasConfig.url) {
      await deleteRecordFromGAS(gasConfig.url, id);
    }
  };

  // Add Cheer Message
  const handleAddCheerMessage = (msg: CheerMessage) => {
    const updated = [msg, ...cheerMessages];
    setCheerMessages(updated);
    saveCheerMessagesToLocal(updated);
  };

  // Like Cheer Message
  const handleLikeCheerMessage = (id: string) => {
    const updated = cheerMessages.map((m) => {
      if (m.id === id) return { ...m, likes: m.likes + 1 };
      return m;
    });
    setCheerMessages(updated);
    saveCheerMessagesToLocal(updated);
  };

  // Save GAS config
  const handleSaveGasConfig = (config: GasConfig) => {
    setGasConfig(config);
    saveGasConfig(config);
  };

  // Reset Local Data
  const handleResetLocalData = () => {
    localStorage.clear();
    setRecords(INITIAL_BOOK_RECORDS);
    saveRecordsToLocal(INITIAL_BOOK_RECORDS);
    setCheerMessages(INITIAL_CHEER_MESSAGES);
    saveCheerMessagesToLocal(INITIAL_CHEER_MESSAGES);
    setGasConfig({ url: '', isConnected: false });
  };

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-800 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Sticky Header Nav */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gasConfig={gasConfig}
        totalRecordsCount={records.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'write' && (
          <WriteRecordTab
            onAddRecord={handleAddRecord}
            gasConfig={gasConfig}
            setActiveTab={setActiveTab}
            setSelectedStudentFilter={(name, grade, classNum) => setMyRecordsFilter({ name, grade, classNum })}
            totalRecordsCount={records.length}
          />
        )}

        {activeTab === 'my-records' && (
          <MyRecordsTab
            records={records}
            initialName={myRecordsFilter.name}
            initialGrade={myRecordsFilter.grade}
            initialClassNum={myRecordsFilter.classNum}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {activeTab === 'hall-of-fame' && (
          <HallOfFameTab
            records={records}
            cheerMessages={cheerMessages}
            onAddCheerMessage={handleAddCheerMessage}
            onLikeCheerMessage={handleLikeCheerMessage}
          />
        )}

        {activeTab === 'teacher-dashboard' && (
          <TeacherDashboardTab
            records={records}
            gasConfig={gasConfig}
            onDeleteRecord={handleDeleteRecord}
            onRefreshFromGAS={() => gasConfig.url && syncWithGAS(gasConfig.url)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            gasConfig={gasConfig}
            onSaveGasConfig={handleSaveGasConfig}
            onResetLocalData={handleResetLocalData}
            onFetchLatestFromGAS={() => gasConfig.url ? syncWithGAS(gasConfig.url) : Promise.resolve()}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-700">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>우리반 전자 독서기록장 · 학급 독서 교육 지원 시스템</span>
        </div>
        <p className="max-w-md mx-auto text-slate-400 text-[11px] leading-relaxed">
          구글 앱스 스크립트(GAS) 및 구글 시트 기반 실시간 동기화 지원 · 초등/중등/고등 학급을 위한 맞춤형 독서 포트폴리오
        </p>
      </footer>

    </div>
  );
}
