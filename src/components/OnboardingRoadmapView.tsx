import React, { useState } from 'react';
import { ArrowRight, Compass, Loader2, RefreshCw, MessageSquare } from 'lucide-react';
import { LEARNING_DOMAINS } from '../data/curriculum';
import { KnowledgeLevel, PersonalizedRoadmap } from '../types/mentor';
import { generatePersonalizedRoadmap } from '../services/mentorApi';
import { VISUAL_ASSETS } from '../assets/visualAssets';
import { ResilientImage } from './ResilientImage';

interface OnboardingRoadmapViewProps {
  roadmap: PersonalizedRoadmap | null;
  onSaveRoadmap: (roadmap: PersonalizedRoadmap) => void;
  onStartTopic: (domainId: string, topicId: string) => void;
  onOpenMentorChat: (domainId?: string, initialPrompt?: string) => void;
}

const LEVELS: KnowledgeLevel[] = [
  KnowledgeLevel.BEGINNER,
  KnowledgeLevel.BASIC,
  KnowledgeLevel.INTERMEDIATE,
  KnowledgeLevel.ADVANCED,
];

const DAILY_MINUTES_PRESETS = [15, 25, 45, 60];

export function OnboardingRoadmapView({
  roadmap,
  onSaveRoadmap,
  onStartTopic,
  onOpenMentorChat,
}: OnboardingRoadmapViewProps) {
  const [selectedDomainId, setSelectedDomainId] = useState<string>(
    roadmap?.domainId || LEARNING_DOMAINS[0].id
  );
  const [selectedLevel, setSelectedLevel] = useState<KnowledgeLevel>(
    roadmap?.currentLevel || KnowledgeLevel.BEGINNER
  );
  const [longTermGoal, setLongTermGoal] = useState<string>(
    roadmap?.longTermGoal || ''
  );
  const [dailyMinutes, setDailyMinutes] = useState<number>(
    roadmap?.dailyMinutes || 25
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditingForm, setIsEditingForm] = useState<boolean>(!roadmap);

  const selectedDomain =
    LEARNING_DOMAINS.find((d) => d.id === selectedDomainId) || LEARNING_DOMAINS[0];

  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedGoal =
      longTermGoal.trim() ||
      `Hiểu sâu bản chất ${selectedDomain.shortTitle.toLowerCase()}, rèn tư duy độc lập và áp dụng vào quyết định thực tế.`;

    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const created = await generatePersonalizedRoadmap({
        domainId: selectedDomain.id,
        domainTitle: selectedDomain.title,
        currentLevel: selectedLevel,
        longTermGoal: trimmedGoal,
        dailyMinutes,
        availableTopics: selectedDomain.topics.map((t) => ({
          id: t.id,
          title: t.title,
        })),
      });
      onSaveRoadmap(created);
      setIsEditingForm(false);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Đã xảy ra lỗi khi thiết lập lộ trình.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Editorial Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-slate-200 rounded-2xl p-8 sm:p-10">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Hệ thống Cố vấn Cá nhân</span>
              <span aria-hidden="true">·</span>
              <span>10 lĩnh vực nền tảng</span>
              <span aria-hidden="true">·</span>
              <span>Phương pháp Socratic &amp; Feynman</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-slate-900 leading-[1.18] [text-wrap:balance]">
              Chào bạn. Bạn muốn bắt đầu hành trình phát triển bản thân từ lĩnh vực nào?
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              Mục tiêu của hệ thống này không phải là đưa ra những câu trả lời ăn sẵn, mà là đồng hành để bạn hiểu vấn đề từ gốc rễ, biết phân biệt sự thật với giả định, liên kết tri thức đa ngành và xây dựng năng lực tự học độc lập suốt đời.
            </p>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500 space-x-2">
              <span className="font-medium text-slate-700">Nguyên tắc cốt lõi:</span>
              <span>Hiểu bản chất</span>
              <span aria-hidden="true">·</span>
              <span>Đa góc nhìn</span>
              <span aria-hidden="true">·</span>
              <span>Không phụ thuộc AI</span>
            </div>
            <button
              type="button"
              onClick={() => onOpenMentorChat(selectedDomain.id)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-teal-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Trò chuyện trực tiếp với Cố vấn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-slate-200 min-h-[280px]">
          <ResilientImage
            src={VISUAL_ASSETS.heroStudy}
            alt="Không gian tự học yên tĩnh với sổ tay mở và ánh sáng tự nhiên"
            fallbackTitle="Không gian Suy tư & Tự học Độc lập"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent flex flex-col justify-end p-6 sm:p-8">
            <p className="text-sm sm:text-base font-editorial italic text-slate-100 leading-relaxed">
              “Người thầy giỏi không trao cho người học câu trả lời đóng gói sẵn, mà giúp họ rèn đôi mắt biết tự tìm ra câu trả lời.”
            </p>
            <p className="text-xs text-slate-300 mt-2">
              Triết lý giáo dục khai phóng · Tự chủ nhận thức
            </p>
          </div>
        </div>
      </section>

      {/* 4 Initial Diagnostic Questions OR Generated Personalized Roadmap */}
      {isEditingForm || !roadmap ? (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Thiết kế Lộ trình Học tập Cá nhân hóa
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              Hãy trả lời 4 câu hỏi khởi đầu dưới đây để Cố vấn thiết kế lộ trình phù hợp với nền tảng hiện tại, quỹ thời gian mỗi ngày và mục tiêu dài hạn của riêng bạn.
            </p>
          </div>

          <form onSubmit={handleCreateRoadmap} className="space-y-8">
            {/* Question 1 */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-900">
                01. Bạn muốn phát triển lĩnh vực nào trước trong 10 lĩnh vực?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {LEARNING_DOMAINS.map((domain) => {
                  const isSelected = domain.id === selectedDomainId;
                  return (
                    <button
                      key={domain.id}
                      type="button"
                      onClick={() => setSelectedDomainId(domain.id)}
                      className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-teal-900/5 border-teal-700 text-slate-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="font-mono text-xs text-slate-500 tabular-nums mb-1">
                        {domain.indexLabel}
                      </div>
                      <div className="text-sm font-semibold leading-snug text-slate-900">
                        {domain.shortTitle}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {domain.topics.length} chủ đề cốt lõi
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Câu hỏi trọng tâm của lĩnh vực đã chọn: <span className="italic text-slate-700">“{selectedDomain.coreQuestion}”</span>
              </p>
            </div>

            {/* Question 2 & Question 4 in balanced grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-200">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900">
                  02. Kiến thức hiện tại của bạn về {selectedDomain.shortTitle.toLowerCase()} ở mức nào?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {LEVELS.map((lvl) => {
                    const active = selectedLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedLevel(lvl)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="daily-minutes-slider" className="text-sm font-semibold text-slate-900">
                    04. Bạn muốn dành bao nhiêu phút tự học mỗi ngày?
                  </label>
                  <span className="font-mono text-sm font-semibold text-teal-800 tabular-nums">
                    {dailyMinutes} phút / ngày
                  </span>
                </div>
                <input
                  id="daily-minutes-slider"
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={dailyMinutes}
                  onChange={(e) => setDailyMinutes(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  {DAILY_MINUTES_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDailyMinutes(preset)}
                      className={`px-3 py-1 rounded-md text-xs font-mono tabular-nums border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        dailyMinutes === preset
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset} phút
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Question 3 */}
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <label htmlFor="long-term-goal" className="block text-sm font-semibold text-slate-900">
                03. Mục tiêu dài hạn của bạn khi học lĩnh vực này là gì?
              </label>
              <textarea
                id="long-term-goal"
                rows={3}
                value={longTermGoal}
                onChange={(e) => setLongTermGoal(e.target.value)}
                placeholder={`Ví dụ: Tôi muốn rèn tư duy độc lập để ra quyết định sự nghiệp và tài chính tỉnh táo hơn trong 3–5 năm tới, không bị cuốn theo tâm lý đám đông...`}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
              />
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              {roadmap && (
                <button
                  type="button"
                  onClick={() => setIsEditingForm(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Hủy thay đổi
                </button>
              )}
              <button
                type="submit"
                disabled={isGenerating}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer ml-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang thiết kế lộ trình cá nhân hóa...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4" />
                    <span>Đề xuất lộ trình học cá nhân hóa</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      ) : (
        /* Personalized Roadmap Display */
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Lộ trình Cá nhân hóa</span>
                <span aria-hidden="true">·</span>
                <span>{roadmap.domainTitle}</span>
                <span aria-hidden="true">·</span>
                <span>Mức {roadmap.currentLevel}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{roadmap.dailyMinutes} phút/ngày</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Hành trình Rèn luyện: {roadmap.domainTitle}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditingForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thiết lập lại lộ trình</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const fallbackTopic =
                    LEARNING_DOMAINS.find((d) => d.id === roadmap.domainId)?.topics[0]?.id ||
                    'phil-what-is';
                  const validTopic = LEARNING_DOMAINS.find(
                    (d) => d.id === roadmap.domainId
                  )?.topics.some((t) => t.id === roadmap.recommendedFirstTopicId)
                    ? roadmap.recommendedFirstTopicId
                    : fallbackTopic;
                  onStartTopic(roadmap.domainId, validTopic);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Bắt đầu buổi học đầu tiên</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-base font-semibold text-slate-900">
                Lời nhắn từ Cố vấn &amp; Chiến lược học tập
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">{roadmap.mentorGreeting}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{roadmap.coreStrategy}</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-2">
              <div className="text-xs font-semibold text-slate-900">
                Nguyên tắc chống phụ thuộc AI
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {roadmap.antiDependencyReminder}
              </p>
              <div className="pt-2 text-xs text-slate-500">
                Mục tiêu dài hạn: <span className="text-slate-700">{roadmap.longTermGoal}</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200 border-t border-slate-200">
            {roadmap.milestones.map((m) => (
              <div
                key={m.phaseNumber}
                className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                <div className="lg:col-span-4 space-y-1">
                  <div className="font-mono text-xs text-teal-800 font-semibold tabular-nums">
                    Chặng 0{m.phaseNumber} · {m.timeframe}
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">{m.phaseTitle}</h4>
                </div>
                <div className="lg:col-span-5 space-y-2">
                  <div className="text-xs font-medium text-slate-500">Trọng tâm nghiên cứu</div>
                  <ul className="space-y-1 text-sm text-slate-700 list-disc pl-4">
                    {m.focusTopics.map((ft, idx) => (
                      <li key={idx}>{ft}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                    <span className="font-semibold text-slate-800">Nhịp thực hành hàng ngày: </span>
                    {m.dailyPracticeRoutine}
                  </p>
                </div>
                <div className="lg:col-span-3 space-y-1.5">
                  <div className="text-xs font-medium text-slate-500">Câu hỏi tự kiểm chứng chặng</div>
                  <p className="text-xs italic text-slate-700 leading-relaxed">
                    “{m.milestoneCheckQuestion}”
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
