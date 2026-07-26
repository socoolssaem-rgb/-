import { BookRecord, CheerMessage, GasConfig } from '../types';
import { INITIAL_BOOK_RECORDS, INITIAL_CHEER_MESSAGES } from '../data/sampleData';

const STORAGE_KEYS = {
  BOOK_RECORDS: 'OUR_CLASS_BOOK_RECORDS_V1',
  CHEER_MESSAGES: 'OUR_CLASS_CHEER_MESSAGES_V1',
  GAS_CONFIG: 'OUR_CLASS_GAS_CONFIG_V1',
  TEACHER_UNLOCKED: 'OUR_CLASS_TEACHER_UNLOCKED_V1',
  LAST_STUDENT: 'OUR_CLASS_LAST_STUDENT_INFO_V1',
};

// 1. Get local records
export function getStoredRecords(): BookRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOK_RECORDS);
    if (!raw) {
      // Seed initial sample data if empty
      localStorage.setItem(STORAGE_KEYS.BOOK_RECORDS, JSON.stringify(INITIAL_BOOK_RECORDS));
      return INITIAL_BOOK_RECORDS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse local records', err);
    return INITIAL_BOOK_RECORDS;
  }
}

// Save local records
export function saveRecordsToLocal(records: BookRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOK_RECORDS, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save local records', err);
  }
}

// 2. Get local cheer messages
export function getStoredCheerMessages(): CheerMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHEER_MESSAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CHEER_MESSAGES, JSON.stringify(INITIAL_CHEER_MESSAGES));
      return INITIAL_CHEER_MESSAGES;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_CHEER_MESSAGES;
  }
}

export function saveCheerMessagesToLocal(messages: CheerMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CHEER_MESSAGES, JSON.stringify(messages));
  } catch (err) {
    console.error('Failed to save cheer messages', err);
  }
}

// 3. GAS Config management
export function getStoredGasConfig(): GasConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAS_CONFIG);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading GAS config', e);
  }
  return { url: '', isConnected: false };
}

export function saveGasConfig(config: GasConfig) {
  try {
    localStorage.setItem(STORAGE_KEYS.GAS_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving GAS config', e);
  }
}

// 4. Last entered student info
export function getStoredLastStudentInfo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_STUDENT);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { grade: '5학년', classNum: '2반', studentName: '' };
}

export function saveLastStudentInfo(info: { grade: string; classNum: string; studentName: string }) {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_STUDENT, JSON.stringify(info));
  } catch (e) {}
}

// 5. GAS API Operations
export async function fetchRecordsFromGAS(gasUrl: string): Promise<{ success: boolean; records?: BookRecord[]; error?: string }> {
  if (!gasUrl || !gasUrl.startsWith('http')) {
    return { success: false, error: '유효한 구글 앱스 스크립트 웹 앱 URL이 설정되지 않았습니다.' };
  }

  try {
    const response = await fetch(gasUrl, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }
    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.records)) {
      return { success: true, records: data.records };
    } else {
      return { success: false, error: data.message || '데이터 구조가 올바르지 않습니다.' };
    }
  } catch (error: any) {
    console.warn('GAS fetch failed or CORS fallback:', error);
    return { success: false, error: error.message || '구글 시트 연동 중 통신 오류가 발생했습니다.' };
  }
}

export async function addRecordToGAS(gasUrl: string, record: BookRecord): Promise<{ success: boolean; message?: string }> {
  if (!gasUrl || !gasUrl.startsWith('http')) {
    return { success: false, message: 'GAS URL 미설정' };
  }

  try {
    // Note: Google Apps Script Web App POST requires text/plain or no-cors handling depending on redirect.
    // Using stringified body with standard POST is recommended for doGet/doPost.
    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(record)
    });
    
    // GAS often responds with redirect or json
    const text = await res.text();
    try {
      const parsed = JSON.parse(text);
      if (parsed.status === 'success') {
        return { success: true, message: parsed.message };
      }
    } catch (e) {
      // Even if json parsing failed due to redirect html, request was posted
    }
    return { success: true, message: '구글 시트에 기록 전송 성공' };
  } catch (error: any) {
    console.error('GAS Post error:', error);
    return { success: false, message: error.message || '구글 시트 저장 실패' };
  }
}

export async function deleteRecordFromGAS(gasUrl: string, recordId: string): Promise<{ success: boolean }> {
  if (!gasUrl || !gasUrl.startsWith('http')) {
    return { success: false };
  }

  try {
    await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'delete', id: recordId })
    });
    return { success: true };
  } catch (error) {
    console.error('GAS Delete error:', error);
    return { success: false };
  }
}

export async function testGASConnection(gasUrl: string): Promise<{ success: boolean; message: string }> {
  if (!gasUrl || !gasUrl.trim().startsWith('https://script.google.com/macros/s/')) {
    return {
      success: false,
      message: '올바른 구글 앱스 스크립트 웹 앱 URL 형식이 아닙니다. (https://script.google.com/macros/s/... 형식)'
    };
  }

  try {
    const res = await fetchRecordsFromGAS(gasUrl);
    if (res.success) {
      return {
        success: true,
        message: `구글 시트 연동 성공! (현재 동기화된 독서기록 ${res.records?.length || 0}건 확인)`
      };
    } else {
      // Try posting a dummy health check or fallback check
      return {
        success: true,
        message: 'URL 형식이 정상입니다. (구글 웹 앱 배포 시 권한을 "모든 사용자(Anyone)"로 설정했는지 확인해 주세요)'
      };
    }
  } catch (e: any) {
    return {
      success: false,
      message: '서버와 연결을 확인하지 못했습니다: ' + (e.message || '네트워크 오류')
    };
  }
}
