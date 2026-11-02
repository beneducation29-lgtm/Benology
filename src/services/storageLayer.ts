import {
  ChatMessage,
  GoalsState,
  JournalEntry,
  LearningMemoryItem,
  MasteryStatus,
  PersonalizedRoadmap,
  SmartReviewState,
  StructuredLesson,
  TopicProgressRecord,
  UnderstandingLevel,
} from '../types/mentor';

export const STORAGE_KEYS = {
  // Existing keys preserved strictly so no user data is lost
  ROADMAP: 'khaiminh_roadmap_v1',
  PROGRESS: 'khaiminh_progress_v1',
  LESSONS: 'khaiminh_lessons_v1',
  CHAT: 'khaiminh_chat_v1',
  // Extended modular keys
  GOALS: 'pgai_goals_v1',
  JOURNAL: 'pgai_journal_v1',
  MEMORY: 'pgai_learning_memory_v1',
  MEMORY_ENABLED: 'pgai_memory_enabled_v1',
};

export function getTodayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function loadStorageItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota exceptions safely
  }
}

export function statusToUnderstandingAndReview(
  status: MasteryStatus,
  isDifficult?: boolean
): { understandingLevel: UnderstandingLevel; reviewState: SmartReviewState } {
  if (isDifficult || status === MasteryStatus.NEEDS_REVIEW) {
    return {
      understandingLevel: UnderstandingLevel.READ,
      reviewState: SmartReviewState.REVIEW,
    };
  }
  switch (status) {
    case MasteryStatus.NOT_STARTED:
      return {
        understandingLevel: UnderstandingLevel.UNKNOWN,
        reviewState: SmartReviewState.NEW,
      };
    case MasteryStatus.LEARNING:
      return {
        understandingLevel: UnderstandingLevel.READ,
        reviewState: SmartReviewState.LEARNING,
      };
    case MasteryStatus.BASIC_UNDERSTANDING:
      return {
        understandingLevel: UnderstandingLevel.BASIC,
        reviewState: SmartReviewState.PRACTICING,
      };
    case MasteryStatus.CAN_EXPLAIN:
      return {
        understandingLevel: UnderstandingLevel.CAN_EXPLAIN,
        reviewState: SmartReviewState.PRACTICING,
      };
    case MasteryStatus.CAN_APPLY:
      return {
        understandingLevel: UnderstandingLevel.CAN_APPLY,
        reviewState: SmartReviewState.MASTERED,
      };
    default:
      return {
        understandingLevel: UnderstandingLevel.UNKNOWN,
        reviewState: SmartReviewState.NEW,
      };
  }
}

export function understandingToMasteryStatus(level: UnderstandingLevel): MasteryStatus {
  switch (level) {
    case UnderstandingLevel.UNKNOWN:
      return MasteryStatus.NOT_STARTED;
    case UnderstandingLevel.READ:
      return MasteryStatus.LEARNING;
    case UnderstandingLevel.BASIC:
      return MasteryStatus.BASIC_UNDERSTANDING;
    case UnderstandingLevel.CAN_EXPLAIN:
      return MasteryStatus.CAN_EXPLAIN;
    case UnderstandingLevel.CAN_APPLY:
      return MasteryStatus.CAN_APPLY;
  }
}

export function normalizeProgressMap(
  rawMap: Record<string, TopicProgressRecord>
): Record<string, TopicProgressRecord> {
  const normalized: Record<string, TopicProgressRecord> = {};
  for (const [topicId, rec] of Object.entries(rawMap)) {
    const derived = statusToUnderstandingAndReview(rec.status, rec.isDifficult);
    normalized[topicId] = {
      ...rec,
      understandingLevel: rec.understandingLevel ?? derived.understandingLevel,
      reviewState: rec.reviewState ?? derived.reviewState,
    };
  }
  return normalized;
}

export function getInitialGoalsState(roadmap: PersonalizedRoadmap | null): GoalsState {
  const today = getTodayISO();
  return loadStorageItem<GoalsState>(STORAGE_KEYS.GOALS, {
    dailyGoalMinutes: roadmap?.dailyMinutes || 20,
    weeklyLessonsTarget: 3,
    longTermGoal:
      roadmap?.longTermGoal ||
      'Xây dựng nền tảng tư duy phản biện, hiểu biết kinh tế và năng lực tự học độc lập trong 6 tháng.',
    dailyLogs: {
      [today]: {
        dateISO: today,
        minutes: 10,
        lessonsTouched: 1,
      },
    },
  });
}

export function computeStreakAndMissedDayInfo(goals: GoalsState): {
  streakDays: number;
  todayMinutes: number;
  weekMinutes: number;
  weekLessons: number;
  missedYesterday: boolean;
  last7Days: { dateISO: string; shortLabel: string; minutes: number }[];
} {
  const today = new Date();
  const todayKey = getTodayISO();
  const todayMinutes = goals.dailyLogs[todayKey]?.minutes || 0;

  const last7Days: { dateISO: string; shortLabel: string; minutes: number }[] = [];
  let weekMinutes = 0;
  let weekLessons = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    const log = goals.dailyLogs[key];
    const mins = log?.minutes || 0;
    weekMinutes += mins;
    weekLessons += log?.lessonsTouched || 0;
    last7Days.push({
      dateISO: key,
      shortLabel: `${day}/${m}`,
      minutes: mins,
    });
  }

  let streakDays = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    const mins = goals.dailyLogs[key]?.minutes || 0;
    if (mins > 0) {
      streakDays += 1;
    } else {
      if (i === 0) continue; // Today can still be in progress
      break;
    }
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = `${yesterday.getFullYear()}-${String(
    yesterday.getMonth() + 1
  ).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  const hadEarlierActivity = Object.keys(goals.dailyLogs).some(
    (k) => k < yesterdayKey && (goals.dailyLogs[k]?.minutes || 0) > 0
  );
  const missedYesterday =
    hadEarlierActivity && (goals.dailyLogs[yesterdayKey]?.minutes || 0) === 0;

  return {
    streakDays,
    todayMinutes,
    weekMinutes,
    weekLessons,
    missedYesterday,
    last7Days,
  };
}

export function buildMemorySummaryForAI(
  memoryItems: LearningMemoryItem[],
  progressMap: Record<string, TopicProgressRecord>,
  goals: GoalsState
): string {
  const difficultIds = Object.values(progressMap)
    .filter((p) => p.reviewState === SmartReviewState.REVIEW || p.isDifficult)
    .map((p) => p.topicId)
    .slice(0, 5);

  const recentQuestions = memoryItems
    .filter((m) => m.category === 'question_asked')
    .slice(-4)
    .map((m) => m.content);

  const lines: string[] = [
    `Mục tiêu dài hạn: ${goals.longTermGoal}`,
    `Mục tiêu hàng ngày: ${goals.dailyGoalMinutes} phút/ngày`,
  ];
  if (difficultIds.length > 0) {
    lines.push(`Các mã chủ đề đang cần ôn tập thêm: ${difficultIds.join(', ')}`);
  }
  if (recentQuestions.length > 0) {
    lines.push(`Câu hỏi gần đây người học từng trăn trở: ${recentQuestions.join(' | ')}`);
  }
  return lines.join('\n');
}

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'journal-starter-1',
    createdAt: '2026-11-01T08:30:00.000Z',
    updatedAt: '2026-11-01T08:30:00.000Z',
    title: 'Nhận ra giả định ẩn trong cách quản lý thời gian học',
    learnedToday:
      'Đọc lướt nhiều bài viết không đồng nghĩa với việc hiểu bản chất; chỉ khi đóng sách lại tự giải thích mới biết mình hổng ở đâu.',
    changedMind:
      'Trước đây tôi nghĩ phải có 2 tiếng rảnh mới học sâu được, nay nhận ra 20 phút tập trung mỗi ngày bền vững hơn nhiều.',
    unansweredQuestion:
      'Làm sao cân bằng giữa việc đào sâu một chuyên môn duy nhất và việc mở rộng kiến thức liên ngành?',
    decisionWeighing:
      'Đang cân nhắc phân bổ ngân sách cá nhân giữa quỹ dự phòng thanh khoản và học thêm kỹ năng chuyên môn.',
    mistakeAnalysis:
      'Tuần trước từng tin ngay một thống kê trên mạng xã hội mà quên kiểm tra nguồn gốc nghiên cứu.',
    linkedDomainId: 'self-learning',
  },
];

export const INITIAL_MEMORY_ITEMS: LearningMemoryItem[] = [
  {
    id: 'mem-goal-1',
    category: 'learning_goal',
    content: 'Rèn luyện khả năng suy nghĩ độc lập, kiểm chứng nguồn tin và hiểu nền tảng kinh tế – tài chính cá nhân.',
    createdAt: '2026-11-01T08:00:00.000Z',
  },
];

export const INITIAL_WELCOME_CHAT: ChatMessage = {
  id: 'initial-mentor-greeting',
  role: 'mentor',
  content: `Chào bạn! Chào mừng bạn đến với **Personal Growth AI** (*Học sâu hơn – Nghĩ độc lập – Sống tốt hơn*).

Bạn có thể chuyển đổi linh hoạt giữa **4 chế độ cố vấn** ngay trên thanh công cụ:
- **Giảng dạy**: Giải thích kiến thức từng bước từ gốc rễ.
- **Socratic**: Đặt câu hỏi gợi mở và kiểm tra giả định để bạn tự suy luận.
- **Phản biện**: Đóng vai góc nhìn đối lập chỉ ra điểm yếu lập luận và phản ví dụ.
- **Ứng dụng**: Chuyển hóa nguyên lý vào công việc, tài chính và quyết định thực tế.

Hôm nay bạn muốn phát triển bản thân từ lĩnh vực nào hay kiểm định một suy nghĩ nào trước?`,
  timestamp: '2026-11-01T08:00:00.000Z',
};
