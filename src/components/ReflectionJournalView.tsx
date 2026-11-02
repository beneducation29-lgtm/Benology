import React, { useState } from 'react';
import { Edit3, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';
import { LEARNING_DOMAINS } from '../data/curriculum';
import { JournalAIInsight, JournalEntry, MentorMode } from '../types/mentor';
import { reflectOnJournalEntries } from '../services/mentorApi';

interface ReflectionJournalViewProps {
  entries: JournalEntry[];
  onSaveEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onDiscussInMentor: (domainId: string, prompt: string, mode?: MentorMode) => void;
}

export function ReflectionJournalView({
  entries,
  onSaveEntry,
  onDeleteEntry,
  onDiscussInMentor,
}: ReflectionJournalViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [linkedDomainId, setLinkedDomainId] = useState<string>('self-learning');
  const [learnedToday, setLearnedToday] = useState('');
  const [changedMind, setChangedMind] = useState('');
  const [unansweredQuestion, setUnansweredQuestion] = useState('');
  const [decisionWeighing, setDecisionWeighing] = useState('');
  const [mistakeAnalysis, setMistakeAnalysis] = useState('');

  const [aiInsight, setAiInsight] = useState<JournalAIInsight | null>(null);
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflectError, setReflectError] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setLearnedToday('');
    setChangedMind('');
    setUnansweredQuestion('');
    setDecisionWeighing('');
    setMistakeAnalysis('');
  };

  const handleEditSelect = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setLinkedDomainId(entry.linkedDomainId || 'self-learning');
    setLearnedToday(entry.learnedToday);
    setChangedMind(entry.changedMind);
    setUnansweredQuestion(entry.unansweredQuestion);
    setDecisionWeighing(entry.decisionWeighing);
    setMistakeAnalysis(entry.mistakeAnalysis);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !learnedToday.trim() &&
      !changedMind.trim() &&
      !unansweredQuestion.trim() &&
      !decisionWeighing.trim() &&
      !mistakeAnalysis.trim()
    ) {
      return;
    }

    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: editingId || `journal-${Date.now()}`,
      createdAt: editingId
        ? entries.find((x) => x.id === editingId)?.createdAt || now
        : now,
      updatedAt: now,
      title:
        title.trim() ||
        `Phản tư ngày ${new Date().toLocaleDateString('vi-VN')}`,
      learnedToday: learnedToday.trim(),
      changedMind: changedMind.trim(),
      unansweredQuestion: unansweredQuestion.trim(),
      decisionWeighing: decisionWeighing.trim(),
      mistakeAnalysis: mistakeAnalysis.trim(),
      linkedDomainId,
    };

    onSaveEntry(entry);
    resetForm();
  };

  const handleGenerateInsight = async () => {
    if (entries.length === 0) return;
    setIsReflecting(true);
    setReflectError(null);
    try {
      const insight = await reflectOnJournalEntries(entries);
      setAiInsight(insight);
    } catch (err) {
      setReflectError(
        err instanceof Error ? err.message : 'Chưa thể tổng hợp nhật ký lúc này.'
      );
    } finally {
      setIsReflecting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Nhật ký Phát triển Cá nhân (Personal Reflection Journal)</span>
            <span aria-hidden="true">·</span>
            <span>Lưu trữ riêng tư tại trình duyệt của bạn</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Phản Tư Nhận Thức &amp; Phân Tích Quyết Định
          </h1>
        </div>

        <button
          type="button"
          disabled={isReflecting || entries.length === 0}
          onClick={handleGenerateInsight}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isReflecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang đọc lại dòng suy nghĩ...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>AI Tóm tắt &amp; Tìm chủ đề lặp lại</span>
            </>
          )}
        </button>
      </div>

      {/* AI Reflection Insight Box */}
      {reflectError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
          {reflectError}
        </div>
      )}

      {aiInsight && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              Góc nhìn Phản tư từ AI Mentor
            </h2>
            <span className="text-xs text-slate-500">
              Không đánh giá tính cách hay chẩn đoán tâm lý
            </span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">{aiInsight.summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-900">
                Các chủ đề lặp lại trong suy nghĩ của bạn:
              </div>
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1.5 leading-relaxed">
                {aiInsight.recurringThemes.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-teal-900">
                Câu hỏi gợi mở để bạn tự chiêm nghiệm:
              </div>
              <ul className="space-y-2">
                {aiInsight.socraticQuestions.map((q, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start justify-between gap-2">
                    <span className="italic leading-relaxed">“{q}”</span>
                    <button
                      type="button"
                      onClick={() =>
                        onDiscussInMentor(
                          'self-learning',
                          `Từ nhật ký phản tư của tôi, hãy cùng thảo luận Socratic về câu hỏi: "${q}"`,
                          MentorMode.SOCRATIC
                        )
                      }
                      className="text-teal-800 font-semibold hover:underline shrink-0 cursor-pointer"
                    >
                      Bàn tiếp →
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form: 5 Reflection Prompts */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? 'Chỉnh sửa trang nhật ký' : 'Viết trang phản tư mới'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Hủy chỉnh sửa
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="j-title" className="block text-xs font-semibold text-slate-800">
                Tiêu đề ngắn gọn
              </label>
              <input
                id="j-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Bài học từ một quyết định vội vàng..."
                className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="j-domain" className="block text-xs font-semibold text-slate-800">
                Lĩnh vực liên quan
              </label>
              <select
                id="j-domain"
                value={linkedDomainId}
                onChange={(e) => setLinkedDomainId(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-teal-700 focus:outline-none"
              >
                {LEARNING_DOMAINS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.shortTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-900">
              1. Điều tôi học được hôm nay
            </label>
            <textarea
              rows={2}
              value={learnedToday}
              onChange={(e) => setLearnedToday(e.target.value)}
              placeholder="Nguyên lý, khái niệm hoặc góc nhìn mới bạn vừa hiểu sâu..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-900">
              2. Điều khiến tôi thay đổi suy nghĩ
            </label>
            <textarea
              rows={2}
              value={changedMind}
              onChange={(e) => setChangedMind(e.target.value)}
              placeholder="Giả định cũ nào của bạn vừa được hiệu chỉnh lại?"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-900">
              3. Một câu hỏi tôi chưa có câu trả lời
            </label>
            <textarea
              rows={2}
              value={unansweredQuestion}
              onChange={(e) => setUnansweredQuestion(e.target.value)}
              placeholder="Câu hỏi mở nào bạn muốn tự tìm hiểu tiếp trong những ngày tới?"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-900">
              4. Một quyết định tôi đang cân nhắc
            </label>
            <textarea
              rows={2}
              value={decisionWeighing}
              onChange={(e) => setDecisionWeighing(e.target.value)}
              placeholder="Các phương án, chi phí cơ hội và rủi ro bạn đang đặt lên bàn cân..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-900">
              5. Một sai lầm tôi muốn phân tích khách quan
            </label>
            <textarea
              rows={2}
              value={mistakeAnalysis}
              onChange={(e) => setMistakeAnalysis(e.target.value)}
              placeholder="Nguyên nhân hệ thống đằng sau sai lầm đó là gì và bài học rút ra?"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{editingId ? 'Cập nhật nhật ký' : 'Lưu vào Nhật ký Phát triển'}</span>
            </button>
          </div>
        </form>

        {/* Right: Saved Entries List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-sm font-bold text-slate-900">
            Các trang phản tư đã lưu ({entries.length})
          </div>

          {entries.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
              Chưa có ghi chép nào. Hãy viết vài dòng đầu tiên để lưu lại hành trình trưởng thành tư duy của bạn.
            </div>
          ) : (
            entries.map((entry) => {
              const domainName =
                LEARNING_DOMAINS.find((d) => d.id === entry.linkedDomainId)?.shortTitle ||
                'Tự học';
              return (
                <article
                  key={entry.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] text-slate-500">
                        {domainName} ·{' '}
                        <span className="font-mono tabular-nums">
                          {new Date(entry.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {entry.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditSelect(entry)}
                        aria-label="Chỉnh sửa nhật ký"
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteEntry(entry.id)}
                        aria-label="Xóa nhật ký"
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    {entry.learnedToday && (
                      <p>
                        <strong className="text-slate-900">Học được: </strong>
                        {entry.learnedToday}
                      </p>
                    )}
                    {entry.changedMind && (
                      <p>
                        <strong className="text-slate-900">Thay đổi góc nhìn: </strong>
                        {entry.changedMind}
                      </p>
                    )}
                    {entry.unansweredQuestion && (
                      <p>
                        <strong className="text-slate-900">Câu hỏi mở: </strong>
                        {entry.unansweredQuestion}
                      </p>
                    )}
                    {entry.decisionWeighing && (
                      <p>
                        <strong className="text-slate-900">Quyết định cân nhắc: </strong>
                        {entry.decisionWeighing}
                      </p>
                    )}
                    {entry.mistakeAnalysis && (
                      <p>
                        <strong className="text-slate-900">Phân tích sai lầm: </strong>
                        {entry.mistakeAnalysis}
                      </p>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
