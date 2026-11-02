import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Compass,
  HelpCircle,
  Loader2,
  Scale,
  Send,
  Trash2,
  Zap,
} from 'lucide-react';
import { LEARNING_DOMAINS } from '../data/curriculum';
import { ChatMessage, MentorMode } from '../types/mentor';
import { streamMentorChat } from '../services/mentorApi';
import { INITIAL_WELCOME_CHAT } from '../services/storageLayer';
import { RichTextRenderer } from './RichTextRenderer';

interface AIMentorViewProps {
  selectedDomainId: string;
  onSelectDomain: (domainId: string) => void;
  mentorMode: MentorMode;
  onChangeMode: (mode: MentorMode) => void;
  chatMessages: ChatMessage[];
  onUpdateChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  learnerMemoryContext: string;
  onRecordUserQuestion: (domainId: string, question: string) => void;
  pendingPrompt: string | null;
  onClearPendingPrompt: () => void;
}

const MODE_CONFIG: {
  mode: MentorMode;
  label: string;
  shortDesc: string;
  starterPrompt: (domainTitle: string) => string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    mode: MentorMode.TEACHING,
    label: 'Giảng dạy',
    shortDesc: 'Giải thích kiến thức từng bước từ gốc rễ, dễ hiểu, có ví dụ thực tế.',
    starterPrompt: (d) =>
      `Hãy giải thích từng bước từ nền tảng dễ hiểu nhất về nguyên lý cốt lõi nhất của lĩnh vực ${d}.`,
    Icon: BookOpen,
  },
  {
    mode: MentorMode.SOCRATIC,
    label: 'Socratic',
    shortDesc: 'Không trả lời ngay; đặt câu hỏi kiểm tra giả định để bạn tự suy luận.',
    starterPrompt: (d) =>
      `Tôi muốn rèn tư duy trong lĩnh vực ${d}. Hãy bắt đầu bằng một câu hỏi Socratic để kiểm tra giả định hiện tại của tôi.`,
    Icon: HelpCircle,
  },
  {
    mode: MentorMode.CRITIQUE,
    label: 'Phản biện',
    shortDesc: 'Đóng vai góc nhìn đối lập, tìm điểm yếu lập luận và đưa phản ví dụ.',
    starterPrompt: (d) =>
      `Tôi sẽ nêu một quan điểm của tôi liên quan đến ${d}, hãy đóng vai người phản biện điềm tĩnh chỉ ra điểm yếu và phản ví dụ.`,
    Icon: Scale,
  },
  {
    mode: MentorMode.APPLICATION,
    label: 'Ứng dụng',
    shortDesc: 'Chuyển hóa kiến thức vào công việc, học tập, tài chính và quyết định cá nhân.',
    starterPrompt: (d) =>
      `Làm thế nào để áp dụng một nguyên lý của ${d} vào một quyết định công việc hoặc tài chính thực tế trong tuần này?`,
    Icon: Zap,
  },
];

export function AIMentorView({
  selectedDomainId,
  onSelectDomain,
  mentorMode,
  onChangeMode,
  chatMessages,
  onUpdateChatMessages,
  learnerMemoryContext,
  onRecordUserQuestion,
  pendingPrompt,
  onClearPendingPrompt,
}: AIMentorViewProps) {
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const activeDomain =
    LEARNING_DOMAINS.find((d) => d.id === selectedDomainId) || LEARNING_DOMAINS[0];
  const activeModeConfig =
    MODE_CONFIG.find((c) => c.mode === mentorMode) || MODE_CONFIG[1];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isStreaming]);

  const sendMessage = async (overrideText?: string) => {
    const content = (overrideText ?? input).trim();
    if (!content || isStreaming) return;

    if (!overrideText) {
      setInput('');
    }

    onRecordUserQuestion(activeDomain.id, content);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content,
      mode: mentorMode,
      domainId: activeDomain.id,
      timestamp: new Date().toISOString(),
    };
    const mentorId = `m-${Date.now() + 1}`;
    const placeholderMsg: ChatMessage = {
      id: mentorId,
      role: 'mentor',
      content: '',
      mode: mentorMode,
      domainId: activeDomain.id,
      timestamp: new Date().toISOString(),
    };

    const apiHistory = [...chatMessages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    onUpdateChatMessages((prev) => [...prev, userMsg, placeholderMsg]);
    setIsStreaming(true);

    try {
      await streamMentorChat({
        messages: apiHistory,
        activeDomainTitle: activeDomain.title,
        learnerContext: learnerMemoryContext,
        mentorMode,
        onChunk: (chunk) => {
          onUpdateChatMessages((prev) =>
            prev.map((m) => (m.id === mentorId ? { ...m, content: m.content + chunk } : m))
          );
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối với AI Mentor.';
      onUpdateChatMessages((prev) =>
        prev.map((m) => (m.id === mentorId ? { ...m, content: `⚠️ ${msg}` } : m))
      );
    } finally {
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (pendingPrompt && !isStreaming) {
      const text = pendingPrompt;
      onClearPendingPrompt();
      sendMessage(text);
    }
  }, [pendingPrompt]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Không gian Cố vấn Tư duy Cá nhân</span>
            <span aria-hidden="true">·</span>
            <span>4 chế độ sư phạm chuyên biệt</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            AI Mentor — Đối thoại Rèn luyện Tư duy Độc lập
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            aria-label="Chọn lĩnh vực đối thoại"
            value={activeDomain.id}
            onChange={(e) => onSelectDomain(e.target.value)}
            className="min-h-[42px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-teal-700 focus:outline-none"
          >
            {LEARNING_DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.indexLabel}. {d.shortTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Modes Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {MODE_CONFIG.map(({ mode, label, shortDesc, Icon }) => {
          const active = mode === mentorMode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChangeMode(mode)}
              className={`min-h-[56px] text-left p-4 rounded-2xl border transition-colors cursor-pointer ${
                active
                  ? 'bg-teal-900/5 border-teal-700 text-slate-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? 'text-teal-700' : 'text-slate-400'
                  }`}
                />
                <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
                  Chế độ {label}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                {shortDesc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Chat Viewport */}
      <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-[620px] max-h-[75vh]">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600 truncate">
            Đang hoạt động ở <strong className="text-slate-900">Chế độ {activeModeConfig.label}</strong> · Lĩnh vực: <strong className="text-slate-900">{activeDomain.shortTitle}</strong>
          </div>
          <button
            type="button"
            onClick={() => onUpdateChatMessages([INITIAL_WELCOME_CHAT])}
            className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa hội thoại</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="text-[11px] text-slate-400 mb-1 px-1">
                {msg.role === 'user'
                  ? 'Bạn'
                  : `AI Mentor${
                      msg.mode
                        ? ` · ${
                            MODE_CONFIG.find((c) => c.mode === msg.mode)?.label || 'Socratic'
                          }`
                        : ''
                    }`}
              </div>
              <div
                className={`max-w-[92%] sm:max-w-[82%] rounded-2xl px-4 py-3.5 text-sm ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                ) : msg.content ? (
                  <RichTextRenderer text={msg.content} />
                ) : (
                  <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
                    <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
                    <span>AI Mentor đang phân tích và chuẩn bị phản hồi...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Contextual Prompt Suggestion */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/70 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            disabled={isStreaming}
            onClick={() => sendMessage(activeModeConfig.starterPrompt(activeDomain.shortTitle))}
            className="min-h-[36px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:border-teal-700 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Gợi ý theo chế độ {activeModeConfig.label}
          </button>
          {activeDomain.socraticPrompts.slice(0, 2).map((p, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isStreaming}
              onClick={() => sendMessage(p)}
              className="min-h-[36px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 hover:border-teal-700 truncate max-w-[260px] shrink-0 cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="p-3 sm:p-4 border-t border-slate-200 flex items-end gap-2.5"
        >
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Nhập câu hỏi, lập luận hoặc tình huống thực tế của bạn (Chế độ ${activeModeConfig.label})...`}
            className="flex-1 resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-50 transition-colors shrink-0 cursor-pointer"
            aria-label="Gửi tin nhắn"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
