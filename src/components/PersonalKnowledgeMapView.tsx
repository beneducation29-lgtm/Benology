import React, { useMemo } from 'react';
import { ArrowRight, BookOpen, Brain, CircleAlert, Lightbulb, Link2, Map, Sparkles } from 'lucide-react';
import { LEARNING_DOMAINS } from '../data/curriculum';
import { MasteryStatus, TopicProgressRecord } from '../types/mentor';

interface PersonalKnowledgeMapViewProps {
  progressMap: Record<string, TopicProgressRecord>;
  onOpenDomain: (domainId: string) => void;
  onOpenLesson: (domainId: string, topicId: string) => void;
}

export function PersonalKnowledgeMapView({ progressMap, onOpenDomain, onOpenLesson }: PersonalKnowledgeMapViewProps) {
  const domainStats = useMemo(() => LEARNING_DOMAINS.map((domain) => {
    const records = domain.topics.map((topic) => progressMap[topic.id]).filter(Boolean);
    const completed = records.filter((record) => record.status === MasteryStatus.CAN_APPLY || record.status === MasteryStatus.CAN_EXPLAIN).length;
    const needsReview = records.filter((record) => record.status === MasteryStatus.NEEDS_REVIEW || record.isDifficult).length;
    return { domain, touched: records.length, completed, needsReview };
  }), [progressMap]);

  const nextDomain = domainStats.slice().sort((a, b) => b.touched - a.touched)[0]?.domain ?? LEARNING_DOMAINS[0];
  const reviewTopics = Object.values(progressMap).filter((record) => record.status === MasteryStatus.NEEDS_REVIEW || record.isDifficult).slice(0, 3);
  const untouchedDomains = domainStats.filter((item) => item.touched === 0).slice(0, 3);
  const strongestDomain = domainStats.slice().sort((a, b) => b.completed - a.completed || b.touched - a.touched)[0];
  const learningMomentum = domainStats.reduce((sum, item) => sum + item.touched, 0);
  const focusDomain = domainStats.filter((item) => item.touched > 0).sort((a, b) => b.needsReview - a.needsReview || b.touched - a.touched)[0];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-teal-50 p-3 text-teal-800"><Map className="h-6 w-6" /></div>
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Personal Knowledge Map</div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Bản đồ kiến thức của bạn</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">Bản đồ này dựa trên tiến độ học thực tế đã lưu trong Benology. Nó giúp bạn nhìn phần nào đã chạm tới, phần nào cần ôn và chọn bước tiếp theo — không dùng điểm số hay năng lực giả định.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><BookOpen className="h-5 w-5 text-teal-700" /><div className="mt-3 text-2xl font-bold">{Object.keys(progressMap).length}</div><p className="mt-1 text-xs text-slate-500">Chủ đề đã có tiến độ</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><Brain className="h-5 w-5 text-teal-700" /><div className="mt-3 text-2xl font-bold">{domainStats.filter((item) => item.touched > 0).length}/10</div><p className="mt-1 text-xs text-slate-500">Lĩnh vực đã bắt đầu</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><Sparkles className="h-5 w-5 text-teal-700" /><div className="mt-3 text-2xl font-bold">{domainStats.reduce((sum, item) => sum + item.completed, 0)}</div><p className="mt-1 text-xs text-slate-500">Chủ đề có thể giải thích hoặc áp dụng</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><CircleAlert className="h-5 w-5 text-amber-600" /><div className="mt-3 text-2xl font-bold">{reviewTopics.length}</div><p className="mt-1 text-xs text-slate-500">Chủ đề đang cần chú ý</p></article>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-violet-100 bg-violet-50/50 p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-violet-800"><Lightbulb className="h-4 w-4" /> Góc nhìn mở rộng</div>
          <h2 className="mt-2 text-lg font-bold text-slate-900">{strongestDomain?.touched ? `Kết nối từ ${strongestDomain.domain.shortTitle}` : 'Bắt đầu bằng một lĩnh vực'}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{strongestDomain?.touched ? 'Hãy dùng lĩnh vực bạn đã học nhiều nhất làm điểm xuất phát, sau đó tìm một lĩnh vực khác để so sánh cách nhìn cùng một vấn đề.' : 'Khi bạn bắt đầu ghi nhận tiến độ, Benology sẽ dùng chính dữ liệu đó để giúp bạn nhìn các hướng học tiếp.'}</p>
          {strongestDomain?.touched ? <button type="button" onClick={() => onOpenDomain(strongestDomain.domain.id)} className="mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-900 hover:bg-violet-50 cursor-pointer">Khám phá lĩnh vực <ArrowRight className="h-4 w-4" /></button> : null}
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500"><Link2 className="h-4 w-4" /> Mở rộng bản đồ</div>
          {untouchedDomains.length === 0 ? <p className="mt-3 text-sm text-slate-600">Bạn đã chạm tới cả 10 lĩnh vực. Hãy tiếp tục đào sâu hoặc quay lại những chủ đề cần ôn.</p> : <><p className="mt-2 text-sm text-slate-600">Bạn chưa bắt đầu các lĩnh vực dưới đây. Đây là lời mời khám phá, không phải thứ tự bắt buộc.</p><div className="mt-3 flex flex-wrap gap-2">{untouchedDomains.map(({ domain }) => <button key={domain.id} type="button" onClick={() => onOpenDomain(domain.id)} className="min-h-[40px] rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-teal-600 hover:bg-teal-50 cursor-pointer">{domain.shortTitle}</button>)}</div></>}
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2.5 text-teal-800 shadow-sm"><Sparkles className="h-5 w-5" /></div>
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Gợi ý từ hành trình của bạn</div>
            <h2 className="mt-1 text-lg font-bold text-slate-900">{learningMomentum === 0 ? 'Bắt đầu bằng một câu hỏi bạn thật sự muốn hiểu' : focusDomain?.needsReview ? `Ưu tiên làm rõ những phần còn khó trong ${focusDomain.domain.shortTitle}` : `Tiếp tục xây nền tảng từ ${nextDomain.shortTitle}`}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{learningMomentum === 0 ? 'Chọn một lĩnh vực và bắt đầu từ một chủ đề cụ thể. Khi có dữ liệu học thực tế, bản đồ sẽ dần phản ánh hành trình của riêng bạn.' : focusDomain?.needsReview ? 'Bạn có một số chủ đề đang được đánh dấu cần xem lại. Hãy quay lại một chủ đề, tự giải thích bằng lời của mình và kiểm tra lại điều chưa chắc chắn.' : 'Bạn đã có tiến độ ổn định. Hãy học sâu hơn một chủ đề hoặc kết nối nó với một lĩnh vực khác thay vì chỉ mở rộng số lượng nội dung.'}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">10 lĩnh vực trên hành trình của bạn</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {domainStats.map(({ domain, touched, completed, needsReview }) => (
            <button key={domain.id} type="button" onClick={() => onOpenDomain(domain.id)} className="rounded-xl border border-slate-200 p-4 text-left transition-colors hover:border-teal-600 hover:bg-teal-50/30 cursor-pointer">
              <div className="flex items-center justify-between gap-3"><span className="font-semibold text-slate-900">{domain.shortTitle}</span><ArrowRight className="h-4 w-4 text-slate-400" /></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-600" style={{ width: `${Math.min(100, (touched / Math.max(1, domain.topics.length)) * 100)}%` }} /></div>
              <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-slate-500"><span>Đã chạm: {touched}/{domain.topics.length}</span><span>Vận dụng: {completed}</span>{needsReview > 0 && <span className="text-amber-700">Cần xem lại: {needsReview}</span>}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-teal-100 bg-teal-50/50 p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-teal-800">Bước tiếp theo gợi ý</div>
          <h2 className="mt-2 text-lg font-bold text-slate-900">Tiếp tục đào sâu: {nextDomain.shortTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Gợi ý này dựa trên lĩnh vực bạn đã chạm tới nhiều nhất. Bạn luôn có thể chọn một hướng khác nếu mục tiêu hiện tại của bạn thay đổi.</p>
          <button type="button" onClick={() => onOpenDomain(nextDomain.id)} className="mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 cursor-pointer">Mở lộ trình <ArrowRight className="h-4 w-4" /></button>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Ôn lại có chủ đích</div>
          {reviewTopics.length === 0 ? <p className="mt-3 text-sm text-slate-600">Chưa có chủ đề nào được đánh dấu cần ôn. Khi gặp một nội dung khó, hãy đánh dấu trong bài học để bản đồ này nhắc bạn quay lại.</p> : <div className="mt-3 space-y-2">{reviewTopics.map((record) => <button key={record.topicId} type="button" onClick={() => onOpenLesson(record.domainId, record.topicId)} className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-3 text-left text-sm font-medium hover:bg-slate-50 cursor-pointer"><span>{LEARNING_DOMAINS.find((d) => d.id === record.domainId)?.topics.find((t) => t.id === record.topicId)?.title ?? record.topicId}</span><ArrowRight className="h-4 w-4 text-slate-400" /></button>)}</div>}
        </article>
      </section>
    </div>
  );
}
