import React, { useState } from 'react';
import { Scale, Loader2, MessageSquare, ArrowRight, RotateCcw } from 'lucide-react';
import { CriticalThinkingAnalysis } from '../types/mentor';
import { analyzeCriticalThinking } from '../services/mentorApi';
import { VISUAL_ASSETS } from '../assets/visualAssets';
import { ResilientImage } from './ResilientImage';

interface CriticalThinkingLabViewProps {
  onSendToMentorChat: (domainId: string, prompt: string) => void;
}

const SAMPLE_STATEMENTS = [
  'Trong kỷ nguyên AI phát triển mạnh mẽ, việc học đại học 4 năm không còn cần thiết nữa.',
  'Cứ mua bất động sản để đó trong dài hạn thì chắc chắn không bao giờ lỗ.',
  'Con người về bản chất chỉ hành động vì lợi ích ích kỷ của riêng mình; lòng vị tha chỉ là vỏ bọc.',
  'Nhà nước nên áp giá trần thật thấp cho mọi mặt hàng thiết yếu để giúp người thu nhập thấp.',
];

export function CriticalThinkingLabView({
  onSendToMentorChat,
}: CriticalThinkingLabViewProps) {
  const [statement, setStatement] = useState<string>(SAMPLE_STATEMENTS[0]);
  const [userInitialThoughts, setUserInitialThoughts] = useState<string>('');
  const [analysis, setAnalysis] = useState<CriticalThinkingAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeCriticalThinking({
        statement: statement.trim(),
        userInitialThoughts: userInitialThoughts.trim() || undefined,
      });
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể phân tích tuyên bố.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Lĩnh vực 09 · Xưởng Thực hành Tư duy Phản biện</span>
              <span aria-hidden="true">·</span>
              <span>Quy trình 6 bước độc lập</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 [text-wrap:balance]">
              Mổ xẻ Quan điểm, Giả định &amp; Thiên kiến Nhận thức
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              Khi đứng trước một lời khuyên đám đông, một nhận định kinh tế hay chính niềm tin quen thuộc của mình, đừng vội gật đầu hay bác bỏ. Hãy đưa tuyên bố đó qua 6 tầng kiểm định để rèn khả năng suy nghĩ độc lập mà không cố chấp.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
            Phân loại tri thức nghiêm ngặt: Sự thật thực nghiệm · Giả thuyết · Quan điểm giá trị · Suy đoán · Chưa đủ dữ liệu
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl overflow-hidden border border-slate-200 min-h-[200px]">
          <ResilientImage
            src={VISUAL_ASSETS.criticalThinking}
            alt="Lăng kính hình học và khối đồng cân bằng trên nền đá phiến"
            fallbackTitle="Lăng kính Phản biện Đa chiều"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Input Form */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-700">
            Chọn nhanh một nhận định phổ biến để thử nghiệm hoặc tự nhập quan điểm của bạn:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {SAMPLE_STATEMENTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setStatement(sample);
                  setAnalysis(null);
                }}
                className={`text-left p-3 rounded-xl border text-xs leading-relaxed transition-colors cursor-pointer ${
                  statement === sample
                    ? 'border-teal-700 bg-teal-900/5 text-slate-900 font-medium'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                “{sample}”
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-5 pt-4 border-t border-slate-200">
          <div className="space-y-2">
            <label htmlFor="ct-statement" className="block text-sm font-semibold text-slate-900">
              Quan điểm / Tuyên bố bạn muốn kiểm định:
            </label>
            <textarea
              id="ct-statement"
              rows={2}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Nhập một nhận định, lời khuyên tài chính, quan điểm xã hội hoặc quyết định cá nhân..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="ct-user-thought" className="block text-sm font-semibold text-slate-900">
              Suy nghĩ độc lập của bạn trước khi đối chiếu cùng AI (Khuyến khích thực hành):
            </label>
            <textarea
              id="ct-user-thought"
              rows={2}
              value={userInitialThoughts}
              onChange={(e) => setUserInitialThoughts(e.target.value)}
              placeholder="Theo bạn, giả định ẩn của câu trên là gì? Có góc nhìn đối lập nào đáng lưu ý không?"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setStatement('');
                setUserInitialThoughts('');
                setAnalysis(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm mới khung phân tích</span>
            </button>

            <button
              type="submit"
              disabled={isAnalyzing || !statement.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang phân tích 6 tầng lập luận...</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  <span>Phân tích Phản biện 6 Bước</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* 6-Step Output */}
      {analysis && (
        <section className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200">
          <div className="p-6 sm:p-8 space-y-2">
            <div className="text-xs text-slate-500">
              Kết quả Kiểm định Nhận thức · 6 Bước Chuẩn mực
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              “{analysis.originalStatement}”
            </h2>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
                01. Xác định tuyên bố thực chất
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{analysis.step1CoreClaim}</p>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
                02. Kiểm tra giả định ngầm chưa chứng minh
              </div>
              <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-4 leading-relaxed">
                {analysis.step2HiddenAssumptions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
                03. Kiểm tra &amp; Phân loại bằng chứng
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Phân loại nhận thức luận: </span>
                {analysis.step3EvidenceCheck.epistemicType}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {analysis.step3EvidenceCheck.sourceStrength}
              </p>
              {analysis.step3EvidenceCheck.missingEvidence.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="text-xs font-semibold text-slate-800">
                    Dữ liệu còn thiếu cần tự kiểm tra thêm:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
                    {analysis.step3EvidenceCheck.missingEvidence.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
                04. Quan điểm đối lập mạnh nhất (Steelman)
              </div>
              <ul className="space-y-2 text-sm text-slate-700 list-disc pl-4 leading-relaxed">
                {analysis.step4CounterArguments.map((arg, i) => (
                  <li key={i}>{arg}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
              05. Phân tích Thiên kiến nhận thức tiềm ẩn
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.step5CognitiveBiases.map((b, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-1.5"
                >
                  <div className="text-sm font-semibold text-slate-900">{b.biasVi}</div>
                  <div className="text-xs text-slate-500 font-mono">{b.biasEn}</div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{b.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-slate-50/70 space-y-4 rounded-b-2xl">
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-teal-800 tabular-nums">
                06. Kết luận có điều kiện &amp; Bước tự suy nghĩ tiếp theo
              </div>
              <p className="text-sm font-medium text-slate-900 leading-relaxed">
                {analysis.step6ConditionalConclusion}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs italic text-slate-700 max-w-2xl">
                Câu hỏi để bạn tự kết luận: “{analysis.independentNextStepQuestion}”
              </p>
              <button
                type="button"
                onClick={() =>
                  onSendToMentorChat(
                    'critical-thinking',
                    `Tôi vừa phân tích nhận định: "${analysis.originalStatement}". Hãy tranh biện Socratic với tôi về câu hỏi: ${analysis.independentNextStepQuestion}`
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Tranh biện tiếp cùng Cố vấn</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
