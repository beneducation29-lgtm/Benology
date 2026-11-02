import React, { useState } from 'react';
import { CheckCircle2, Loader2, MessageSquare, RotateCcw } from 'lucide-react';
import { THINKING_DRILL_SCENARIOS } from '../data/curriculum';
import {
  MentorMode,
  ThinkingDrillFeedback,
  ThinkingDrillType,
} from '../types/mentor';
import { evaluateThinkingDrill } from '../services/mentorApi';
import { CriticalThinkingLabView } from './CriticalThinkingLabView';

interface ThinkingLabModuleViewProps {
  onSendToMentorChat: (domainId: string, prompt: string, mode?: MentorMode) => void;
  onRecordCompletedExercise: (domainId: string, summary: string) => void;
}

type LabTab = ThinkingDrillType | 'free_analyzer';

const DRILL_TABS: { id: LabTab; label: string }[] = [
  { id: 'argument', label: 'Phân tích lập luận' },
  { id: 'bias', label: 'Phát hiện thiên kiến' },
  { id: 'two_sides', label: 'Hai góc nhìn' },
  { id: 'source_check', label: 'Kiểm tra nguồn tin' },
  { id: 'free_analyzer', label: 'Tự kiểm định (6 Bước)' },
];

const DRILL_FIELDS: Record<
  ThinkingDrillType,
  { key: string; label: string; placeholder: string }[]
> = {
  argument: [
    {
      key: 'Kết luận',
      label: '1. Kết luận chính (Người nói đang muốn thuyết phục điều gì?)',
      placeholder: 'Xác định mệnh đề kết luận trung tâm...',
    },
    {
      key: 'Tiền đề',
      label: '2. Các tiền đề được nêu trực tiếp',
      placeholder: 'Liệt kê các lý do đang được dùng để đỡ cho kết luận...',
    },
    {
      key: 'Giả định ngầm',
      label: '3. Giả định ngầm chưa được chứng minh',
      placeholder: 'Điều gì đang được mặc định là đúng mà không nêu ra?',
    },
    {
      key: 'Bằng chứng & Điểm yếu',
      label: '4. Đánh giá bằng chứng hiện có',
      placeholder: 'Bằng chứng đã đủ đại diện chưa hay còn thiếu dữ liệu nào?',
    },
  ],
  bias: [
    {
      key: 'Thiên kiến xuất hiện',
      label: '1. Thiên kiến nhận thức nào đang xuất hiện trong tình huống?',
      placeholder: 'Ví dụ: Thiên kiến chi phí chìm, Thiên kiến xác nhận, Hiệu ứng đám đông...',
    },
    {
      key: 'Nguyên nhân tâm lý',
      label: '2. Vì sao thiên kiến đó lại xảy ra?',
      placeholder: 'Giải thích cơ chế cảm xúc hoặc nhận thức thúc đẩy hành vi đó...',
    },
    {
      key: 'Giải pháp giảm ảnh hưởng',
      label: '3. Làm thế nào để giảm ảnh hưởng của thiên kiến này trong thực tế?',
      placeholder: 'Đề xuất quy tắc ra quyết định hoặc câu hỏi kiểm tra khách quan...',
    },
  ],
  two_sides: [
    {
      key: 'Lập luận mạnh nhất Bên A',
      label: '1. Trình bày lập luận mạnh nhất, công bằng nhất của Bên A (Steelman A)',
      placeholder: 'Nếu đứng ở vị trí người hiểu biết nhất ủng hộ Bên A, họ sẽ lập luận thế nào?',
    },
    {
      key: 'Lập luận mạnh nhất Bên B',
      label: '2. Trình bày lập luận mạnh nhất, công bằng nhất của Bên B (Steelman B)',
      placeholder: 'Nếu đứng ở vị trí người hiểu biết nhất ủng hộ Bên B, họ sẽ lập luận thế nào?',
    },
    {
      key: 'Quan điểm cá nhân có điều kiện',
      label: '3. Đưa ra quan điểm tổng hợp của riêng bạn (nêu rõ điều kiện áp dụng)',
      placeholder: 'Dựa trên sự đánh đổi của cả hai phía, quan điểm của tôi là...',
    },
  ],
  source_check: [
    {
      key: 'Nguồn gốc',
      label: '1. Nguồn gốc thông tin',
      placeholder: 'Ai là người công bố? Có dẫn nguồn nghiên cứu/cơ quan gốc xác thực không?',
    },
    {
      key: 'Bằng chứng',
      label: '2. Chất lượng bằng chứng',
      placeholder: 'Số liệu có ngữ cảnh đầy đủ hay bị cắt cúp / phóng đại?',
    },
    {
      key: 'Động cơ của nguồn',
      label: '3. Động cơ lợi ích của nguồn phát',
      placeholder: 'Người đăng có lợi ích thương mại, bán hàng hay câu tương tác không?',
    },
    {
      key: 'Thông tin phản biện & Độ tin cậy',
      label: '4. Cần kiểm tra chéo thông tin phản biện nào & Kết luận độ tin cậy',
      placeholder: 'Cần tra cứu thêm ở đâu và bạn đánh giá mức độ tin cậy hiện tại thế nào?',
    },
  ],
};

export function ThinkingLabModuleView({
  onSendToMentorChat,
  onRecordCompletedExercise,
}: ThinkingLabModuleViewProps) {
  const [activeTab, setActiveTab] = useState<LabTab>('argument');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    THINKING_DRILL_SCENARIOS[0].id
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<ThinkingDrillFeedback | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scenariosForTab =
    activeTab === 'free_analyzer'
      ? []
      : THINKING_DRILL_SCENARIOS.filter((s) => s.type === activeTab);

  const activeScenario =
    scenariosForTab.find((s) => s.id === selectedScenarioId) || scenariosForTab[0];

  const handleSelectTab = (tab: LabTab) => {
    setActiveTab(tab);
    setFeedback(null);
    setError(null);
    setAnswers({});
    if (tab !== 'free_analyzer') {
      const first = THINKING_DRILL_SCENARIOS.find((s) => s.type === tab);
      if (first) setSelectedScenarioId(first.id);
    }
  };

  const handleSubmitDrill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeScenario || activeTab === 'free_analyzer') return;

    const filledCount = Object.values(answers).filter((v) => v && v.trim()).length;
    if (filledCount === 0) return;

    setIsEvaluating(true);
    setError(null);
    try {
      const result = await evaluateThinkingDrill({
        drillType: activeTab,
        scenarioTitle: activeScenario.title,
        promptText: activeScenario.promptText,
        userSubmission: answers,
      });
      setFeedback(result);
      onRecordCompletedExercise(
        'critical-thinking',
        `Hoàn thành bài tập Thinking Lab: "${activeScenario.title}"`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể chấm bài luyện tư duy.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Phòng Thí nghiệm Tư duy (Thinking Lab)</span>
          <span aria-hidden="true">·</span>
          <span>Rèn phản xạ kiểm chứng độc lập</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Luyện Tập Tư Duy Phản Biện &amp; Phân Tích Đa Chiều
        </h1>
      </div>

      {/* Sub-module Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl overflow-x-auto">
        {DRILL_TABS.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleSelectTab(t.id)}
              className={`min-h-[42px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'free_analyzer' ? (
        <CriticalThinkingLabView
          onSendToMentorChat={(domainId, prompt) =>
            onSendToMentorChat(domainId, prompt, MentorMode.CRITIQUE)
          }
        />
      ) : activeScenario ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Scenario Picker & Prompt */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700">
                Chọn tình huống luyện tập:
              </div>
              <div className="space-y-2">
                {scenariosForTab.map((sc) => {
                  const selected = sc.id === activeScenario.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        setSelectedScenarioId(sc.id);
                        setAnswers({});
                        setFeedback(null);
                      }}
                      className={`min-h-[48px] w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                        selected
                          ? 'border-teal-700 bg-teal-900/5 text-slate-900'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-[11px] text-slate-500">{sc.domainTag}</div>
                      <div className="text-sm font-semibold text-slate-900 mt-0.5">
                        {sc.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="text-xs font-semibold text-teal-800">
                Đề bài / Tình huống phân tích:
              </div>
              <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-4">
                {activeScenario.promptText}
              </p>

              {activeScenario.sideA && activeScenario.sideB && (
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="rounded-xl border border-slate-200 p-3 leading-relaxed">
                    {activeScenario.sideA}
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3 leading-relaxed">
                    {activeScenario.sideB}
                  </div>
                </div>
              )}

              {activeScenario.sourceMeta && (
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">Dữ kiện bối cảnh: </strong>
                  {activeScenario.sourceMeta}
                </p>
              )}
            </div>
          </div>

          {/* Right: Structured User Analysis Form & AI Feedback */}
          <div className="lg:col-span-7 space-y-6">
            <form
              onSubmit={handleSubmitDrill}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">
                  Phần tự phân tích của bạn
                </h2>
                <p className="text-xs text-slate-500">
                  Hãy tự suy nghĩ và điền lập luận của riêng bạn trước khi xem đối chiếu từ AI Mentor.
                </p>
              </div>

              {DRILL_FIELDS[activeTab].map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-900">
                    {field.label}
                  </label>
                  <textarea
                    rows={2}
                    value={answers[field.key] || ''}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none"
                  />
                </div>
              ))}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAnswers({});
                    setFeedback(null);
                  }}
                  className="min-h-[42px] inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Xóa nháp</span>
                </button>

                <button
                  type="submit"
                  disabled={
                    isEvaluating ||
                    Object.values(answers).every((v) => !v || !v.trim())
                  }
                  className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang thẩm định lập luận...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đối chiếu cùng AI Mentor</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {feedback && (
              <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Phản hồi Rèn luyện Tư duy
                </h3>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-emerald-800">
                    Điểm sắc bén trong phân tích của bạn:
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {feedback.strengths}
                  </p>
                </div>

                {feedback.missedNuances.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-slate-100">
                    <div className="text-xs font-semibold text-amber-900">
                      Các góc khuất hoặc giả định cần bổ sung:
                    </div>
                    <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1 leading-relaxed">
                      {feedback.missedNuances.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-1 pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-900">
                    Góc nhìn đối chiếu từ Mentor:
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {feedback.mentorPerspective}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs italic text-slate-800">
                    Câu hỏi nâng cao: “{feedback.nextThinkingQuestion}”
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onSendToMentorChat(
                        'critical-thinking',
                        `Từ bài tập "${activeScenario.title}", tôi muốn thảo luận thêm về câu hỏi: ${feedback.nextThinkingQuestion}`,
                        MentorMode.CRITIQUE
                      )
                    }
                    className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Tranh biện tiếp</span>
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
