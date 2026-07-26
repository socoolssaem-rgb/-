export interface ReadingQuote {
  id: string;
  quote: string;
  author: string;
  bookTitle?: string;
  category: 'wisdom' | 'courage' | 'comfort' | 'growth' | 'dream' | 'friendship';
  categoryLabel: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  reflectionQuestion: string;
}

export interface RecommendedBook {
  id: string;
  title: string;
  author: string;
  publisher: string;
  coverGradient: string;
  accentColor: string;
  category: 'bestseller' | 'teacher' | 'emotional' | 'growth';
  categoryLabel: string;
  rating: number;
  quoteSnippet: string;
  summary: string;
  reviewCount: number;
  badge?: string;
}

export const READING_QUOTES: ReadingQuote[] = [
  {
    id: 'q1',
    quote: "가장 중요한 것은 눈에 보이지 않아. 마음으로 보아야만 분명하게 볼 수 있어.",
    author: "앙투안 드 생텍쥐페리",
    bookTitle: "어린 왕자",
    category: "wisdom",
    categoryLabel: "마음의 지혜",
    bgColor: "from-amber-900/90 via-amber-800/80 to-slate-900",
    textColor: "text-amber-200",
    borderColor: "border-amber-500/30",
    reflectionQuestion: "나에게 겉모습보다 내면이 더 소중했던 순간은 언제였나요?"
  },
  {
    id: 'q2',
    quote: "오늘의 나를 만든 것은 동네 도서관이었다. 독서 습관은 나의 미래를 밝히는 가장 큰 등대다.",
    author: "빌 게이츠",
    bookTitle: "독서 명언",
    category: "growth",
    categoryLabel: "미래와 성장",
    bgColor: "from-indigo-900/90 via-slate-900 to-blue-950",
    textColor: "text-indigo-200",
    borderColor: "border-indigo-500/30",
    reflectionQuestion: "오늘 읽은 한 줄이 나의 10년 후 모습을 어떻게 바꿀 수 있을까요?"
  },
  {
    id: 'q3',
    quote: "한 권의 좋은 책을 읽는 것은 지나간 세기의 가장 뛰어난 사람들과 대화를 나누는 것과 같다.",
    author: "르네 데카르트",
    bookTitle: "방법서설",
    category: "wisdom",
    categoryLabel: "지식과 탐구",
    bgColor: "from-emerald-950/90 via-teal-900 to-slate-900",
    textColor: "text-emerald-200",
    borderColor: "border-emerald-500/30",
    reflectionQuestion: "내가 만나서 이야기 나눠보고 싶은 역사 속 책 저자는 누구인가요?"
  },
  {
    id: 'q4',
    quote: "시간 도둑에게 빼앗긴 시간은 되찾을 수 있지만, 사람들의 진심 어린 경청은 그 자체로 마법이다.",
    author: "미하엘 엔데",
    bookTitle: "모모",
    category: "comfort",
    categoryLabel: "따뜻한 위로",
    bgColor: "from-rose-950/90 via-slate-900 to-purple-950",
    textColor: "text-rose-200",
    borderColor: "border-rose-500/30",
    reflectionQuestion: "요즘 바쁜 일상 속에서 진심으로 누군가의 말에 귀 기울인 적이 있나요?"
  },
  {
    id: 'q5',
    quote: "사람은 책을 만들고, 책은 사람을 만든다. 책 한 권에 담긴 따뜻한 쉼표 하나가 인생을 바꾼다.",
    author: "신용호",
    bookTitle: "교보문고 현판 문구",
    category: "dream",
    categoryLabel: "꿈과 희망",
    bgColor: "from-sky-950/90 via-blue-900 to-slate-900",
    textColor: "text-sky-200",
    borderColor: "border-sky-500/30",
    reflectionQuestion: "나의 삶에 긍정적인 변화를 안겨준 한 권의 책은 무엇인가요?"
  },
  {
    id: 'q6',
    quote: "서로를 따뜻하게 배려하는 작은 마음이 사람의 얼어붙은 마음을 녹이고 세상을 밝게 바꾼다.",
    author: "김호연",
    bookTitle: "불편한 편의점",
    category: "friendship",
    categoryLabel: "우정과 배려",
    bgColor: "from-amber-950/90 via-stone-900 to-orange-950",
    textColor: "text-amber-100",
    borderColor: "border-amber-500/30",
    reflectionQuestion: "우리 학급 친구에게 전하고 싶은 따뜻한 관심의 한마디는?"
  },
  {
    id: 'q7',
    quote: "두려움은 알지 못함에서 나온다. 책을 열 때마다 우리는 세상의 두려움을 용기로 바꾸어 나간다.",
    author: "손원평",
    bookTitle: "아몬드",
    category: "courage",
    categoryLabel: "용기와 공감",
    bgColor: "from-purple-950/90 via-slate-900 to-indigo-950",
    textColor: "text-purple-200",
    borderColor: "border-purple-500/30",
    reflectionQuestion: "타인의 마음을 더 깊이 공감하기 위해 내가 할 수 있는 노력은 무엇일까요?"
  },
  {
    id: 'q8',
    quote: "책 없는 방은 영혼 없는 몸과 같다. 마음이 답답할 때 책장 한 편을 열어보아라.",
    author: "마르쿠스 툴리우스 시세로",
    bookTitle: "고전 명언",
    category: "wisdom",
    categoryLabel: "마음의 양식",
    bgColor: "from-cyan-950/90 via-slate-900 to-teal-950",
    textColor: "text-cyan-200",
    borderColor: "border-cyan-500/30",
    reflectionQuestion: "내가 책을 읽을 때 가장 마음이 평온해지는 장소는 어디인가요?"
  }
];

export const RECOMMENDED_BOOKS: RecommendedBook[] = [
  {
    id: 'b1',
    title: '어린 왕자',
    author: '앙투안 드 생텍쥐페리',
    publisher: '열린책들',
    coverGradient: 'from-amber-500 via-orange-600 to-indigo-900',
    accentColor: 'bg-amber-500',
    category: 'bestseller',
    categoryLabel: '🔥 학급 베스트셀러',
    rating: 5,
    quoteSnippet: '“소중한 것은 눈에 보이지 않아.”',
    summary: '사막에 불시착한 조종사와 순수한 어린 왕자의 특별한 만남과 우정 이야기.',
    reviewCount: 24,
    badge: '스테디셀러'
  },
  {
    id: 'b2',
    title: '모모',
    author: '미하엘 엔데',
    publisher: '비룡소',
    coverGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    accentColor: 'bg-teal-500',
    category: 'teacher',
    categoryLabel: '⭐ 선생님 강력 추천',
    rating: 5,
    quoteSnippet: '“진정한 시간은 마음으로 느끼는 것이다.”',
    summary: '시간 도둑에 맞서 사람들의 소중한 시간을 되찾아주는 특별한 소녀 모모의 모험.',
    reviewCount: 18,
    badge: '교사추천'
  },
  {
    id: 'b3',
    title: '불편한 편의점',
    author: '김호연',
    publisher: '나무옆의자',
    coverGradient: 'from-indigo-600 via-purple-700 to-slate-900',
    accentColor: 'bg-indigo-500',
    category: 'emotional',
    categoryLabel: '🌿 따뜻한 감성 소설',
    rating: 5,
    quoteSnippet: '“따뜻한 한 마디가 위로가 되는 곳.”',
    summary: '골목길 작은 편의점에서 펼쳐지는 이웃들의 소소하고 따스한 유쾌 치유기.',
    reviewCount: 31,
    badge: '인기 폭발'
  },
  {
    id: 'b4',
    title: '지구 끝의 온실',
    author: '김초엽',
    publisher: '자이언트북스',
    coverGradient: 'from-cyan-600 via-blue-700 to-slate-900',
    accentColor: 'bg-cyan-500',
    category: 'growth',
    categoryLabel: '🚀 모험 & 미래 SF',
    rating: 4.8,
    quoteSnippet: '“어둠 속에서도 피어나는 연대의 희망.”',
    summary: '디스토피아 세상 속 특별한 식물과 사람들의 끈질긴 생명력과 감동적인 연대.',
    reviewCount: 15,
    badge: 'SF추천'
  },
  {
    id: 'b5',
    title: '마당을 나온 암탉',
    author: '황선미',
    publisher: '사계절',
    coverGradient: 'from-amber-600 via-red-600 to-stone-900',
    accentColor: 'bg-orange-500',
    category: 'emotional',
    categoryLabel: '🌿 따뜻한 감성 동화',
    rating: 4.9,
    quoteSnippet: '“꿈을 향해 양계장을 탈출한 잎싹이.”',
    summary: '자유를 열망하며 도전을 멈추지 않는 암탉 잎싹이의 가슴 뭉클한 사랑과 모험.',
    reviewCount: 20,
    badge: '감동 스테디'
  },
  {
    id: 'b6',
    title: '아몬드',
    author: '손원평',
    publisher: '창비',
    coverGradient: 'from-violet-600 via-purple-800 to-slate-900',
    accentColor: 'bg-violet-500',
    category: 'growth',
    categoryLabel: '🚀 청소년 성장 소설',
    rating: 4.9,
    quoteSnippet: '“감정을 찾아가는 소년 윤재의 걸음.”',
    summary: '감정표현 불능증을 겪는 윤재가 세상과 소통하며 타인의 마음을 이해해가는 과정.',
    reviewCount: 22,
    badge: '필독서'
  }
];
