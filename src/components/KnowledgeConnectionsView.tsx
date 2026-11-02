import React, { useMemo, useState } from 'react';
import { ArrowRight, Link2, Network, Search, Sparkles } from 'lucide-react';
import { LEARNING_DOMAINS } from '../data/curriculum';
import { TopicProgressRecord } from '../types/mentor';

interface KnowledgeConnectionsViewProps {
  progressMap: Record<string, TopicProgressRecord>;
  onOpenDomain: (domainId: string) => void;
  onOpenLesson: (domainId: string, topicId: string) => void;
}

export function KnowledgeConnectionsView({
  progressMap,
  onOpenDomain,
  onOpenLesson,
}: KnowledgeConnectionsViewProps) {
  const [selectedDomainId, setSelectedDomainId] = useState('critical-thinking');
  const [domainQuery, setDomainQuery] = useState('');

  const selectedDomain = LEARNING_DOMAINS.find((domain) => domain.id === selectedDomainId)
    ?? LEARNING_DOMAINS[0];

  const connectedDomains = useMemo(() => {
    const names = new Set(selectedDomain.crossDomainLinks);
    return LEARNING_DOMAINS.filter(
      (domain) => domain.id !== selectedDomain.id && names.has(domain.shortTitle)
    );
  }, [selectedDomain]);

  const studiedCount = selectedDomain.topics.filter((topic) => progressMap[topic.id]).length;
  const visibleDomains = LEARNING_DOMAINS.filter((domain) =>
    domain.shortTitle.toLocaleLowerCase('vi').includes(domainQuery.trim().toLocaleLowerCase('vi'))
  );

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-teal-50 p-3 text-teal-800">
            <Network className="h-6 w-6" />
          </div>
          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Knowledge Connections
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Kết nối kiến thức thay vì học từng mảnh rời rạc
            </h1>
            <p className="text-sm leading-relaxed text-slate-600">
              Một vấn đề thực tế thường nằm ở giao điểm của nhiều lĩnh vực. Hãy dùng bản đồ này
              để nhìn các mối liên hệ, sau đó tự kiểm tra xem một ý tưởng có thể thay đổi cách bạn
              hiểu lĩnh vực khác như thế nào.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-slate-900">Chọn một lĩnh vực</h2>
          <label className="mb-3 flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 px-3 text-slate-500 focus-within:border-teal-700">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={domainQuery}
              onChange={(event) => setDomainQuery(event.target.value)}
              placeholder="Tìm lĩnh vực..."
              aria-label="Tìm lĩnh vực kiến thức"
              className="min-w-0 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {visibleDomains.map((domain) => {
              const active = domain.id === selectedDomain.id;
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => setSelectedDomainId(domain.id)}
                  className={`min-h-[48px] rounded-xl border px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${active
                    ? 'border-teal-700 bg-teal-50 text-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <span className="font-semibold">{domain.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-teal-700">LĨNH VỰC TRUNG TÂM</div>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{selectedDomain.title}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Đã chạm {studiedCount}/{selectedDomain.topics.length} chủ đề
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{selectedDomain.overview}</p>
            <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/60 p-4">
              <div className="flex gap-2 text-sm font-semibold text-slate-900">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                Câu hỏi kết nối
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {selectedDomain.coreQuestion} Hãy thử đặt câu hỏi: góc nhìn từ {connectedDomains[0]?.shortTitle ?? 'một lĩnh vực khác'}
                có thể bổ sung hoặc thách thức cách bạn đang hiểu vấn đề này như thế nào?
              </p>
            </div>
          </article>

          {connectedDomains.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Đường đi liên ngành</div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">{selectedDomain.shortTitle}</span>
                {connectedDomains.map((domain) => (
                  <React.Fragment key={domain.id}>
                    <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <button type="button" onClick={() => setSelectedDomainId(domain.id)} className="min-h-[40px] rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-teal-700 hover:bg-teal-50 cursor-pointer">
                      {domain.shortTitle}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">Đây là gợi ý liên hệ để khám phá, không phải quan hệ nhân quả đã được chứng minh.</p>
            </section>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {connectedDomains.length > 0 ? connectedDomains.map((domain) => (
              <article key={domain.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2 text-teal-700">
                  <Link2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Liên kết</span>
                </div>
                <h3 className="mt-3 font-bold text-slate-900">{domain.shortTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{domain.cardTagline}</p>
                <button
                  type="button"
                  onClick={() => onOpenDomain(domain.id)}
                  className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 cursor-pointer"
                >
                  Khám phá mối liên hệ <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </article>
            )) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                Lĩnh vực này đang được xây dựng thêm các liên kết nội dung. Bạn vẫn có thể khám phá
                lộ trình và tự tạo những kết nối đầu tiên từ các chủ đề đã học.
              </div>
            )}
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-900">Bắt đầu từ một chủ đề cụ thể</h2>
            <div className="mt-4 grid gap-3">
              {selectedDomain.topics.slice(0, 3).map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onOpenLesson(selectedDomain.id, topic.id)}
                  className="flex min-h-[52px] items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3 text-left hover:bg-slate-50 cursor-pointer"
                >
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{topic.title}</span>
                    <span className="mt-1 block text-xs text-slate-500">{topic.summary}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
