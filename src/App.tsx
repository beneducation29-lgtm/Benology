/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { LEARNING_DOMAINS } from './data/curriculum';
import {
  ChatMessage,
  GoalsState,
  JournalEntry,
  LearningMemoryItem,
  MasteryStatus,
  MemoryCategory,
  MentorMode,
  PersonalizedRoadmap,
  SmartReviewState,
  StructuredLesson,
  TopicProgressRecord,
  UnderstandingLevel,
} from './types/mentor';
import {
  buildMemorySummaryForAI,
  getInitialGoalsState,
  getTodayISO,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_MEMORY_ITEMS,
  INITIAL_WELCOME_CHAT,
  loadStorageItem,
  normalizeProgressMap,
  saveStorageItem,
  STORAGE_KEYS,
} from './services/storageLayer';
import { DashboardView } from './components/DashboardView';
import { ExploreKnowledgeView } from './components/ExploreKnowledgeView';
import { LessonWorkspaceView } from './components/LessonWorkspaceView';
import { AIMentorView } from './components/AIMentorView';
import { ThinkingLabModuleView } from './components/ThinkingLabModuleView';
import { ReflectionJournalView } from './components/ReflectionJournalView';
import { PersonalProgressView } from './components/PersonalProgressView';
import { KnowledgeConnectionsView } from './components/KnowledgeConnectionsView';

type AppModule =
  | 'dashboard'
  | 'explore'
  | 'lesson'
  | 'mentor'
  | 'thinking-lab'
  | 'journal'
  | 'progress'
  | 'connections';

export default function App() {
  const [activeModule, setActiveModule] = useState<AppModule>('dashboard');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('philosophy');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('phil-what-is');
  const [mentorMode, setMentorMode] = useState<MentorMode>(MentorMode.SOCRATIC);
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);

  // Preserved & Extended Persistent Data Layer
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(() =>
    loadStorageItem<PersonalizedRoadmap | null>(STORAGE_KEYS.ROADMAP, null)
  );

  const [goals, setGoals] = useState<GoalsState>(() => getInitialGoalsState(roadmap));

  const [progressMap, setProgressMap] = useState<Record<string, TopicProgressRecord>>(() =>
    normalizeProgressMap(
      loadStorageItem<Record<string, TopicProgressRecord>>(STORAGE_KEYS.PROGRESS, {
        'phil-what-is': {
          topicId: 'phil-what-is',
          domainId: 'philosophy',
          status: MasteryStatus.LEARNING,
          understandingLevel: UnderstandingLevel.READ,
          reviewState: SmartReviewState.LEARNING,
          lastStudiedAt: '2026-11-01T08:00:00.000Z',
        },
        'ct-claims-assumptions': {
          topicId: 'ct-claims-assumptions',
          domainId: 'critical-thinking',
          status: MasteryStatus.BASIC_UNDERSTANDING,
          understandingLevel: UnderstandingLevel.BASIC,
          reviewState: SmartReviewState.PRACTICING,
          lastStudiedAt: '2026-11-01T08:00:00.000Z',
        },
      })
    )
  );

  const [cachedLessons, setCachedLessons] = useState<Record<string, StructuredLesson>>(() =>
    loadStorageItem<Record<string, StructuredLesson>>(STORAGE_KEYS.LESSONS, {})
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    loadStorageItem<ChatMessage[]>(STORAGE_KEYS.CHAT, [INITIAL_WELCOME_CHAT])
  );

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() =>
    loadStorageItem<JournalEntry[]>(STORAGE_KEYS.JOURNAL, INITIAL_JOURNAL_ENTRIES)
  );

  const [memoryItems, setMemoryItems] = useState<LearningMemoryItem[]>(() =>
    loadStorageItem<LearningMemoryItem[]>(STORAGE_KEYS.MEMORY, INITIAL_MEMORY_ITEMS)
  );

  const [memoryEnabled, setMemoryEnabled] = useState<boolean>(() =>
    loadStorageItem<boolean>(STORAGE_KEYS.MEMORY_ENABLED, true)
  );

  // Sync changes to localStorage safely
  useEffect(() => {
    if (roadmap) saveStorageItem(STORAGE_KEYS.ROADMAP, roadmap);
  }, [roadmap]);

  useEffect(() => {
    saveStorageItem(STORAGE_KEYS.GOALS, goals);
  }, [goals]);

  useEffect(() => {
    saveStorageItem(STORAGE_KEYS.PROGRESS, progressMap);
  }, [progressMap]);

  useEffect(() => {
    saveStorageItem(STORAGE_KEYS.LESSONS, cachedLessons);
  }, [cachedLessons]);

  useEffect(() => {
    saveStorageItem(STORAGE_KEYS.CHAT, chatMessages.slice(-35));
  }, [chatMessages]);

  useEffect(() => {
    saveStorageItem(STORAGE_KEYS.JOURNAL, journalEntries);
  }, [journalEntries]);

  useEffect(() => {
    saveStorageItem(STORAGE_KEYS.MEMORY, memoryItems);
  }, [memoryItems]);

  useEffect(() => {
    saveStorageItem(STORAGE_KEYS.MEMORY_ENABLED, memoryEnabled);
  }, [memoryEnabled]);

  const learnerMemorySummary = useMemo(
    () => buildMemorySummaryForAI(memoryItems, progressMap, goals),
    [memoryItems, progressMap, goals]
  );

  // Handlers
  const handleLogStudyMinutes = (minutesToAdd: number, lessonsIncrement = 0) => {
    const today = getTodayISO();
    setGoals((prev) => {
      const existing = prev.dailyLogs[today] || {
        dateISO: today,
        minutes: 0,
        lessonsTouched: 0,
      };
      return {
        ...prev,
        dailyLogs: {
          ...prev.dailyLogs,
          [today]: {
            dateISO: today,
            minutes: existing.minutes + minutesToAdd,
            lessonsTouched: existing.lessonsTouched + lessonsIncrement,
          },
        },
      };
    });
  };

  const handleAddMemoryItem = (
    category: MemoryCategory,
    content: string,
    domainId?: string
  ) => {
    setMemoryItems((prev) => {
      if (prev.some((m) => m.content === content)) return prev;
      return [
        {
          id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          category,
          content,
          domainId,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 50);
    });
  };

  const handleOpenLesson = (domainId: string, topicId: string) => {
    setSelectedDomainId(domainId);
    setSelectedTopicId(topicId);
    setActiveModule('lesson');
    handleLogStudyMinutes(5, 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreDomain = (domainId: string) => {
    setSelectedDomainId(domainId);
    setActiveModule('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAIMentor = (
    domainId?: string,
    prompt?: string,
    mode?: MentorMode
  ) => {
    if (domainId && LEARNING_DOMAINS.some((d) => d.id === domainId)) {
      setSelectedDomainId(domainId);
    }
    if (mode) {
      setMentorMode(mode);
    }
    if (prompt) {
      setPendingChatPrompt(prompt);
    }
    setActiveModule('mentor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProgress = (
    domainId: string,
    topicId: string,
    updates: Partial<TopicProgressRecord>
  ) => {
    setProgressMap((prev) => {
      const existing = prev[topicId];
      return {
        ...prev,
        [topicId]: {
          topicId,
          domainId,
          status: updates.status ?? existing?.status ?? MasteryStatus.LEARNING,
          understandingLevel:
            updates.understandingLevel ??
            existing?.understandingLevel ??
            UnderstandingLevel.READ,
          reviewState:
            updates.reviewState ?? existing?.reviewState ?? SmartReviewState.LEARNING,
          isDifficult: updates.isDifficult ?? existing?.isDifficult,
          lastStudiedAt: new Date().toISOString(),
          selfExplanationNote:
            updates.selfExplanationNote !== undefined
              ? updates.selfExplanationNote
              : existing?.selfExplanationNote,
          lastEvaluation:
            updates.lastEvaluation !== undefined
              ? updates.lastEvaluation
              : existing?.lastEvaluation,
          remedialSupport:
            updates.remedialSupport !== undefined
              ? updates.remedialSupport
              : existing?.remedialSupport,
        },
      };
    });
  };

  // Top Bar Zone 2 links (5 primary views) + Zone 3 Primary CTA (AI Mentor) = all 6 core modules!
  const desktopNavLinks: { id: AppModule; label: string }[] = [
    { id: 'dashboard', label: 'Trang chủ' },
    { id: 'explore', label: 'Khám phá' },
    { id: 'thinking-lab', label: 'Luyện tư duy' },
    { id: 'connections', label: 'Kết nối kiến thức' },
    { id: 'journal', label: 'Nhật ký' },
    { id: 'progress', label: 'Hồ sơ' },
  ];

  const mobileNavItems: { id: AppModule; label: string }[] = [
    { id: 'dashboard', label: 'Trang chủ' },
    { id: 'explore', label: 'Khám phá' },
    { id: 'mentor', label: 'AI Mentor' },
    { id: 'thinking-lab', label: 'Tư duy' },
    { id: 'connections', label: 'Kết nối' },
    { id: 'journal', label: 'Nhật ký' },
    { id: 'progress', label: 'Hồ sơ' },
  ];

  const isExploreOrLesson = activeModule === 'explore' || activeModule === 'lesson';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              setActiveModule('dashboard');
            }}
            className="text-lg sm:text-xl font-bold font-editorial tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Personal Growth AI
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {desktopNavLinks.map((item) => {
              const active =
                item.id === 'explore' ? isExploreOrLesson : activeModule === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveModule(item.id);
                  }}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-slate-900 font-semibold underline decoration-teal-700 decoration-2 underline-offset-8'
                      : 'hover:text-slate-900 hover:underline underline-offset-8'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action (Module 3: AI Mentor) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveModule('mentor')}
              className={`min-h-[40px] px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeModule === 'mentor'
                  ? 'bg-slate-900 text-white'
                  : 'bg-teal-700 text-white hover:bg-teal-800'
              }`}
            >
              AI Mentor
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Mobile-First Touch Navigation across all 6 Areas */}
        <nav
          aria-label="Điều hướng di động"
          className="flex md:hidden items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto"
        >
          {mobileNavItems.map((item) => {
            const active =
              item.id === 'explore' ? isExploreOrLesson : activeModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveModule(item.id)}
                className={`min-h-[42px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {activeModule === 'dashboard' && (
          <DashboardView
            goals={goals}
            onUpdateGoals={setGoals}
            onLogStudyMinutes={(mins) => handleLogStudyMinutes(mins, 0)}
            progressMap={progressMap}
            roadmap={roadmap}
            onSaveRoadmap={setRoadmap}
            onContinueTopic={handleOpenLesson}
            onExploreDomain={handleExploreDomain}
            onOpenAIMentor={(domainId, prompt) =>
              handleOpenAIMentor(domainId, prompt, MentorMode.SOCRATIC)
            }
          />
        )}

        {activeModule === 'explore' && (
          <ExploreKnowledgeView
            selectedDomainId={selectedDomainId}
            onSelectDomain={setSelectedDomainId}
            progressMap={progressMap}
            onOpenLesson={handleOpenLesson}
            onAskAIMentor={(domainId, prompt) =>
              handleOpenAIMentor(domainId, prompt, MentorMode.SOCRATIC)
            }
          />
        )}

        {activeModule === 'lesson' && (
          <LessonWorkspaceView
            activeDomainId={selectedDomainId}
            activeTopicId={selectedTopicId}
            onChangeTopic={(domainId, topicId) => {
              setSelectedDomainId(domainId);
              setSelectedTopicId(topicId);
            }}
            onBackToLearningPath={() => setActiveModule('explore')}
            onOpenAIMentorWithContext={(domainId, prompt, mode) =>
              handleOpenAIMentor(domainId, prompt, mode)
            }
            roadmap={roadmap}
            cachedLessons={cachedLessons}
            onCacheLesson={(topicId, lesson) =>
              setCachedLessons((prev) => ({ ...prev, [topicId]: lesson }))
            }
            progressMap={progressMap}
            onUpdateProgress={handleUpdateProgress}
            onRecordCompletedExercise={(domainId, summary) => {
              handleLogStudyMinutes(10, 0);
              if (memoryEnabled) {
                handleAddMemoryItem('completed_exercise', summary, domainId);
              }
            }}
            onRecordDifficultTopic={(domainId, topicTitle) => {
              if (memoryEnabled) {
                handleAddMemoryItem(
                  'difficult_topic',
                  `Cần ôn tập thêm chuyên đề: "${topicTitle}"`,
                  domainId
                );
              }
            }}
          />
        )}

        {activeModule === 'mentor' && (
          <AIMentorView
            selectedDomainId={selectedDomainId}
            onSelectDomain={setSelectedDomainId}
            mentorMode={mentorMode}
            onChangeMode={setMentorMode}
            chatMessages={chatMessages}
            onUpdateChatMessages={setChatMessages}
            learnerMemoryContext={learnerMemorySummary}
            onRecordUserQuestion={(domainId, question) => {
              if (memoryEnabled && question.length >= 12) {
                handleAddMemoryItem(
                  'question_asked',
                  question.slice(0, 180),
                  domainId
                );
              }
            }}
            pendingPrompt={pendingChatPrompt}
            onClearPendingPrompt={() => setPendingChatPrompt(null)}
          />
        )}

        {activeModule === 'thinking-lab' && (
          <ThinkingLabModuleView
            onSendToMentorChat={(domainId, prompt, mode) =>
              handleOpenAIMentor(domainId, prompt, mode)
            }
            onRecordCompletedExercise={(domainId, summary) => {
              handleLogStudyMinutes(10, 0);
              if (memoryEnabled) {
                handleAddMemoryItem('completed_exercise', summary, domainId);
              }
            }}
          />
        )}

        {activeModule === 'journal' && (
          <ReflectionJournalView
            entries={journalEntries}
            onSaveEntry={(entry) =>
              setJournalEntries((prev) => {
                const exists = prev.some((x) => x.id === entry.id);
                if (exists) {
                  return prev.map((x) => (x.id === entry.id ? entry : x));
                }
                return [entry, ...prev];
              })
            }
            onDeleteEntry={(id) =>
              setJournalEntries((prev) => prev.filter((x) => x.id !== id))
            }
            onDiscussInMentor={(domainId, prompt, mode) =>
              handleOpenAIMentor(domainId, prompt, mode)
            }
          />
        )}

        {activeModule === 'connections' && (
          <KnowledgeConnectionsView
            progressMap={progressMap}
            onOpenDomain={handleExploreDomain}
            onOpenLesson={handleOpenLesson}
          />
        )}

        {activeModule === 'progress' && (
          <PersonalProgressView
            goals={goals}
            progressMap={progressMap}
            onOpenLesson={handleOpenLesson}
            onUpdateProgress={handleUpdateProgress}
            memoryItems={memoryItems}
            memoryEnabled={memoryEnabled}
            onToggleMemoryEnabled={setMemoryEnabled}
            onAddMemoryItem={(cat, content) => handleAddMemoryItem(cat, content)}
            onEditMemoryItem={(id, content) =>
              setMemoryItems((prev) =>
                prev.map((m) => (m.id === id ? { ...m, content } : m))
              )
            }
            onDeleteMemoryItem={(id) =>
              setMemoryItems((prev) => prev.filter((m) => m.id !== id))
            }
            onClearAllMemory={() => setMemoryItems([])}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Personal Growth AI — Học sâu hơn · Nghĩ độc lập · Sống tốt hơn.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setActiveModule('dashboard')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Trang chủ
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveModule('explore')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Lộ trình 5 Cấp độ
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveModule('thinking-lab')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Thinking Lab
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveModule('journal')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Nhật ký Phản tư
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
