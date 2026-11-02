import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Edit3,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  LEARNING_DOMAINS,
  SMART_REVIEW_LABELS,
  UNDERSTANDING_LEVEL_LABELS,
} from '../data/curriculum';
import {
  GoalsState,
  LearningMemoryItem,
  MemoryCategory,
  SmartReviewState,
  TopicProgressRecord,
  UnderstandingLevel,
} from '../types/mentor';
import { understandingToMasteryStatus } from '../services/storageLayer';

interface PersonalProgressViewProps {
  goals: GoalsState;
  progressMap: Record<string, TopicProgressRecord>;
  onOpenLesson: (domainId: string, topicId: string) => void;
  onUpdateProgress: (
    domainId: string,
    topicId: string,
    updates: Partial<TopicProgressRecord>
  ) => void;
  memoryItems: LearningMemoryItem[];
  memoryEnabled: boolean;
  onToggleMemoryEnabled: (enabled: boolean) => void;
  onAddMemoryItem: (category: MemoryCategory, content: string) => void;
  onEditMemoryItem: (id: string, content: string) => void;
  onDeleteMemoryItem: (id: string) => void;
  onClearAllMemory: () => void;
}

const REVIEW_ORDER: SmartReviewState[] = [
  SmartReviewState.REVIEW,
  SmartReviewState.PRACTICING,
  SmartReviewState.LEARNING,
  SmartReviewState.MASTERED,
  SmartReviewState.NEW,
];

const MEMORY_CATEGORY_LABELS: Record<MemoryCategory, string> = {
  learning_goal: 'Mục tiêu học tập',
  question_asked: 'Câu hỏi từng đặt',
  difficult_topic: 'Chủ đề gặp khó khăn',
  completed_exercise: 'Bài tập đã hoàn thành',
};

export function PersonalProgressView({
  goals,
  progressMap,
  onOpenLesson,
  onUpdateProgress,
  memoryItems,
  memoryEnabled,
  onToggleMemoryEnabled,
  onAddMemoryItem,
  onEditMemoryItem,
  onDeleteMemoryItem,
  onClearAllMemory,
}: PersonalProgressViewProps) {
  const [reviewFilter, setReviewFilter] = useState<'ALL' | SmartReviewState>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Learning Memory Editor State
  const [newMemCat, setNewMemCat] = useState<MemoryCategory>('learning_goal');
  const [newMemContent, setNewMemContent] = useState('');
  const [editingMemId, setEditingMemId] = useState<string | null>(null);
  const [editingMemText, setEditingMemText] = useState('');
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const allTopics = useMemo(() => {
    return LEARNING_DOMAINS.flatMap((domain) =>
      domain.topics.map((topic) => {
        const rec = progressMap[topic.id];
        return {
          domain,
          topic,
          understandingLevel: rec?.understandingLevel || UnderstandingLevel.UNKNOWN,
          reviewState: rec?.reviewState || SmartReviewState.NEW,
          note: rec?.selfExplanationNote,
          lastStudiedAt: rec?.lastStudiedAt,
        };
      })
    );
  }, [progressMap]);

  const activityTotals = useMemo(() => {
    const totalMinutes = Object.values(goals.dailyLogs).reduce(
      (sum, d) => sum + (d.minutes || 0),
      0
    );
    const touchedTopics = allTopics.filter(
      (t) => t.understandingLevel >= UnderstandingLevel.READ
    ).length;
    const completedLessons = allTopics.filter(
      (t) => t.understandingLevel >= UnderstandingLevel.BASIC
    ).length;
    return { totalMinutes, touchedTopics, completedLessons };
  }, [goals.dailyLogs, allTopics]);

  const understandingCounts = useMemo(() => {
    const counts: Record<UnderstandingLevel, number> = {
      [UnderstandingLevel.UNKNOWN]: 0,
      [UnderstandingLevel.READ]: 0,
      [UnderstandingLevel.BASIC]: 0,
      [UnderstandingLevel.CAN_EXPLAIN]: 0,
      [UnderstandingLevel.CAN_APPLY]: 0,
    };
    for (const t of allTopics) {
      counts[t.understandingLevel] += 1;
    }
    return counts;
  }, [allTopics]);

  const reviewCounts = useMemo(() => {
    const counts: Record<SmartReviewState, number> = {
      [SmartReviewState.NEW]: 0,
      [SmartReviewState.LEARNING]: 0,
      [SmartReviewState.PRACTICING]: 0,
      [SmartReviewState.REVIEW]: 0,
      [SmartReviewState.MASTERED]: 0,
    };
    for (const t of allTopics) {
      counts[t.reviewState] += 1;
    }
    return counts;
  }, [allTopics]);

  const filteredTopics = useMemo(() => {
    return allTopics.filter((item) => {
      if (reviewFilter !== 'ALL' && item.reviewState !== reviewFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.topic.title.toLowerCase().includes(q) ||
          item.domain.shortTitle.toLowerCase().includes(q) ||
          (item.note && item.note.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allTopics, reviewFilter, searchQuery]);

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemContent.trim()) return;
    onAddMemoryItem(newMemCat, newMemContent.trim());
    setNewMemContent('');
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Hồ sơ Phát triển &amp; Ôn tập Thông minh</span>
          <span aria-hidden="true">·</span>
          <span>5 mức hiểu sâu · 5 trạng thái ôn tập · Bộ nhớ AI minh bạch</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Hồ Sơ Tiến Độ, Hệ Thống Ôn Tập &amp; AI Learning Memory
        </h1>
      </div>

      {/* Section 1: Learning Activity + 5-Level Understanding */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="text-sm font-bold text-slate-900">
            Hoạt động Học tập Tích lũy
          </div>
          <div className="grid grid-cols-3 gap-4 pt-1">
            <div>
              <div className="text-xs text-slate-500">Thời gian</div>
              <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums mt-1">
                {activityTotals.totalMinutes}p
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Chủ đề đã mở</div>
              <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums mt-1">
                {activityTotals.touchedTopics}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Hiểu cơ bản+</div>
              <div className="text-2xl font-mono font-bold text-teal-800 tabular-nums mt-1">
                {activityTotals.completedLessons}
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed pt-3 border-t border-slate-100">
            Không sử dụng điểm số đơn điệu làm thước đo duy nhất. Tiến bộ thực sự nằm ở khả năng tự giải thích và áp dụng vào thực tế.
          </p>
        </div>

        {/* 5 Levels of Understanding */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="text-sm font-bold text-slate-900">
            Thang Đánh giá Độ hiểu Sâu (5 Mức độ)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {([1, 2, 3, 4, 5] as UnderstandingLevel[]).map((lvl) => {
              const info = UNDERSTANDING_LEVEL_LABELS[lvl];
              return (
                <div
                  key={lvl}
                  className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-1"
                >
                  <div className="text-xl font-mono font-bold text-slate-900 tabular-nums">
                    {understandingCounts[lvl]}
                  </div>
                  <div className="text-xs font-semibold text-slate-800">{info.label}</div>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {info.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Smart Review System + AI Learning Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Smart Review Queue */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Hệ thống Ôn tập Thông minh (Smart Review)
                </h2>
                <p className="text-xs text-slate-500">
                  Nguyên tắc: Học → Nhớ lại → Áp dụng → Phản tư → Ôn tập
                </p>
              </div>
              {reviewFilter !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setReviewFilter('ALL')}
                  className="min-h-[36px] inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tất cả ({allTopics.length})</span>
                </button>
              )}
            </div>

            {/* 5 Review States Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {REVIEW_ORDER.map((st) => {
                const active = reviewFilter === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setReviewFilter(active ? 'ALL' : st)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st} ({reviewCounts[st]})
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm chủ đề hoặc ghi chú thực hành..."
                className="min-h-[42px] w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
            {filteredTopics.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Không có chủ đề nào trong trạng thái lọc hiện tại.
              </div>
            ) : (
              filteredTopics.map(({ domain, topic, understandingLevel, reviewState }) => (
                <div
                  key={topic.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs text-slate-500">
                      {domain.shortTitle} · {SMART_REVIEW_LABELS[reviewState].labelVi}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 leading-snug">
                      {topic.title}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      aria-label={`Mức độ hiểu ${topic.title}`}
                      value={understandingLevel}
                      onChange={(e) => {
                        const nextLvl = Number(e.target.value) as UnderstandingLevel;
                        onUpdateProgress(domain.id, topic.id, {
                          understandingLevel: nextLvl,
                          status: understandingToMasteryStatus(nextLvl),
                          reviewState:
                            nextLvl === UnderstandingLevel.CAN_APPLY
                              ? SmartReviewState.MASTERED
                              : nextLvl >= UnderstandingLevel.BASIC
                              ? SmartReviewState.PRACTICING
                              : nextLvl === UnderstandingLevel.READ
                              ? SmartReviewState.LEARNING
                              : SmartReviewState.NEW,
                        });
                      }}
                      className="min-h-[40px] rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-teal-700 focus:outline-none"
                    >
                      {([1, 2, 3, 4, 5] as UnderstandingLevel[]).map((l) => (
                        <option key={l} value={l}>
                          {UNDERSTANDING_LEVEL_LABELS[l].label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => onOpenLesson(domain.id, topic.id)}
                      className="min-h-[40px] inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>{reviewState === SmartReviewState.REVIEW ? 'Ôn lại' : 'Mở bài'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right 5 Cols: AI Learning Memory (View / Edit / Delete) */}
        <aside className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900">AI Learning Memory</h2>
              {memoryItems.length > 0 && (
                <div>
                  {confirmClearAll ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClearAllMemory();
                          setConfirmClearAll(false);
                        }}
                        className="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
                      >
                        Xác nhận xóa hết
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmClearAll(false)}
                        className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmClearAll(true)}
                      className="text-xs text-slate-500 hover:text-red-700 cursor-pointer"
                    >
                      Xóa toàn bộ
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bộ nhớ giúp AI Mentor hiểu mục tiêu, câu hỏi bạn từng đặt và chủ đề bạn đang cần ôn tập. Không lưu thông tin nhạy cảm ngoài ý muốn; bạn có toàn quyền xem, sửa hoặc xóa.
            </p>
          </div>

          {/* Privacy Toggle */}
          <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <span className="text-xs font-medium text-slate-800">
              Tự động ghi nhớ câu hỏi &amp; bài tập học tập mới
            </span>
            <input
              type="checkbox"
              checked={memoryEnabled}
              onChange={(e) => onToggleMemoryEnabled(e.target.checked)}
              className="w-4 h-4 accent-teal-700 cursor-pointer"
            />
          </label>

          {/* Add Custom Memory Item */}
          <form onSubmit={handleCreateMemory} className="space-y-2.5 pt-2 border-t border-slate-200">
            <div className="text-xs font-semibold text-slate-800">
              Chủ động thêm ghi nhớ cho AI Mentor:
            </div>
            <div className="flex gap-2">
              <select
                value={newMemCat}
                onChange={(e) => setNewMemCat(e.target.value as MemoryCategory)}
                className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-teal-700 focus:outline-none"
              >
                {(Object.keys(MEMORY_CATEGORY_LABELS) as MemoryCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {MEMORY_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newMemContent}
                onChange={(e) => setNewMemContent(e.target.value)}
                placeholder="Nhập nội dung muốn AI ghi nhớ..."
                className="min-h-[40px] flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-teal-700 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Thêm ghi nhớ"
                className="min-h-[40px] px-3 rounded-lg bg-teal-700 text-white hover:bg-teal-800 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Memory Items List */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pt-2">
            {memoryItems.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">
                Bộ nhớ học tập hiện đang trống.
              </p>
            ) : (
              memoryItems.map((item) => {
                const isEditing = editingMemId === item.id;
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-teal-800">
                        {MEMORY_CATEGORY_LABELS[item.category]}
                      </span>
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                if (editingMemText.trim()) {
                                  onEditMemoryItem(item.id, editingMemText.trim());
                                }
                                setEditingMemId(null);
                              }}
                              aria-label="Lưu chỉnh sửa"
                              className="p-1 text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingMemId(null)}
                              aria-label="Hủy"
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMemId(item.id);
                                setEditingMemText(item.content);
                              }}
                              aria-label="Sửa mục nhớ"
                              className="p-1 text-slate-400 hover:text-slate-900 rounded cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteMemoryItem(item.id)}
                              aria-label="Xóa mục nhớ"
                              className="p-1 text-slate-400 hover:text-red-700 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <input
                        type="text"
                        value={editingMemText}
                        onChange={(e) => setEditingMemText(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-teal-700 focus:outline-none"
                      />
                    ) : (
                      <p className="text-xs text-slate-700 leading-relaxed">{item.content}</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
