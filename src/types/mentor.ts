export enum MasteryStatus {
  NOT_STARTED = 'CHƯA HỌC',
  LEARNING = 'ĐANG HỌC',
  BASIC_UNDERSTANDING = 'ĐÃ HIỂU CƠ BẢN',
  CAN_EXPLAIN = 'CÓ THỂ GIẢI THÍCH',
  CAN_APPLY = 'CÓ THỂ ÁP DỤNG',
  NEEDS_REVIEW = 'CẦN ÔN LẠI',
}

export enum UnderstandingLevel {
  UNKNOWN = 1,
  READ = 2,
  BASIC = 3,
  CAN_EXPLAIN = 4,
  CAN_APPLY = 5,
}

export enum SmartReviewState {
  NEW = 'NEW',
  LEARNING = 'LEARNING',
  PRACTICING = 'PRACTICING',
  REVIEW = 'REVIEW',
  MASTERED = 'MASTERED',
}

export enum LearningPathLevel {
  FOUNDATION = 1,
  UNDERSTANDING = 2,
  ANALYSIS = 3,
  APPLICATION = 4,
  INDEPENDENT_THINKING = 5,
}

export enum MentorMode {
  TEACHING = 'teaching',
  SOCRATIC = 'socratic',
  CRITIQUE = 'critique',
  APPLICATION = 'application',
}

export enum KnowledgeLevel {
  BEGINNER = 'Mới bắt đầu',
  BASIC = 'Cơ bản',
  INTERMEDIATE = 'Trung cấp',
  ADVANCED = 'Nâng cao',
}

export interface SubTopic {
  id: string;
  title: string;
  pathLevel: LearningPathLevel;
  stageLabel?: string;
  summary: string;
  guidingQuestion: string;
}

export interface LearningDomain {
  id: string;
  indexLabel: string;
  title: string;
  shortTitle: string;
  cardTagline: string;
  coreQuestion: string;
  overview: string;
  crossDomainLinks: string[];
  pedagogicalPrinciples: string[];
  epistemicGuardrail: string;
  socraticPrompts: string[];
  topics: SubTopic[];
}

export interface TerminologyItem {
  termVi: string;
  termEn: string;
  simpleExplanation: string;
  realWorldExample: string;
}

export interface LessonExample {
  context: string;
  scenario: string;
  insight: string;
}

export interface StructuredLesson {
  topicId: string;
  domainId: string;
  title: string;
  domainName: string;
  estimatedMinutes: number;
  epistemicNote: string;
  openingQuestion?: string;
  terminology: TerminologyItem[];
  part1Intro: string;
  part2Essence: string;
  part3Examples: LessonExample[];
  part4CounterPerspectives: string[];
  part5SocraticQuestions: string[];
  part6ActionExercise: {
    title: string;
    instructions: string;
    reflectionCriteria: string;
  };
  part7Summary: {
    keyTakeaways: string[];
    foodForThought: string;
    concreteAction: string;
  };
  generatedAt: string;
}

export interface RemedialSupport {
  simplerExplanation: string;
  freshEverydayExample: string;
  steppingStoneExercise: string;
  encouragementNote: string;
}

export interface EvaluationResult {
  explanationFeedback: string;
  analysisFeedback: string;
  critiqueFeedback: string;
  applicationFeedback: string;
  blindSpotsAndAssumptions: string[];
  followUpSocraticQuestion: string;
  recommendedStatus: MasteryStatus;
  rationale: string;
}

export interface RoadmapMilestone {
  phaseNumber: number;
  phaseTitle: string;
  timeframe: string;
  focusTopics: string[];
  dailyPracticeRoutine: string;
  milestoneCheckQuestion: string;
}

export interface PersonalizedRoadmap {
  domainId: string;
  domainTitle: string;
  currentLevel: KnowledgeLevel;
  longTermGoal: string;
  dailyMinutes: number;
  mentorGreeting: string;
  coreStrategy: string;
  antiDependencyReminder: string;
  recommendedFirstTopicId: string;
  milestones: RoadmapMilestone[];
  createdAt: string;
}

export interface CriticalThinkingAnalysis {
  originalStatement: string;
  step1CoreClaim: string;
  step2HiddenAssumptions: string[];
  step3EvidenceCheck: {
    epistemicType: string;
    sourceStrength: string;
    missingEvidence: string[];
  };
  step4CounterArguments: string[];
  step5CognitiveBiases: {
    biasVi: string;
    biasEn: string;
    explanation: string;
  }[];
  step6ConditionalConclusion: string;
  independentNextStepQuestion: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'mentor';
  content: string;
  mode?: MentorMode;
  domainId?: string;
  timestamp: string;
}

export interface TopicProgressRecord {
  topicId: string;
  domainId: string;
  status: MasteryStatus;
  understandingLevel?: UnderstandingLevel;
  reviewState?: SmartReviewState;
  isDifficult?: boolean;
  lastStudiedAt: string;
  selfExplanationNote?: string;
  lastEvaluation?: EvaluationResult;
  remedialSupport?: RemedialSupport;
}

export interface DailyStudyLog {
  dateISO: string; // YYYY-MM-DD
  minutes: number;
  lessonsTouched: number;
}

export interface GoalsState {
  dailyGoalMinutes: number;
  weeklyLessonsTarget: number;
  longTermGoal: string;
  dailyLogs: Record<string, DailyStudyLog>;
}

export type JournalPromptType =
  | 'learned_today'
  | 'changed_mind'
  | 'unanswered_question'
  | 'decision_weighing'
  | 'mistake_analysis';

export interface JournalEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  learnedToday: string;
  changedMind: string;
  unansweredQuestion: string;
  decisionWeighing: string;
  mistakeAnalysis: string;
  linkedDomainId?: string;
}

export interface JournalAIInsight {
  summary: string;
  recurringThemes: string[];
  socraticQuestions: string[];
  generatedAt: string;
}

export type MemoryCategory =
  | 'question_asked'
  | 'difficult_topic'
  | 'completed_exercise'
  | 'learning_goal';

export interface LearningMemoryItem {
  id: string;
  category: MemoryCategory;
  content: string;
  domainId?: string;
  createdAt: string;
}

export type ThinkingDrillType = 'argument' | 'bias' | 'two_sides' | 'source_check';

export interface ThinkingDrillScenario {
  id: string;
  type: ThinkingDrillType;
  title: string;
  domainTag: string;
  promptText: string;
  sideA?: string;
  sideB?: string;
  sourceMeta?: string;
}

export interface ThinkingDrillFeedback {
  strengths: string;
  missedNuances: string[];
  mentorPerspective: string;
  nextThinkingQuestion: string;
}
