import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';
import {
  LEARNING_DOMAINS,
  LEARNING_PATH_LEVEL_META,
  UNDERSTANDING_LEVEL_LABELS,
} from '../data/curriculum';
import {
  LearningPathLevel,
  SmartReviewState,
  TopicProgressRecord,
  UnderstandingLevel,
} from '../types/mentor';
import { VISUAL_ASSETS } from '../assets/visualAssets';
import { ResilientImage } from './ResilientImage';

interface ExploreKnowledgeViewProps {
  selectedDomainId: string;
  onSelectDomain: (domainId: string) => void;
  progressMap: Record<string, TopicProgressRecord>;
  onOpenLesson: (domainId: string, topicId: string) => void;
  onAskAIMentor: (domainId: string, prompt: string) => void;
}

const PATH_LEVELS: LearningPathLevel[] = [
  LearningPathLevel.FOUNDATION,
  LearningPathLevel.UNDERSTANDING,
  LearningPathLevel.ANALYSIS,
  LearningPathLevel.APPLICATION,
  LearningPathLevel.INDEPENDENT_THINKING,
];

function ReviewBadgeText({ record }: { record?: TopicProgressRecord }) {
  const reviewState = record?.reviewState || SmartReviewState.NEW;
  const uLevel = record?.understandingLevel || UnderstandingLevel.UNKNOWN;
  const levelLabel = UNDERSTANDING_LEVEL_LABELS[uLevel].label;

  if (reviewState === SmartReviewState.MASTERED) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 whitespace-nowrap shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
        <span>MASTERED · {levelLabel}</span>
      </span>
    );
  }
  if (reviewState === SmartReviewState.REVIEW) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 whitespace-nowrap shrink-0">
        <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
        <span>REVIEW · Cần ôn lại</span>
      </span>
    );
  }
  if (reviewState === SmartReviewState.LEARNING || reviewState === SmartReviewState.PRACTICING) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-800 whitespace-nowrap shrink-0">
        <Clock className="w-3.5 h-3.5 text-teal-700" />
        <span>{reviewState} · {levelLabel}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap shrink-0">
      <Circle className="w-3.5 h-3.5 text-slate-400" />
      <span>NEW · Chưa biết</span>
    </span>
  );
}

export function ExploreKnowledgeView({
  selectedDomainId,
  onSelectDomain,
  progressMap,
  onOpenLesson,
  onAskAIMentor,
}: ExploreKnowledgeViewProps) {
  const activeDomain =
    LEARNING_DOMAINS.find((d) => d.id === selectedDomainId) || LEARNING_DOMAINS[0];

  // Preserved Interactive Compounding & Inflation Simulator for Finance & Economics
  const [monthlySaveMillion, setMonthlySaveMillion] = useState<number>(5);
  const [annualReturnPct, setAnnualReturnPct] = useState<number>(9);
  const [inflationPct, setInflationPct] = useState<number>(4);
  const [years, setYears] = useState<number>(15);

  const simulation = useMemo(() => {
    const monthlyRate = annualReturnPct / 100 / 12;
    const months = years * 12;
    let nominalBalance = 0;
    for (let m = 0; m < months; m++) {
      nominalBalance = (nominalBalance + monthlySaveMillion) * (1 + monthlyRate);
    }
    const totalPrincipal = monthlySaveMillion * months;
    const inflationDiscount = Math.pow(1 + inflationPct / 100, years);
    const realPurchasingPower = nominalBalance / inflationDiscount;
    const cashPurchasingPower = totalPrincipal / inflationDiscount;

    return {
      totalPrincipal: Math.round(totalPrincipal),
      nominalBalance: Math.round(nominalBalance),
      realPurchasingPower: Math.round(realPurchasingPower),
      cashPurchasingPower: Math.round(cashPurchasingPower),
    };
  }, [monthlySaveMillion, annualReturnPct, inflationPct, years]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Khám phá Kiến thức &amp; Lộ trình Học sâu</span>
          <span aria-hidden="true">·</span>
          <span>5 cấp độ nhận thức mỗi lĩnh vực</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 [text-wrap:balance]">
          Lộ trình Học tập 5 Cấp độ (Foundation → Independent Thinking)
        </h1>
      </div>

      {/* Responsive Domain Selector */}
      <div className="flex sm:grid sm:grid-cols-5 gap-2 overflow-x-auto pb-1 sm:pb-0 p-1.5 bg-slate-200/60 rounded-xl">
        {LEARNING_DOMAINS.map((domain) => {
          const active = domain.id === activeDomain.id;
          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => onSelectDomain(domain.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-left transition-colors shrink-0 sm:shrink cursor-pointer ${
                active
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <div className="font-mono text-[11px] text-slate-400 tabular-nums">
                {domain.indexLabel}
              </div>
              <div className="text-xs font-semibold whitespace-nowrap sm:truncate">
                {domain.shortTitle}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Domain Essence & Cross-Domain Connections */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
              Lĩnh vực {activeDomain.indexLabel} / 10
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{activeDomain.title}</h2>
            <p className="text-sm font-editorial italic text-slate-700">
              “{activeDomain.coreQuestion}”
            </p>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">{activeDomain.overview}</p>

          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              <span>Liên kết kiến thức đa ngành</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kết nối chặt chẽ với: {activeDomain.crossDomainLinks.join(' · ')}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-1.5">
            <div className="text-xs font-semibold text-slate-900">
              Nguyên tắc kiểm chứng &amp; Giới hạn
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeDomain.epistemicGuardrail}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2.5">
            <div className="text-xs font-semibold text-slate-900">
              Câu hỏi mở cùng AI Mentor
            </div>
            {activeDomain.socraticPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onAskAIMentor(activeDomain.id, prompt)}
                className="min-h-[44px] w-full text-left p-3 rounded-xl border border-slate-200 hover:border-teal-700 hover:bg-teal-900/5 transition-colors flex items-start justify-between gap-2.5 cursor-pointer"
              >
                <span className="text-xs text-slate-700 leading-relaxed">{prompt}</span>
                <MessageSquare className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </aside>

        {/* Right: 5-Level Structured Learning Path */}
        <div className="lg:col-span-8 space-y-6">
          {PATH_LEVELS.map((lvl) => {
            const levelMeta = LEARNING_PATH_LEVEL_META[lvl];
            const topicsInLevel = activeDomain.topics.filter((t) => t.pathLevel === lvl);
            if (topicsInLevel.length === 0) return null;

            return (
              <section
                key={lvl}
                className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200"
              >
                <div className="px-5 sm:px-6 py-4 bg-slate-50/70 rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-800 tabular-nums">
                      {levelMeta.code} — {levelMeta.nameEn}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {levelMeta.nameVi}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{levelMeta.objective}</span>
                </div>

                {topicsInLevel.map((topic) => {
                  const rec = progressMap[topic.id];
                  return (
                    <div
                      key={topic.id}
                      className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-xs text-slate-500">
                          {topic.stageLabel ? (
                            <span className="font-medium text-teal-800">{topic.stageLabel}</span>
                          ) : (
                            <span>Bài học cấu trúc 8 phần</span>
                          )}
                        </div>
                        <ReviewBadgeText record={rec} />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{topic.summary}</p>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-xs italic text-slate-500 max-w-xl">
                          Câu hỏi mở đầu: “{topic.guidingQuestion}”
                        </p>
                        <button
                          type="button"
                          onClick={() => onOpenLesson(activeDomain.id, topic.id)}
                          className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Mở bài học</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </section>
            );
          })}

          {/* Preserved Interactive Compounding & Inflation Educational Simulator */}
          {(activeDomain.id === 'personal-finance' || activeDomain.id === 'economics') && (
            <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-1.5">
                  <div className="text-xs text-slate-500">
                    Mô hình Thực hành Giáo dục · Lãi kép &amp; Sức mua Thực tế
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Mô phỏng Tích lũy Dài hạn &amp; Tác động Ăn mòn của Lạm phát
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Kéo các thanh trượt để kiểm chứng sự khác biệt giữa giá trị danh nghĩa và sức mua thực tế sau khi trừ lạm phát.
                  </p>
                </div>
                <div className="md:col-span-4 rounded-xl overflow-hidden border border-slate-200 h-28">
                  <ResilientImage
                    src={VISUAL_ASSETS.personalFinance}
                    alt="Sổ kế hoạch tài chính và cây xanh phát triển dài hạn"
                    fallbackTitle="Tích lũy Dài hạn"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="exp-save" className="font-medium text-slate-700">
                      Tích lũy hàng tháng:
                    </label>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {monthlySaveMillion} triệu VNĐ
                    </span>
                  </div>
                  <input
                    id="exp-save"
                    type="range"
                    min={1}
                    max={50}
                    step={1}
                    value={monthlySaveMillion}
                    onChange={(e) => setMonthlySaveMillion(Number(e.target.value))}
                    className="w-full accent-teal-700 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="exp-years" className="font-medium text-slate-700">
                      Thời gian đầu tư:
                    </label>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {years} năm
                    </span>
                  </div>
                  <input
                    id="exp-years"
                    type="range"
                    min={3}
                    max={35}
                    step={1}
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full accent-teal-700 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="exp-return" className="font-medium text-slate-700">
                      Lợi suất danh nghĩa giả định:
                    </label>
                    <span className="font-mono font-semibold text-teal-800 tabular-nums">
                      {annualReturnPct}% / năm
                    </span>
                  </div>
                  <input
                    id="exp-return"
                    type="range"
                    min={0}
                    max={16}
                    step={0.5}
                    value={annualReturnPct}
                    onChange={(e) => setAnnualReturnPct(Number(e.target.value))}
                    className="w-full accent-teal-700 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="exp-inflation" className="font-medium text-slate-700">
                      Lạm phát trung bình:
                    </label>
                    <span className="font-mono font-semibold text-amber-800 tabular-nums">
                      {inflationPct}% / năm
                    </span>
                  </div>
                  <input
                    id="exp-inflation"
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={inflationPct}
                    onChange={(e) => setInflationPct(Number(e.target.value))}
                    className="w-full accent-amber-700 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <div className="text-xs text-slate-500">Vốn gốc đóng góp</div>
                  <div className="text-base sm:text-lg font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                    {simulation.totalPrincipal.toLocaleString('vi-VN')} tr
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Số dư danh nghĩa</div>
                  <div className="text-base sm:text-lg font-mono font-semibold text-teal-800 tabular-nums mt-0.5">
                    {simulation.nominalBalance.toLocaleString('vi-VN')} tr
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Sức mua thực tế</div>
                  <div className="text-base sm:text-lg font-mono font-semibold text-emerald-800 tabular-nums mt-0.5">
                    {simulation.realPurchasingPower.toLocaleString('vi-VN')} tr
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Giữ tiền mặt 0% lãi</div>
                  <div className="text-base sm:text-lg font-mono font-semibold text-amber-800 tabular-nums mt-0.5">
                    {simulation.cashPurchasingPower.toLocaleString('vi-VN')} tr
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                Lưu ý giáo dục tài chính: Công cụ chỉ minh họa toán học của lãi kép và lạm phát, không phải lời khuyên đầu tư hay cam kết lợi nhuận.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
