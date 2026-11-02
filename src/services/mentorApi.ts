import {
  CriticalThinkingAnalysis,
  EvaluationResult,
  JournalAIInsight,
  JournalEntry,
  KnowledgeLevel,
  MentorMode,
  PersonalizedRoadmap,
  RemedialSupport,
  StructuredLesson,
  ThinkingDrillFeedback,
  ThinkingDrillType,
} from '../types/mentor';

export async function generatePersonalizedRoadmap(params: {
  domainId: string;
  domainTitle: string;
  currentLevel: KnowledgeLevel;
  longTermGoal: string;
  dailyMinutes: number;
  availableTopics: { id: string; title: string }[];
}): Promise<PersonalizedRoadmap> {
  const res = await fetch('/api/mentor/roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Không thể tạo lộ trình học cá nhân hóa.');
  }
  return {
    domainId: params.domainId,
    domainTitle: params.domainTitle,
    currentLevel: params.currentLevel,
    longTermGoal: params.longTermGoal,
    dailyMinutes: params.dailyMinutes,
    mentorGreeting: data.mentorGreeting,
    coreStrategy: data.coreStrategy,
    antiDependencyReminder: data.antiDependencyReminder,
    recommendedFirstTopicId: data.recommendedFirstTopicId,
    milestones: data.milestones || [],
    createdAt: new Date().toISOString(),
  };
}

export async function generateStructuredLesson(params: {
  domainId: string;
  domainTitle: string;
  topicId: string;
  topicTitle: string;
  topicSummary: string;
  epistemicGuardrail: string;
  userLevel?: string;
  dailyMinutes?: number;
  userGoal?: string;
}): Promise<StructuredLesson> {
  const res = await fetch('/api/mentor/lesson', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Không thể biên soạn bài học lúc này.');
  }
  return data as StructuredLesson;
}

export async function generateRemedialSupport(params: {
  domainTitle: string;
  topicTitle: string;
  confusionNote?: string;
}): Promise<RemedialSupport> {
  const res = await fetch('/api/mentor/simplify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Không thể tạo gợi ý đơn giản hóa lúc này.');
  }
  return data as RemedialSupport;
}

export async function evaluateLearnerReflection(params: {
  domainTitle: string;
  topicTitle: string;
  socraticQuestions: string[];
  exerciseInstructions: string;
  learnerResponse: string;
}): Promise<EvaluationResult> {
  const res = await fetch('/api/mentor/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Không thể đánh giá phần thực hành lúc này.');
  }
  return data as EvaluationResult;
}

export async function analyzeCriticalThinking(params: {
  statement: string;
  userInitialThoughts?: string;
}): Promise<CriticalThinkingAnalysis> {
  const res = await fetch('/api/mentor/critical-thinking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Không thể phân tích tuyên bố lúc này.');
  }
  return data as CriticalThinkingAnalysis;
}

export async function evaluateThinkingDrill(params: {
  drillType: ThinkingDrillType;
  scenarioTitle: string;
  promptText: string;
  userSubmission: Record<string, string>;
}): Promise<ThinkingDrillFeedback> {
  const res = await fetch('/api/mentor/thinking-drill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Không thể chấm bài luyện tư duy lúc này.');
  }
  return data as ThinkingDrillFeedback;
}

export async function reflectOnJournalEntries(
  entries: JournalEntry[]
): Promise<JournalAIInsight> {
  const res = await fetch('/api/mentor/journal-reflect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entries }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Không thể tạo góc nhìn phản tư lúc này.');
  }
  return data as JournalAIInsight;
}

export async function streamMentorChat(params: {
  messages: { role: 'user' | 'mentor'; content: string }[];
  activeDomainTitle?: string;
  learnerContext?: string;
  mentorMode?: MentorMode;
  onChunk: (chunkText: string) => void;
}): Promise<void> {
  const res = await fetch('/api/mentor/chat-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: params.messages,
      activeDomainTitle: params.activeDomainTitle,
      learnerContext: params.learnerContext,
      mentorMode: params.mentorMode || MentorMode.SOCRATIC,
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error('Không thể kết nối luồng đối thoại cùng AI Mentor.');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n\n');
    buffer = lines.pop() ?? '';

    for (const block of lines) {
      const trimmed = block.trim();
      if (!trimmed.startsWith('data:')) continue;
      const jsonStr = trimmed.replace(/^data:\s*/, '');
      if (!jsonStr) continue;
      const payload = JSON.parse(jsonStr) as { text?: string; done?: boolean; error?: string };
      if (payload.error) {
        throw new Error(payload.error);
      }
      if (payload.text) {
        params.onChunk(payload.text);
      }
    }
  }
}
