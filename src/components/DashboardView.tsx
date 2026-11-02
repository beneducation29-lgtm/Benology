import React, { useState } from 'react';
import {
  ArrowRight,
  Brain,
  Check,
  Compass,
  Edit3,
  Landmark,
  MessageCircle,
  Plus,
  Puzzle,
  Receipt,
  Rocket,
  Search,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { LEARNING_DOMAINS } from '../data/curriculum';
import {
  GoalsState,
  PersonalizedRoadmap,
  SmartReviewState,
  TopicProgressRecord,
  UnderstandingLevel,
} from '../types/mentor';
import { computeStreakAndMissedDayInfo } from '../services/storageLayer';
import { OnboardingRoadmapView } from './OnboardingRoadmapView';

interface DashboardViewProps {
  goals: GoalsState;
  onUpdateGoals: (updater: (prev: GoalsState) => GoalsState) => void;
  onLogStudyMinutes: (minutesToAdd: number) => void;
  progressMap: Record<string, TopicProgressRecord>;
  roadmap: PersonalizedRoadmap | null;
  onSaveRoadmap: (roadmap: PersonalizedRoadmap) => void;
  onContinueTopic: (domainId: string, topicId: string) => void;
  onExploreDomain: (domainId: string) => void;
  onOpenAIMentor: (domainId?: string, prompt?: string) => void;
}

const DOMAIN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  philosophy: Brain,
  psychology: Puzzle,
  'human-nature': Users,
  'personal-finance': Wallet,
  persuasion: MessageCircle,
  taxation: Receipt,
  history: Landmark,
  economics: TrendingUp,
  'critical-thinking': Search,
  'self-learning': Rocket,
};

export function DashboardView({
  goals,
  onUpdateGoals,
  onLogStudyMinutes,
  progressMap,
  roadmap,
  onSaveRoadmap,
  onContinueTopic,
  onExploreDomain,
  onOpenAIMentor,
}: DashboardViewProps) {
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [draftDaily, setDraftDaily] = useState(goals.dailyGoalMinutes);
  const [draftWeekly, setDraftWeekly] = useState(goals.weeklyLessonsTarget);
  const [draftLongTerm, setDraftLongTerm] = useState(goals.longTermGoal);
  const [showRoadmapPlanner, setShowRoadmapPlanner] = useState(false);

  const stats = computeStreakAndMissedDayInfo(goals);

  // Active & Review topics
  const activeTopics = LEARNING_DOMAINS.flatMap((domain) =>
    domain.topics
      .map((topic) => ({
        domain,
        topic,
        record: progressMap[topic.id],
      }))
      .filter(
        (item) =>
          item.record &&
          (item.record.reviewState === SmartReviewState.REVIEW ||
            item.record.reviewState === SmartReviewState.LEARNING ||
            item.record.reviewState === SmartReviewState.PRACTICING)
      )
  ).slice(0, 4);

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoals((prev) => ({
      ...prev,
      dailyGoalMinutes: Math.max(5, Math.min(180, Number(draftDaily) || 20)),
      weeklyLessonsTarget: Math.max(1, Math.min(30, Number(draftWeekly) || 3)),
      longTermGoal: draftLongTerm.trim() || prev.longTermGoal,
    }));
    setIsEditingGoals(false);
  };

  const dailyPct = Math.min(
    100,
    Math.round((stats.todayMinutes / Math.max(1, goals.dailyGoalMinutes)) * 100)
  );
  const weeklyPct = Math.min(
    100,
    Math.round((stats.weekLessons / Math.max(1, goals.weeklyLessonsTarget)) * 100)
  );

  return (
    <div className="space-y-10">
      {/* Personal Greeting & Goal Overview */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Personal Growth AI</span>
              <span aria-hidden="true">·</span>
              <span>Học sâu hơn – Nghĩ độc lập – Sống tốt hơn</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight [text-wrap:balance]">
              Chào bạn! Hôm nay bạn muốn phát triển bản thân theo hướng nào?
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mục tiêu dài hạn hiện tại: <strong className="font-semibold text-slate-900">{goals.longTermGoal}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setDraftDaily(goals.dailyGoalMinutes);
                setDraftWeekly(goals.weeklyLessonsTarget);
                setDraftLongTerm(goals.longTermGoal);
                setIsEditingGoals((v) => !v);
              }}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Điều chỉnh mục tiêu</span>
            </button>
            <button
              type="button"
              onClick={() => setShowRoadmapPlanner((v) => !v)}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{showRoadmapPlanner ? 'Đóng thiết kế lộ trình' : 'Lộ trình AI cá nhân'}</span>
            </button>
          </div>
        </div>

        {/* Gentle non-pressuring reminder if missed yesterday */}
        {stats.missedYesterday && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            Bạn có thể tiếp tục từ hôm nay. Sự tiến bộ dài hạn quan trọng hơn một ngày bị bỏ lỡ.
          </div>
        )}

        {/* Inline Goal Editor */}
        {isEditingGoals && (
          <form
            onSubmit={handleSaveGoals}
            className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-4"
          >
            <div className="text-sm font-bold text-slate-900">
              Thiết lập Hệ thống Mục tiêu Học tập (Không tạo áp lực quá mức)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="goal-daily" className="block text-xs font-medium text-slate-700">
                  Mục tiêu mỗi ngày (phút/ngày)
                </label>
                <input
                  id="goal-daily"
                  type="number"
                  min={5}
                  max={180}
                  value={draftDaily}
                  onChange={(e) => setDraftDaily(Number(e.target.value))}
                  className="min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-teal-700 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="goal-weekly" className="block text-xs font-medium text-slate-700">
                  Mục tiêu hàng tuần (số bài học/tuần)
                </label>
                <input
                  id="goal-weekly"
                  type="number"
                  min={1}
                  max={30}
                  value={draftWeekly}
                  onChange={(e) => setDraftWeekly(Number(e.target.value))}
                  className="min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-teal-700 focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="goal-longterm" className="block text-xs font-medium text-slate-700">
                Mục tiêu dài hạn (3 – 12 tháng)
              </label>
              <input
                id="goal-longterm"
                type="text"
                value={draftLongTerm}
                onChange={(e) => setDraftLongTerm(e.target.value)}
                placeholder="Ví dụ: Xây dựng nền tảng kiến thức về kinh tế trong 6 tháng."
                className="min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingGoals(false)}
                className="min-h-[44px] px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="min-h-[44px] inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Lưu mục tiêu</span>
              </button>
            </div>
          </form>
        )}

        {/* 4 Activity & Streak Metrics + 7-Day Mini Chart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-200">
          {/* Today's Time */}
          <div className="space-y-2">
            <div className="text-xs text-slate-500">Thời gian học hôm nay</div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                {stats.todayMinutes}{' '}
                <span className="text-xs font-normal text-slate-500">
                  / {goals.dailyGoalMinutes} phút
                </span>
              </span>
              <span className="text-xs font-mono text-teal-800 tabular-nums">{dailyPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-700 transition-transform origin-left"
                style={{ transform: `scaleX(${dailyPct / 100})` }}
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onLogStudyMinutes(10)}
                className="min-h-[36px] inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Ghi +10p tự học</span>
              </button>
              <button
                type="button"
                onClick={() => onLogStudyMinutes(20)}
                className="min-h-[36px] inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>+20p</span>
              </button>
            </div>
          </div>

          {/* Streak */}
          <div className="space-y-2">
            <div className="text-xs text-slate-500">Chuỗi ngày học liên tiếp</div>
            <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
              {stats.streakDays}{' '}
              <span className="text-xs font-normal text-slate-500">ngày bền bỉ</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Duy trì nhịp độ đều đặn giúp củng cố trí nhớ dài hạn tốt hơn học dồn.
            </p>
          </div>

          {/* Weekly Progress */}
          <div className="space-y-2">
            <div className="text-xs text-slate-500">Tiến độ trong tuần</div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                {stats.weekLessons}{' '}
                <span className="text-xs font-normal text-slate-500">
                  / {goals.weeklyLessonsTarget} bài
                </span>
              </span>
              <span className="text-xs font-mono text-slate-600 tabular-nums">
                {stats.weekMinutes} phút
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-800 transition-transform origin-left"
                style={{ transform: `scaleX(${weeklyPct / 100})` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              Chu trình: Học → Nhớ lại → Áp dụng → Phản tư → Ôn tập
            </p>
          </div>

          {/* Responsive 7-Day Activity Mini Chart */}
          <div className="space-y-2">
            <div className="text-xs text-slate-500">Nhịp học 7 ngày qua (phút)</div>
            <div className="h-16 flex items-end justify-between gap-1.5 pt-2">
              {stats.last7Days.map((day) => {
                const maxMins = Math.max(
                  goals.dailyGoalMinutes,
                  ...stats.last7Days.map((d) => d.minutes),
                  1
                );
                const heightPct = Math.max(8, Math.round((day.minutes / maxMins) * 100));
                return (
                  <div key={day.dateISO} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-10 bg-slate-100 rounded-sm flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-sm ${
                          day.minutes >= goals.dailyGoalMinutes
                            ? 'bg-teal-700'
                            : day.minutes > 0
                            ? 'bg-teal-600/60'
                            : 'bg-slate-200'
                        }`}
                        style={{ height: `${heightPct}%` }}
                        title={`${day.shortLabel}: ${day.minutes} phút`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                      {day.shortLabel.slice(0, 2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Topics Strip */}
        {activeTopics.length > 0 && (
          <div className="pt-6 border-t border-slate-200 space-y-3">
            <div className="text-xs font-semibold text-slate-900">
              Các chủ đề đang theo học &amp; ưu tiên ôn tập
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeTopics.map(({ domain, topic, record }) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onContinueTopic(domain.id, topic.id)}
                  className="min-h-[52px] text-left p-3.5 rounded-xl border border-slate-200 hover:border-teal-700 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-500 truncate">
                      {domain.shortTitle} · Trạng thái: {record.reviewState || 'LEARNING'}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                      {topic.title}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-700 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Collapsible Personalized AI Roadmap Planner (Preserved from Initial Turn) */}
      {showRoadmapPlanner && (
        <OnboardingRoadmapView
          roadmap={roadmap}
          onSaveRoadmap={(newRoadmap) => {
            onSaveRoadmap(newRoadmap);
            onUpdateGoals((prev) => ({
              ...prev,
              dailyGoalMinutes: newRoadmap.dailyMinutes,
              longTermGoal: newRoadmap.longTermGoal,
            }));
          }}
          onStartTopic={onContinueTopic}
          onOpenMentorChat={onOpenAIMentor}
        />
      )}

      {/* Map of 10 Learning Domains */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Bản đồ 10 Lĩnh vực Phát triển</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Mỗi lĩnh vực được thiết kế theo 5 cấp độ từ Nền tảng (Foundation) đến Tư duy Độc lập (Independent Thinking).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {LEARNING_DOMAINS.map((domain) => {
            const IconComponent = DOMAIN_ICONS[domain.id] || Brain;
            const totalCount = domain.topics.length;

            // Completed = Understanding Level >= 3 (Basic, Can Explain, Can Apply)
            const completedCount = domain.topics.filter((t) => {
              const rec = progressMap[t.id];
              return rec && (rec.understandingLevel || 1) >= UnderstandingLevel.BASIC;
            }).length;

            // Current active topic or first uncompleted topic
            const activeTopic =
              domain.topics.find((t) => {
                const rec = progressMap[t.id];
                return (
                  rec &&
                  (rec.reviewState === SmartReviewState.REVIEW ||
                    rec.reviewState === SmartReviewState.LEARNING ||
                    rec.reviewState === SmartReviewState.PRACTICING)
                );
              }) ||
              domain.topics.find((t) => {
                const rec = progressMap[t.id];
                return !rec || (rec.understandingLevel || 1) < UnderstandingLevel.CAN_APPLY;
              }) ||
              domain.topics[0];

            const progressPct = Math.round((completedCount / Math.max(1, totalCount)) * 100);

            return (
              <div
                key={domain.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-5 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {domain.indexLabel} · {completedCount}/{totalCount} bài
                    </span>
                  </div>

                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => onExploreDomain(domain.id)}
                      className="text-left text-base font-bold text-slate-900 hover:text-teal-800 transition-colors cursor-pointer"
                    >
                      {domain.shortTitle}
                    </button>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {domain.cardTagline}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Tiến độ hiểu sâu</span>
                      <span className="font-mono font-semibold text-slate-700 tabular-nums">
                        {progressPct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-700"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Topic */}
                  <div className="pt-2 border-t border-slate-100 space-y-0.5">
                    <div className="text-[11px] text-slate-400">Chủ đề tiếp theo:</div>
                    <div className="text-xs font-medium text-slate-800 line-clamp-2 leading-snug">
                      {activeTopic.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onContinueTopic(domain.id, activeTopic.id)}
                    className="min-h-[42px] w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Tiếp tục học</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
