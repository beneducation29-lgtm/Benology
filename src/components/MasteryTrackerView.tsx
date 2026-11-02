import React, { useMemo, useState } from 'react';
import { ArrowUpRight, CheckSquare, RotateCcw, Search, Square } from 'lucide-react';
import {
  LEARNING_DOMAINS,
  MASTERY_DESCRIPTIONS,
  MASTERY_STATUS_ORDER,
} from '../data/curriculum';
import { MasteryStatus, TopicProgressRecord } from '../types/mentor';

interface MasteryTrackerViewProps {
  progressMap: Record<string, TopicProgressRecord>;
  onStartTopic: (domainId: string, topicId: string) => void;
  onUpdateStatus: (domainId: string, topicId: string, status: MasteryStatus) => void;
}

const AUTONOMY_HABITS = [
  'Trước khi hỏi AI một câu hỏi khó, tôi đã tự viết ra ít nhất 2 giả thuyết hoặc suy nghĩ riêng của mình.',
  'Khi đọc một con số hoặc nghiên cứu, tôi tự hỏi nguồn gốc dữ liệu đến từ đâu và cỡ mẫu/bối cảnh là gì.',
  'Tôi có thể đóng tài liệu lại và giải thích khái niệm vừa học cho một người ngoài ngành hiểu rõ.',
  'Tôi chủ động tìm kiếm lập luận của những người thông minh có quan điểm trái ngược với niềm tin của tôi.',
  'Tôi phân biệt rõ đâu là Sự thật thực nghiệm, đâu là Giả thuyết và đâu là Quan điểm cá nhân.',
];

export function MasteryTrackerView({
  progressMap,
  onStartTopic,
  onUpdateStatus,
}: MasteryTrackerViewProps) {
  const [statusFilter, setStatusFilter] = useState<'ALL' | MasteryStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedAutonomy, setCheckedAutonomy] = useState<Record<number, boolean>>({
    0: true,
    4: true,
  });

  const allTopics = useMemo(() => {
    return LEARNING_DOMAINS.flatMap((domain) =>
      domain.topics.map((topic) => {
        const record = progressMap[topic.id];
        return {
          domain,
          topic,
          status: record?.status || MasteryStatus.NOT_STARTED,
          lastStudiedAt: record?.lastStudiedAt,
          note: record?.selfExplanationNote,
        };
      })
    );
  }, [progressMap]);

  const countsByStatus = useMemo(() => {
    const map: Record<MasteryStatus, number> = {
      [MasteryStatus.NOT_STARTED]: 0,
      [MasteryStatus.LEARNING]: 0,
      [MasteryStatus.BASIC_UNDERSTANDING]: 0,
      [MasteryStatus.CAN_EXPLAIN]: 0,
      [MasteryStatus.CAN_APPLY]: 0,
      [MasteryStatus.NEEDS_REVIEW]: 0,
    };
    for (const item of allTopics) {
      map[item.status] += 1;
    }
    return map;
  }, [allTopics]);

  const filteredTopics = useMemo(() => {
    return allTopics.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.topic.title.toLowerCase().includes(q) ||
          item.domain.title.toLowerCase().includes(q) ||
          (item.note && item.note.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allTopics, statusFilter, searchQuery]);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Hồ sơ Năng lực Tự học</span>
          <span aria-hidden="true">·</span>
          <span>6 cấp độ làm chủ nhận thức</span>
          <span aria-hidden="true">·</span>
          <span>Đánh giá qua giải thích &amp; vận dụng</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 [text-wrap:balance]">
          Theo dõi Tiến trình Học tập Cá nhân hóa
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Hệ thống không đo lường sự tiến bộ bằng số trang bạn đã đọc lướt qua, mà bằng khả năng tự giải thích, phân tích, phản biện và vận dụng vào tình huống mới.
        </p>
      </div>

      {/* 6 Status Summary Strip */}
      <section className="bg-white border border-slate-200 rounded-2xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {MASTERY_STATUS_ORDER.map((status) => {
          const isSelected = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(isSelected ? 'ALL' : status)}
              className={`p-5 text-left transition-colors cursor-pointer ${
                isSelected ? 'bg-teal-900/5' : 'hover:bg-slate-50'
              }`}
            >
              <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                {countsByStatus[status]}
              </div>
              <div className="text-xs font-semibold text-slate-800 mt-1">{status}</div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                {MASTERY_DESCRIPTIONS[status].shortDesc}
              </p>
            </button>
          );
        })}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Table / List of Topics */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm chuyên đề, lĩnh vực hoặc ghi chú Feynman..."
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              {statusFilter !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Xem tất cả ({allTopics.length})</span>
                </button>
              )}
            </div>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="text-sm font-semibold text-slate-900">
                Chưa có chuyên đề nào khớp với bộ lọc hiện tại
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Hãy chuyển bộ lọc về Tất cả hoặc bắt đầu thực hành giải thích một bài học mới trong Phòng học 7 phần.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Hiển thị toàn bộ chuyên đề
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredTopics.map(({ domain, topic, status, note, lastStudiedAt }) => (
                <div
                  key={topic.id}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono tabular-nums">{domain.indexLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{domain.shortTitle}</span>
                      {lastStudiedAt && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            Cập nhật {new Date(lastStudiedAt).toLocaleDateString('vi-VN')}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{topic.title}</div>
                    {note && (
                      <p className="text-xs text-slate-600 line-clamp-2 pt-0.5">
                        <span className="font-medium text-slate-800">Ghi chú tự giải thích: </span>
                        {note}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <select
                      aria-label={`Trạng thái của ${topic.title}`}
                      value={status}
                      onChange={(e) =>
                        onUpdateStatus(domain.id, topic.id, e.target.value as MasteryStatus)
                      }
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-teal-700 focus:outline-none"
                    >
                      {MASTERY_STATUS_ORDER.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => onStartTopic(domain.id, topic.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Mở bài</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Self-Learning Autonomy Checklist (Domain 10) */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="space-y-1">
            <div className="text-xs text-slate-500">Kỹ luật Tự chủ Tư duy</div>
            <h2 className="text-lg font-bold text-slate-900">
              5 Thói quen Chống Phụ thuộc vào AI
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Đánh dấu tự kiểm điểm sau mỗi tuần học để đảm bảo năng lực suy nghĩ độc lập của bạn ngày càng sắc bén hơn.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200">
            {AUTONOMY_HABITS.map((habit, idx) => {
              const checked = !!checkedAutonomy[idx];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setCheckedAutonomy((prev) => ({ ...prev, [idx]: !prev[idx] }))
                  }
                  className="w-full text-left flex items-start gap-2.5 group cursor-pointer"
                >
                  {checked ? (
                    <CheckSquare className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 mt-0.5" />
                  )}
                  <span
                    className={`text-xs leading-relaxed ${
                      checked ? 'text-slate-900 font-medium' : 'text-slate-600'
                    }`}
                  >
                    {habit}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
            <div className="font-semibold text-slate-900">Chu trình 4 kỹ thuật ghi nhớ sâu:</div>
            <p className="leading-relaxed">
              1. <strong className="text-slate-800">Active Recall</strong> (Tự truy xuất không nhìn tài liệu) · 2. <strong className="text-slate-800">Feynman</strong> (Diễn đạt giản dị) · 3. <strong className="text-slate-800">Spaced Repetition</strong> (Ôn ngắt quãng các mục Cần ôn lại) · 4. <strong className="text-slate-800">Interleaving</strong> (Đan xen liên ngành).
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
