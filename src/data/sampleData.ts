import { BookRecord, CheerMessage } from '../types';

export const INITIAL_BOOK_RECORDS: BookRecord[] = [
  {
    id: 'rec_1',
    grade: '5학년',
    classNum: '2반',
    studentName: '김민준',
    title: '어린 왕자',
    author: '앙투안 드 생텍쥐페리',
    publisher: '열린책들',
    summary: '사막에 불시착한 조종사가 다른 별에서 온 어린 왕자를 만나 이야기하는 내용입니다. 어린 왕자는 장미꽃과의 관계, 길들임의 의미, 그리고 여우와의 대화를 통해 소중한 것은 눈에 보이지 않는다는 진리를 배워갑니다.',
    thoughts: '여우가 한 "가장 중요한 것은 눈에 보이지 않아"라는 말이 기억에 남습니다. 친구들과의 우정과 마음의 소중함을 다시 한번 생각해보게 되었습니다.',
    rating: 5,
    readDate: '2026-07-24',
    createdAt: '2026-07-24T10:15:00.000Z'
  },
  {
    id: 'rec_2',
    grade: '5학년',
    classNum: '2반',
    studentName: '김민준',
    title: '모모',
    author: '미하엘 엔데',
    publisher: '비룡소',
    summary: '시간 도둑인 회색 신사들에게 빼앗긴 사람들의 시간을 찾기 위해 작은 소녀 모모가 거북이 카시오페아와 함께 모험을 떠나는 소설입니다.',
    thoughts: '바쁘다는 핑계로 친구들과 노는 시간이나 소중한 순간을 놓치지 말아야겠다고 느꼈습니다. 모모의 경청하는 자세도 닮고 싶습니다.',
    rating: 5,
    readDate: '2026-07-20',
    createdAt: '2026-07-20T14:30:00.000Z'
  },
  {
    id: 'rec_3',
    grade: '5학년',
    classNum: '2반',
    studentName: '김민준',
    title: '아몬드',
    author: '손원평',
    publisher: '창비',
    summary: '감정을 느끼지 못하는 소년 윤재가 불행한 사고로 홀로 남겨진 후, 세상을 향해 걸어나가며 타인의 감정을 이해하려고 노력하는 성장을 그린 이야기입니다.',
    thoughts: '다른 사람의 아픔에 공감하는 것이 얼마나 큰 용기와 사랑인지 알게 되었습니다.',
    rating: 4,
    readDate: '2026-07-15',
    createdAt: '2026-07-15T09:00:00.000Z'
  },
  {
    id: 'rec_4',
    grade: '5학년',
    classNum: '2반',
    studentName: '이서연',
    title: '불편한 편의점',
    author: '김호연',
    publisher: '나무옆의자',
    summary: '청파동의 작은 편의점을 배경으로 야간 알바생 독고와 이곳을 찾는 이웃들의 따뜻한 오해와 이해, 그리고 치유의 이야기입니다.',
    thoughts: '서로를 따뜻하게 배려하는 작은 마음이 사람의 마음을 녹이고 바꿀 수 있다는 걸 깨달았습니다. 정말 따뜻한 책입니다.',
    rating: 5,
    readDate: '2026-07-25',
    createdAt: '2026-07-25T11:20:00.000Z'
  },
  {
    id: 'rec_5',
    grade: '5학년',
    classNum: '2반',
    studentName: '이서연',
    title: '마당을 나온 암탉',
    author: '황선미',
    publisher: '사계절',
    summary: '양계장을 탈출해 자유를 찾은 암탉 잎싹이가 족제비의 위협 속에서 청머리오리 아기 초록이를 자식처럼 키워내는 감동적인 모성애 이야기입니다.',
    thoughts: '잎싹이의 용기와 희생에 눈물이 났습니다. 꿈을 향해 나아가는 삶의 소중함을 배웠습니다.',
    rating: 5,
    readDate: '2026-07-22',
    createdAt: '2026-07-22T16:00:00.000Z'
  },
  {
    id: 'rec_6',
    grade: '5학년',
    classNum: '2반',
    studentName: '이서연',
    title: '지구 끝의 온실',
    author: '김초엽',
    publisher: '자이언트북스',
    summary: '멸망 이후의 세계를 배경으로 특별한 식물 모스바나와 그것을 가꾸던 사람들의 희망과 연대의 서사를 펼친 SF 소설입니다.',
    thoughts: '어려운 환경 속에서도 희망을 잃지 않고 연대하는 사람들의 아름다운 마음이 인상 깊었습니다.',
    rating: 4,
    readDate: '2026-07-18',
    createdAt: '2026-07-18T13:40:00.000Z'
  },
  {
    id: 'rec_7',
    grade: '5학년',
    classNum: '2반',
    studentName: '이서연',
    title: '시간을 파는 상점',
    author: '김선영',
    publisher: '자음과모음',
    summary: '시간을 파는 상점 크로노스를 카페에 개설하고 사람들의 다양한 의뢰를 해결해 주는 주인공 온조의 성장 스토리입니다.',
    thoughts: '주어진 시간을 보람차고 소중하게 사용해야겠다는 다짐을 했습니다.',
    rating: 5,
    readDate: '2026-07-10',
    createdAt: '2026-07-10T08:50:00.000Z'
  },
  {
    id: 'rec_8',
    grade: '5학년',
    classNum: '1반',
    studentName: '박지훈',
    title: '파브르 곤충기',
    author: '장앙리 파브르',
    publisher: '웅진주니어',
    summary: '곤충들의 행동과 습성을 관찰하여 사실적이고 생생하게 기록한 자연과학 생태 보고서입니다.',
    thoughts: '작은 곤충들에게도 엄청난 지혜와 생명력이 숨어있다는 것이 신기했습니다.',
    rating: 4,
    readDate: '2026-07-23',
    createdAt: '2026-07-23T15:10:00.000Z'
  },
  {
    id: 'rec_9',
    grade: '5학년',
    classNum: '1반',
    studentName: '박지훈',
    title: '자전거 도둑',
    author: '박완서',
    publisher: '다림',
    summary: '도시로 올라온 시골 소년 수남이가 자전거 도둑 사건을 통해 양심과 도덕적 갈등을 겪으며 한층 성장해가는 소설입니다.',
    thoughts: '양심을 속이지 않고 정직하게 살아가는 것이 얼마나 중요한지 깨달았습니다.',
    rating: 4,
    readDate: '2026-07-19',
    createdAt: '2026-07-19T10:00:00.000Z'
  },
  {
    id: 'rec_10',
    grade: '5학년',
    classNum: '2반',
    studentName: '최수아',
    title: '몽실 언니',
    author: '권정생',
    publisher: '창비',
    summary: '6·25 전쟁의 아픔 속에서도 동생들을 돌보며 모진 고난을 이겨낸 몽실 언니의 감동적이고 따뜻한 가슴 아픈 고난 극복 이야기입니다.',
    thoughts: '어려운 상황에서도 가족을 지키려 애쓴 몽실 언니의 강인한 마음을 닮고 싶습니다.',
    rating: 5,
    readDate: '2026-07-21',
    createdAt: '2026-07-21T17:25:00.000Z'
  },
  {
    id: 'rec_11',
    grade: '5학년',
    classNum: '3반',
    studentName: '정우진',
    title: '삼국지 (초등 높임)',
    author: '나관중',
    publisher: '비룡소',
    summary: '위, 촉, 오 세 나라의 영웅들이 펼치는 지혜와 용기, 지략의 승부와 충의의 역사를 담은 서사입니다.',
    thoughts: '유비와 제갈량의 지혜와 우정에 인상을 받았고 지혜롭게 문제를 해결해야겠다고 생각했습니다.',
    rating: 5,
    readDate: '2026-07-25',
    createdAt: '2026-07-25T14:00:00.000Z'
  }
];

export const INITIAL_CHEER_MESSAGES: CheerMessage[] = [
  {
    id: 'cheer_1',
    fromStudent: '박지훈',
    toStudent: '이서연',
    message: '서연아 이번 달에 책 4권이나 읽었네! 정말 대단해!! 나도 따라잡을게~ 👏',
    createdAt: '2026-07-25T14:30:00.000Z',
    likes: 5
  },
  {
    id: 'cheer_2',
    fromStudent: '최수아',
    toStudent: '김민준',
    message: '민준이의 어린왕자 소감문 읽고 나도 오늘 도서관에서 책 빌렸어! 고마워 😊',
    createdAt: '2026-07-24T18:10:00.000Z',
    likes: 8
  },
  {
    id: 'cheer_3',
    fromStudent: '선생님',
    toStudent: '우리반 전체',
    message: '우리반 친구들의 독서 열정이 대단하네요! 이번 달 독서왕 친구들 모두 축하합니다 🎉',
    createdAt: '2026-07-26T09:00:00.000Z',
    likes: 12
  }
];

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ====================================================================
 * [우리반 전자 독서기록장] Google Apps Script (Code.gs)
 * ====================================================================
 * 이 스크립트는 구글 시트와 웹 애플리케이션을 실시간 연동합니다.
 * 
 * [설치 및 배포 방법]
 * 1. 구글 시트 생성 후 상단 메뉴에서 [확장 프로그램] -> [Apps Script] 클릭
 * 2. 기존 코드를 모두 지우고 이 코드를 전체 복사하여 붙여넣기
 * 3. 상단 [저장] 아이콘 클릭
 * 4. 오른쪽 위 [배포] 버튼 -> [새 배포] 클릭
 * 5. 톱니바퀴 아이콘 -> [웹 앱] 선택
 * 6. 설정 항목:
 *    - 설명: 우리반 독서기록장 API
 *    - 다음 사용자 권한으로 실행: [나] (자신의 계정)
 *    - 액세스 권한 있는 사용자: [모든 사용자] (Anyone) 필수!
 * 7. [배포] 클릭 후 승인 절차 진행 -> '웹 앱 URL' 복사!
 * 8. 우리반 독서기록장 웹사이트의 [구글 연동 설정] 탭에 URL 붙여넣기!
 * ====================================================================
 */

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createJsonResponse({ status: "success", records: [] });
    }
    
    var headers = data[0];
    var records = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue; // ID 없으면 패스
      
      records.push({
        id: String(row[0]),
        createdAt: String(row[1] || ''),
        grade: String(row[2] || ''),
        classNum: String(row[3] || ''),
        studentName: String(row[4] || ''),
        title: String(row[5] || ''),
        author: String(row[6] || ''),
        publisher: String(row[7] || ''),
        rating: Number(row[8] || 5),
        summary: String(row[9] || ''),
        thoughts: String(row[10] || ''),
        readDate: String(row[11] || '')
      });
    }
    
    return createJsonResponse({
      status: "success",
      count: records.length,
      records: records
    });
  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    var postData;
    
    if (e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else {
      postData = e.parameter;
    }
    
    // 단일 삭제 요청 처리
    if (postData.action === 'delete') {
      var recordId = postData.id;
      var data = sheet.getDataRange().getValues();
      var deleted = false;
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(recordId)) {
          sheet.deleteRow(i + 1);
          deleted = true;
          break;
        }
      }
      return createJsonResponse({
        status: deleted ? "success" : "not_found",
        message: deleted ? "기록이 삭제되었습니다." : "해당 기록을 찾지 못했습니다."
      });
    }
    
    // 신규 독서기록 저장 처리
    var id = postData.id || ("rec_" + Date.now());
    var createdAt = postData.createdAt || new Date().toISOString();
    var grade = postData.grade || "";
    var classNum = postData.classNum || "";
    var studentName = postData.studentName || "";
    var title = postData.title || "";
    var author = postData.author || "";
    var publisher = postData.publisher || "";
    var rating = postData.rating || 5;
    var summary = postData.summary || "";
    var thoughts = postData.thoughts || "";
    var readDate = postData.readDate || "";

    // 행 추가
    sheet.appendRow([
      id,
      createdAt,
      grade,
      classNum,
      studentName,
      title,
      author,
      publisher,
      rating,
      summary,
      thoughts,
      readDate
    ]);

    return createJsonResponse({
      status: "success",
      message: "독서 기록이 구글 시트에 정상 등록되었습니다!",
      record: {
        id: id,
        createdAt: createdAt,
        grade: grade,
        classNum: classNum,
        studentName: studentName,
        title: title,
        author: author,
        publisher: publisher,
        rating: rating,
        summary: summary,
        thoughts: thoughts,
        readDate: readDate
      }
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "저장 실패: " + error.toString()
    });
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "독서기록";
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // 헤더 행 작성
    sheet.appendRow([
      "기록ID", "작성일시", "학년", "반", "학생이름",
      "도서명", "지은이", "출판사", "별점", "줄거리요약",
      "느낀점_소감", "읽은날짜"
    ]);
    
    // 디자인 서식 적용
    var headerRange = sheet.getRange("A1:L1");
    headerRange.setBackground("#4F46E5");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
