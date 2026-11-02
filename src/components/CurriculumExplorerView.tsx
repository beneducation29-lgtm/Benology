import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  HelpCircle,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';
import { LEARNING_DOMAINS } from '../data/curriculum';
import { MasteryStatus, TopicProgressRecord } from '../types/mentor';
import { VISUAL_ASSETS } from '../assets/visualAssets';
import { ResilientImage } from './ResilientImage';

interface CurriculumExplorerViewProps {
  selectedDomainId: string;
  onSelectDomain: (domainId: string) => void;
  progressMap: Record<string, TopicProgressRecord>;
  onStartTopic: (domainId: string, topicId: string) => void;
  onAskMentorQuestion: (domainId: string, prompt: string) => void;
}

function StatusIndicator({ status }: { status: MasteryStatus }) {
  if (status === MasteryStatus.CAN_APPLY || status === MasteryStatus.CAN_EXPLAIN) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 whitespace-nowrap shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
        <span>{status}</span>
      </span>
    );
  }
  if (status === MasteryStatus.NEEDS_REVIEW) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 whitespace-nowrap shrink-0">
        <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
        <span>{status}</span>
      </span>
    );
  }
  if (status === MasteryStatus.LEARNING || status === MasteryStatus.BASIC_UNDERSTANDING) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-800 whitespace-nowrap shrink-0">
        <Clock className="w-3.5 h-3.5 text-teal-700" />
        <span>{status}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap shrink-0">
      <Circle className="w-3.5 h-3.5 text-slate-400" />
      <span>{status}</span>
    </span>
  );
}

export function CurriculumExplorerView({
  selectedDomainId,
  onSelectDomain,
  progressMap,
  onStartTopic,
  onAskMentorQuestion,
}: CurriculumExplorerViewProps) {
  const activeDomain =
    LEARNING_DOMAINS.find((d) => d.id === selectedDomainId) || LEARNING_DOMAINS[0];

  // Interactive Compounding & Inflation Educational Simulator (for Domain 04 & 08)
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
    <div className="space-y-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Bản đồ Tri thức Liên ngành</span>
          <span aria-hidden="true">·</span>
          <span>10 lĩnh vực cốt lõi</span>
          <span aria-hidden="true">·</span>
          <span>{LEARNING_DOMAINS.reduce((acc, d) => acc + d.topics.length, 0)} chuyên đề gốc rễ</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 [text-wrap:balance]">
          10 Lĩnh Vực Học Tập &amp; Phát Triển Tư Duy Dài Hạn
        </h1>
      </div>

      {/* Interactive Domain Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-200/60 rounded-xl">
        {LEARNING_DOMAINS.map((domain) => {
          const active = domain.id === activeDomain.id;
          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => onSelectDomain(domain.id)}
              className={`px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                active
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                  {domain.indexLabel}
                </span>
                <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                  {
                    domain.topics.filter(
                      (t) =>
                        progressMap[t.id] &&
                        progressMap[t.id].status !== MasteryStatus.NOT_STARTED
                    ).length
                  }
                  /{domain.topics.length}
                </span>
              </div>
              <div className="text-xs font-semibold truncate mt-0.5 whitespace-nowrap">
                {domain.shortTitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Domain Deep Overview + Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="font-mono text-xs text-teal-800 font-semibold tabular-nums">
              Lĩnh vực {activeDomain.indexLabel} / 10
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{activeDomain.title}</h2>
            <p className="text-sm font-editorial italic text-slate-700 pt-1">
              “{activeDomain.coreQuestion}”
            </p>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">{activeDomain.overview}</p>

          <div className="pt-5 border-t border-slate-200 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Nguyên tắc giảng dạy &amp; Tư duy
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
              {activeDomain.pedagogicalPrinciples.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-1.5">
            <div className="text-xs font-semibold text-slate-900">
              Giới hạn Nhận thức luận &amp; Đạo đức
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeDomain.epistemicGuardrail}
            </p>
          </div>

          <div className="pt-5 border-t border-slate-200 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Câu hỏi Socratic gợi mở đối thoại
            </h3>
            <div className="space-y-2">
              {activeDomain.socraticPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onAskMentorQuestion(activeDomain.id, prompt)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-teal-700 hover:bg-teal-900/5 transition-colors group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs text-slate-700 leading-relaxed group-hover:text-slate-900">
                      {prompt}
                    </span>
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 shrink-0 mt-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Subtopics List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200">
            <div className="px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Danh mục Chuyên đề ({activeDomain.topics.length} bài học cấu trúc 7 phần)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chọn một chuyên đề để mở bài học gốc rễ, câu hỏi tự suy luận và bài tập thực hành.
                </p>
              </div>
            </div>

            {activeDomain.topics.map((topic, index) => {
              const status =
                progressMap[topic.id]?.status || MasteryStatus.NOT_STARTED;
              return (
                <div
                  key={topic.id}
                  className="p-6 hover:bg-slate-50/70 transition-colors space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono tabular-nums">
                        {activeDomain.indexLabel}.{index + 1}
                      </span>
                      {topic.stageLabel && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-teal-800">{topic.stageLabel}</span>
                        </>
                      )}
                    </div>
                    <StatusIndicator status={status} />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {topic.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{topic.summary}</p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-start gap-2 text-xs text-slate-500 max-w-xl">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="italic">{topic.guidingQuestion}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onStartTopic(activeDomain.id, topic.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ml-auto"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Vào học chuyên đề</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Educational Model for Finance (04) & Economics (08) */}
          {(activeDomain.id === 'personal-finance' || activeDomain.id === 'economics') && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-1.5">
                  <div className="text-xs text-slate-500">
                    Mô hình Tương tác Giáo dục · Lãi kép &amp; Sức mua Thực tế
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Thí nghiệm Tác động của Thời gian, Lợi suất và Lạm phát
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Điều chỉnh các thanh trượt để quan sát sự chênh lệch giữa số tiền danh nghĩa, sức mua thực sau lạm phát và rủi ro ăn mòn nếu chỉ giữ tiền mặt không sinh lời.
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="sim-save" className="font-medium text-slate-700">
                      Khoản tích lũy đều mỗi tháng:
                    </label>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {monthlySaveMillion} triệu VNĐ
                    </span>
                  </div>
                  <input
                    id="sim-save"
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
                    <label htmlFor="sim-years" className="font-medium text-slate-700">
                      Khung thời gian kỷ luật:
                    </label>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {years} năm
                    </span>
                  </div>
                  <input
                    id="sim-years"
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
                    <label htmlFor="sim-return" className="font-medium text-slate-700">
                      Lợi suất danh nghĩa giả định/năm:
                    </label>
                    <span className="font-mono font-semibold text-teal-800 tabular-nums">
                      {annualReturnPct}% / năm
                    </span>
                  </div>
                  <input
                    id="sim-return"
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
                    <label htmlFor="sim-inflation" className="font-medium text-slate-700">
                      Tỷ lệ lạm phát trung bình/năm:
                    </label>
                    <span className="font-mono font-semibold text-amber-800 tabular-nums">
                      {inflationPct}% / năm
                    </span>
                  </div>
                  <input
                    id="sim-inflation"
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
                  <div className="text-xs text-slate-500">Tổng vốn gốc tự đóng</div>
                  <div className="text-lg font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                    {simulation.totalPrincipal.toLocaleString('vi-VN')} tr
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Giá trị danh nghĩa</div>
                  <div className="text-lg font-mono font-semibold text-teal-800 tabular-nums mt-0.5">
                    {simulation.nominalBalance.toLocaleString('vi-VN')} tr
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Sức mua thực (quy đổi hiện tại)</div>
                  <div className="text-lg font-mono font-semibold text-emerald-800 tabular-nums mt-0.5">
                    {simulation.realPurchasingPower.toLocaleString('vi-VN')} tr
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Nếu giữ tiền mặt 0% lãi</div>
                  <div className="text-lg font-mono font-semibold text-amber-800 tabular-nums mt-0.5">
                    {simulation.cashPurchasingPower.toLocaleString('vi-VN')} tr
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                Lưu ý giáo dục bắt buộc: Mô hình toán học giả định mức sinh lời đều đặn để minh họa hiệu ứng lãi kép và lạm phát. Trong thực tế, các tài sản có lợi suất kỳ vọng cao luôn đi kèm biến động giá (volatility) và rủi ro thua lỗ vốn trong ngắn và trung hạn. Không có khoản đầu tư nào cam kết lợi nhuận cao mà không có rủi ro.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
