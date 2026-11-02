import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  LifeBuoy,
  Loader2,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import {
  LEARNING_DOMAINS,
  LEARNING_PATH_LEVEL_META,
  MASTERY_STATUS_ORDER,
  STARTER_LESSONS,
  UNDERSTANDING_LEVEL_LABELS,
} from '../data/curriculum';
import {
  EvaluationResult,
  MasteryStatus,
  MentorMode,
  PersonalizedRoadmap,
  RemedialSupport,
  SmartReviewState,
  StructuredLesson,
  TopicProgressRecord,
  UnderstandingLevel,
} from '../types/mentor';
import {
  evaluateLearnerReflection,
  generateRemedialSupport,
  generateStructuredLesson,
} from '../services/mentorApi';
import { understandingToMasteryStatus } from '../services/storageLayer';
import { RichTextRenderer } from './RichTextRenderer';

interface LessonWorkspaceViewProps {
  activeDomainId: string;
  activeTopicId: string;
  onChangeTopic: (domainId: string, topicId: string) => void;
  onBackToLearningPath: () => void;
  onOpenAIMentorWithContext: (
    domainId: string,
    prompt: string,
    mode?: MentorMode
  ) => void;
  roadmap: PersonalizedRoadmap | null;
  cachedLessons: Record<string, StructuredLesson>;
  onCacheLesson: (topicId: string, lesson: StructuredLesson) => void;
  progressMap: Record<string, TopicProgressRecord>;
  onUpdateProgress: (
    domainId: string,
    topicId: string,
    updates: Partial<TopicProgressRecord>
  ) => void;
  onRecordCompletedExercise: (domainId: string, summary: string) => void;
  onRecordDifficultTopic: (domainId: string, topicTitle: string) => void;
}

export function LessonWorkspaceView({
  activeDomainId,
  activeTopicId,
  onChangeTopic,
  onBackToLearningPath,
  onOpenAIMentorWithContext,
  roadmap,
  cachedLessons,
  onCacheLesson,
  progressMap,
  onUpdateProgress,
  onRecordCompletedExercise,
  onRecordDifficultTopic,
}: LessonWorkspaceViewProps) {
  const currentDomain =
    LEARNING_DOMAINS.find((d) => d.id === activeDomainId) || LEARNING_DOMAINS[0];
  const currentTopic =
    currentDomain.topics.find((t) => t.id === activeTopicId) || currentDomain.topics[0];
  const pathMeta = LEARNING_PATH_LEVEL_META[currentTopic.pathLevel];

  const currentLesson: StructuredLesson | undefined =
    cachedLessons[currentTopic.id] || STARTER_LESSONS[currentTopic.id];

  const currentProgress = progressMap[currentTopic.id];
  const currentUnderstanding =
    currentProgress?.understandingLevel || UnderstandingLevel.UNKNOWN;
  const currentReviewState = currentProgress?.reviewState || SmartReviewState.NEW;

  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [activeRecallHidden, setActiveRecallHidden] = useState(false);

  // Reflection & Evaluation state
  const [reflectionText, setReflectionText] = useState<string>(
    currentProgress?.selfExplanationNote || ''
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | undefined>(
    currentProgress?.lastEvaluation
  );

  // Smart Review Remedial Support state
  const [confusionInput, setConfusionInput] = useState('');
  const [showRemedialForm, setShowRemedialForm] = useState(false);
  const [isGeneratingRemedial, setIsGeneratingRemedial] = useState(false);
  const [remedialData, setRemedialData] = useState<RemedialSupport | undefined>(
    currentProgress?.remedialSupport
  );

  useEffect(() => {
    const saved = progressMap[currentTopic.id];
    setReflectionText(saved?.selfExplanationNote || '');
    setEvaluation(saved?.lastEvaluation);
    setRemedialData(saved?.remedialSupport);
    setEvalError(null);
    setActiveRecallHidden(false);
    setShowRemedialForm(false);
  }, [currentTopic.id, progressMap]);

  const fetchLesson = async (forceRefresh = false) => {
    if (!forceRefresh && (cachedLessons[currentTopic.id] || STARTER_LESSONS[currentTopic.id])) {
      if (!progressMap[currentTopic.id]) {
        // Reading alone sets level 2 (READ) and LEARNING, never auto-MASTERED
        onUpdateProgress(currentDomain.id, currentTopic.id, {
          status: MasteryStatus.LEARNING,
          understandingLevel: UnderstandingLevel.READ,
          reviewState: SmartReviewState.LEARNING,
        });
      }
      return;
    }

    setIsLoadingLesson(true);
    setLessonError(null);
    try {
      const generated = await generateStructuredLesson({
        domainId: currentDomain.id,
        domainTitle: currentDomain.title,
        topicId: currentTopic.id,
        topicTitle: currentTopic.title,
        topicSummary: currentTopic.summary,
        epistemicGuardrail: currentDomain.epistemicGuardrail,
        userLevel: roadmap?.currentLevel,
        dailyMinutes: roadmap?.dailyMinutes,
        userGoal: roadmap?.longTermGoal,
      });
      onCacheLesson(currentTopic.id, generated);
      if (!progressMap[currentTopic.id] || currentUnderstanding === UnderstandingLevel.UNKNOWN) {
        onUpdateProgress(currentDomain.id, currentTopic.id, {
          status: MasteryStatus.LEARNING,
          understandingLevel: UnderstandingLevel.READ,
          reviewState: SmartReviewState.LEARNING,
        });
      }
    } catch (err) {
      setLessonError(
        err instanceof Error ? err.message : 'Không thể tải nội dung bài học.'
      );
    } finally {
      setIsLoadingLesson(false);
    }
  };

  useEffect(() => {
    fetchLesson(false);
  }, [currentTopic.id]);

  const handleEvaluateReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLesson || !reflectionText.trim()) return;
    setIsEvaluating(true);
    setEvalError(null);
    try {
      const result = await evaluateLearnerReflection({
        domainTitle: currentDomain.title,
        topicTitle: currentLesson.title,
        socraticQuestions: currentLesson.part5SocraticQuestions,
        exerciseInstructions: currentLesson.part6ActionExercise.instructions,
        learnerResponse: reflectionText.trim(),
      });
      setEvaluation(result);
      const validStatus = MASTERY_STATUS_ORDER.includes(result.recommendedStatus)
        ? result.recommendedStatus
        : MasteryStatus.BASIC_UNDERSTANDING;

      let nextUnderstanding = UnderstandingLevel.BASIC;
      let nextReview = SmartReviewState.PRACTICING;
      if (validStatus === MasteryStatus.CAN_APPLY) {
        nextUnderstanding = UnderstandingLevel.CAN_APPLY;
        nextReview = SmartReviewState.MASTERED;
      } else if (validStatus === MasteryStatus.CAN_EXPLAIN) {
        nextUnderstanding = UnderstandingLevel.CAN_EXPLAIN;
        nextReview = SmartReviewState.PRACTICING;
      } else if (validStatus === MasteryStatus.NEEDS_REVIEW) {
        nextUnderstanding = UnderstandingLevel.READ;
        nextReview = SmartReviewState.REVIEW;
      } else if (validStatus === MasteryStatus.LEARNING) {
        nextUnderstanding = UnderstandingLevel.READ;
        nextReview = SmartReviewState.LEARNING;
      }

      onUpdateProgress(currentDomain.id, currentTopic.id, {
        status: validStatus,
        understandingLevel: nextUnderstanding,
        reviewState: nextReview,
        isDifficult: validStatus === MasteryStatus.NEEDS_REVIEW,
        selfExplanationNote: reflectionText.trim(),
        lastEvaluation: result,
      });

      onRecordCompletedExercise(
        currentDomain.id,
        `Hoàn thành thực hành bài "${currentTopic.title}" (Mức đạt: ${validStatus})`
      );
    } catch (err) {
      setEvalError(err instanceof Error ? err.message : 'Lỗi khi đánh giá bài thực hành.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRequestRemedial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingRemedial(true);
    try {
      const support = await generateRemedialSupport({
        domainTitle: currentDomain.title,
        topicTitle: currentTopic.title,
        confusionNote: confusionInput.trim() || undefined,
      });
      setRemedialData(support);
      onUpdateProgress(currentDomain.id, currentTopic.id, {
        status: MasteryStatus.NEEDS_REVIEW,
        reviewState: SmartReviewState.REVIEW,
        isDifficult: true,
        remedialSupport: support,
      });
      onRecordDifficultTopic(currentDomain.id, currentTopic.title);
      setShowRemedialForm(false);
    } catch (err) {
      setEvalError(
        err instanceof Error ? err.message : 'Không thể tạo ví dụ đơn giản hơn lúc này.'
      );
    } finally {
      setIsGeneratingRemedial(false);
    }
  };

  const openingQuestionText =
    currentLesson?.openingQuestion || currentTopic.guidingQuestion;

  return (
    <div className="space-y-6">
      {/* Top Lesson Navigation & Progress Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToLearningPath}
            className="min-h-[40px] inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Lộ trình 5 Cấp độ</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono font-semibold text-teal-800 tabular-nums">
              {pathMeta.code} — {pathMeta.nameEn}
            </span>
            <span aria-hidden="true">·</span>
            <span>Ôn tập: {currentReviewState}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-100 items-end">
          <div className="md:col-span-3 space-y-1">
            <label htmlFor="lw-domain" className="block text-[11px] font-medium text-slate-500">
              Lĩnh vực
            </label>
            <select
              id="lw-domain"
              value={currentDomain.id}
              onChange={(e) => {
                const nextDomain =
                  LEARNING_DOMAINS.find((d) => d.id === e.target.value) || LEARNING_DOMAINS[0];
                onChangeTopic(nextDomain.id, nextDomain.topics[0].id);
              }}
              className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-teal-700 focus:outline-none"
            >
              {LEARNING_DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.indexLabel}. {d.shortTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5 space-y-1">
            <label htmlFor="lw-topic" className="block text-[11px] font-medium text-slate-500">
              Chuyên đề (Bài học 8 phần)
            </label>
            <select
              id="lw-topic"
              value={currentTopic.id}
              onChange={(e) => onChangeTopic(currentDomain.id, e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-teal-700 focus:outline-none"
            >
              {currentDomain.topics.map((t, idx) => (
                <option key={t.id} value={t.id}>
                  L{t.pathLevel}.{idx + 1} — {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex flex-wrap sm:flex-nowrap items-center gap-2">
            <div className="flex-1 space-y-1">
              <label htmlFor="lw-ulevel" className="block text-[11px] font-medium text-slate-500">
                Mức độ hiểu (5 mức)
              </label>
              <select
                id="lw-ulevel"
                value={currentUnderstanding}
                onChange={(e) => {
                  const nextLvl = Number(e.target.value) as UnderstandingLevel;
                  const mappedStatus = understandingToMasteryStatus(nextLvl);
                  onUpdateProgress(currentDomain.id, currentTopic.id, {
                    understandingLevel: nextLvl,
                    status: mappedStatus,
                    reviewState:
                      nextLvl === UnderstandingLevel.CAN_APPLY
                        ? SmartReviewState.MASTERED
                        : nextLvl >= UnderstandingLevel.BASIC
                        ? SmartReviewState.PRACTICING
                        : SmartReviewState.LEARNING,
                  });
                }}
                className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-teal-900 focus:border-teal-700 focus:outline-none"
              >
                {([1, 2, 3, 4, 5] as UnderstandingLevel[]).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {UNDERSTANDING_LEVEL_LABELS[lvl].label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={isLoadingLesson}
              onClick={() => fetchLesson(true)}
              title="Biên soạn lại bài học với ví dụ mới"
              className="min-h-[44px] mt-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLesson ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 8-Part Lesson Content */}
      {isLoadingLesson ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-sm font-semibold text-teal-800">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>AI đang biên soạn bài học 8 phần từ nguyên lý gốc rễ...</span>
          </div>
          <div className="space-y-4 animate-pulse">
            <div className="h-7 bg-slate-200 rounded w-3/4" />
            <div className="h-20 bg-slate-100 rounded-xl w-full" />
            <div className="h-32 bg-slate-100 rounded-xl w-full" />
            <div className="h-32 bg-slate-100 rounded-xl w-full" />
          </div>
        </div>
      ) : lessonError ? (
        <div className="bg-white border border-red-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-red-900">Chưa thể tải bài học</h3>
          <p className="text-sm text-red-700">{lessonError}</p>
          <button
            type="button"
            onClick={() => fetchLesson(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Thử biên soạn lại
          </button>
        </div>
      ) : currentLesson ? (
        <article className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200 max-w-4xl mx-auto">
          {/* Header & Smart Actions */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>{currentLesson.domainName}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  ~{currentLesson.estimatedMinutes} phút học sâu
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveRecallHidden((prev) => !prev)}
                  className="min-h-[38px] inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 cursor-pointer"
                >
                  {activeRecallHidden ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Hiện lại lý thuyết</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ẩn bài luyện Nhớ lại (Active Recall)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onOpenAIMentorWithContext(
                      currentDomain.id,
                      `Tôi đang học bài "${currentLesson.title}". Hãy đóng vai Socratic Mentor đặt câu hỏi kiểm tra xem tôi đã hiểu bản chất chưa.`,
                      MentorMode.SOCRATIC
                    )
                  }
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Trao đổi cùng AI Mentor</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight [text-wrap:balance]">
              {currentLesson.title}
            </h1>

            <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 leading-relaxed">
              <span className="font-semibold text-slate-900">Phân định sự thật &amp; quan điểm: </span>
              {currentLesson.epistemicNote}
            </p>
          </div>

          {/* PART 1: Opening Question */}
          <div className="p-6 sm:p-8 bg-slate-50/60 space-y-2">
            <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
              01. Câu hỏi mở đầu
            </div>
            <p className="text-base sm:text-lg font-editorial italic text-slate-900 leading-relaxed">
              “{openingQuestionText}”
            </p>
            <p className="text-xs text-slate-500">
              Hãy dừng lại 15 giây thử tự trả lời câu hỏi này trước khi đọc tiếp phần giải thích bên dưới.
            </p>
          </div>

          {!activeRecallHidden && (
            <>
              {/* PART 2: Core Concept & Simple Terminology */}
              <div className="p-6 sm:p-8 space-y-5">
                <div className="space-y-2.5">
                  <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
                    02. Khái niệm cốt lõi
                  </div>
                  <RichTextRenderer text={currentLesson.part1Intro} />
                </div>

                {currentLesson.terminology.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-semibold text-slate-800">
                      Thuật ngữ nền tảng cần nắm:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentLesson.terminology.map((term, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-1.5"
                        >
                          <div className="text-sm font-bold text-slate-900">
                            {term.termVi}{' '}
                            <span className="text-xs font-mono font-normal text-teal-800">
                              ({term.termEn})
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {term.simpleExplanation}
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Ví dụ: {term.realWorldExample}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* PART 3: Deep Dive (Mechanism & Connections) */}
              <div className="p-6 sm:p-8 space-y-2.5">
                <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
                  03. Đào sâu nguyên nhân, cơ chế &amp; mối liên hệ
                </div>
                <RichTextRenderer text={currentLesson.part2Essence} />
              </div>

              {/* PART 4: Real-World Examples */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
                  04. Ví dụ thực tế (Cuộc sống · Công việc · Kinh doanh · Xã hội · Lịch sử)
                </div>
                <div className="space-y-4">
                  {currentLesson.part3Examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="space-y-1 pb-4 last:pb-0 border-b last:border-b-0 border-slate-100"
                    >
                      <div className="text-xs font-semibold text-slate-900">
                        Bối cảnh: {ex.context}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{ex.scenario}</p>
                      <p className="text-xs text-teal-900 leading-relaxed pt-0.5">
                        <span className="font-semibold">Bài học cơ chế: </span>
                        {ex.insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PART 5: Opposing Perspectives */}
              <div className="p-6 sm:p-8 space-y-3">
                <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
                  05. Góc nhìn đối lập &amp; Tranh luận đa chiều
                </div>
                <ul className="space-y-2.5 text-sm text-slate-700 list-disc pl-5 leading-relaxed">
                  {currentLesson.part4CounterPerspectives.map((cp, idx) => (
                    <li key={idx}>{cp}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Smart Review Adaptive Helper (If user struggles!) */}
          <div className="p-6 sm:p-8 bg-slate-50/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-slate-900">
                  Hệ thống Ôn tập Thông minh (Smart Review)
                </div>
                <p className="text-xs text-slate-600">
                  Nếu bạn thấy khái niệm này còn trừu tượng hoặc khó áp dụng, hãy đánh dấu cần ôn lại để AI tạo ví dụ đời thường và bài tập bước đệm đơn giản hơn.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRemedialForm((v) => !v)}
                className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-xs font-semibold text-amber-950 hover:bg-amber-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LifeBuoy className="w-4 h-4" />
                <span>Tôi gặp khó khăn · Gợi ý dễ hiểu hơn</span>
              </button>
            </div>

            {showRemedialForm && (
              <form onSubmit={handleRequestRemedial} className="space-y-3 pt-2">
                <input
                  type="text"
                  value={confusionInput}
                  onChange={(e) => setConfusionInput(e.target.value)}
                  placeholder="Tùy chọn: Điểm nào đang làm bạn bối rối nhất? (Bỏ trống nếu muốn giải thích lại toàn bộ)"
                  className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isGeneratingRemedial}
                  className="min-h-[42px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingRemedial ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang thiết kế ví dụ đơn giản hơn...</span>
                    </>
                  ) : (
                    <span>Đánh dấu REVIEW &amp; Xem giải thích đơn giản</span>
                  )}
                </button>
              </form>
            )}

            {remedialData && (
              <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3">
                <div className="text-xs font-semibold text-amber-900">
                  Hỗ trợ Ôn tập Thích ứng (Đã thêm vào danh sách REVIEW)
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Hiểu thật giản dị: </strong>
                  {remedialData.simplerExplanation}
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Ví dụ gần gũi mới: </strong>
                  {remedialData.freshEverydayExample}
                </p>
                <p className="text-xs text-teal-900 bg-teal-900/5 rounded-lg p-3 leading-relaxed">
                  <strong>Bài tập nhỏ khởi động: </strong>
                  {remedialData.steppingStoneExercise}
                </p>
                <p className="text-xs italic text-slate-500">{remedialData.encouragementNote}</p>
              </div>
            )}
          </div>

          {/* PART 6: Thinking Questions */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
              06. Câu hỏi suy nghĩ (2 – 5 câu hỏi rèn suy luận độc lập)
            </div>
            <div className="space-y-3">
              {currentLesson.part5SocraticQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <p className="text-sm text-slate-800 leading-relaxed">
                    <HelpCircle className="w-4 h-4 text-teal-700 inline mr-2 -mt-0.5" />
                    {q}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenAIMentorWithContext(
                        currentDomain.id,
                        `Về câu hỏi suy nghĩ "${q}" trong bài "${currentLesson.title}", hãy dùng chế độ Socratic hoặc Phản biện trao đổi cùng tôi.`,
                        MentorMode.CRITIQUE
                      )
                    }
                    className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-900 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Phản biện cùng AI</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PART 7: Practical Action Exercise & Understanding Check */}
          <div className="p-6 sm:p-8 space-y-5">
            <div className="space-y-1.5">
              <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
                07. Bài tập thực hành &amp; Kiểm chứng độ hiểu thực chất
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {currentLesson.part6ActionExercise.title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {currentLesson.part6ActionExercise.instructions}
              </p>
            </div>

            <form onSubmit={handleEvaluateReflection} className="space-y-4">
              <textarea
                rows={5}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Viết câu trả lời tự giải thích bằng lời của bạn và cách bạn áp dụng vào thực tế. Lưu ý: Hệ thống chỉ nâng cấp trạng thái lên 'Có thể giải thích' / 'MASTERED' khi bạn thực sự diễn đạt và vận dụng được..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
              />

              {evalError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
                  {evalError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Chu trình: Học → Nhớ lại → Áp dụng → Phản tư → Ôn tập
                </span>
                <button
                  type="submit"
                  disabled={isEvaluating || !reflectionText.trim()}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang đánh giá năng lực...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Nộp bài thực hành &amp; Tự giải thích</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {evaluation && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div className="text-sm font-bold text-slate-900">
                    Đánh giá 4 Chiều từ AI Mentor
                  </div>
                  <div className="text-xs font-semibold text-teal-800">
                    Kết quả: {evaluation.recommendedStatus}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{evaluation.rationale}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">1. Giải thích</div>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      {evaluation.explanationFeedback}
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">2. Phân tích</div>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      {evaluation.analysisFeedback}
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">3. Phản biện</div>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      {evaluation.critiqueFeedback}
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">4. Áp dụng</div>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      {evaluation.applicationFeedback}
                    </p>
                  </div>
                </div>
                <p className="text-xs italic text-slate-800 pt-2 border-t border-slate-200">
                  Câu hỏi mở rộng: “{evaluation.followUpSocraticQuestion}”
                </p>
              </div>
            )}
          </div>

          {/* PART 8: Summary */}
          <div className="p-6 sm:p-8 bg-slate-50/70 rounded-b-2xl space-y-4">
            <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
              08. Tóm tắt bài học
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-900">Điều quan trọng nhất:</div>
              <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5 leading-relaxed">
                {currentLesson.part7Summary.keyTakeaways.map((kt, idx) => (
                  <li key={idx}>{kt}</li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs">
              <div>
                <div className="font-semibold text-slate-900">Điều cần suy nghĩ thêm:</div>
                <p className="text-slate-600 leading-relaxed mt-1">
                  {currentLesson.part7Summary.foodForThought}
                </p>
              </div>
              <div>
                <div className="font-semibold text-teal-900">Một hành động cụ thể:</div>
                <p className="text-teal-950 leading-relaxed mt-1">
                  {currentLesson.part7Summary.concreteAction}
                </p>
              </div>
            </div>
          </div>
        </article>
      ) : null}
    </div>
  );
}
