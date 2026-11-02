import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import type { GenerateContentResponse } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const MODEL_NAME = 'gemini-3.8-flash';

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const CORE_MENTOR_SYSTEM_INSTRUCTION = `Bạn là PERSONAL GROWTH AI – hệ thống cố vấn và gia sư cá nhân giúp người dùng Học sâu hơn – Nghĩ độc lập – Sống tốt hơn qua 10 lĩnh vực cốt lõi.

NGÔN NGỮ CHÍNH: Tiếng Việt rõ ràng, mạch lạc, sâu sắc và dễ hiểu.
Khi sử dụng thuật ngữ chuyên môn, bạn BẮT BUỘC:
1. Giải thích bằng ngôn ngữ đời thường đơn giản.
2. Đưa ra ví dụ thực tế gần gũi.
3. Nêu rõ thuật ngữ gốc bằng tiếng Anh.

MỤC TIÊU TỐI THƯỢNG:
- Không chỉ đưa câu trả lời ăn sẵn. Giúp người học hiểu vấn đề từ gốc rễ, biết tự đặt câu hỏi, suy nghĩ độc lập, liên kết kiến thức đa ngành, biến kiến thức thành hành động và xây dựng năng lực tự học không phụ thuộc vào AI.

NGUYÊN TẮC VỀ SỰ THẬT VÀ NỘI DUNG AI (BẮT BUỘC):
1. Không bịa thông tin, không bịa nguồn nghiên cứu hay số liệu.
2. Phân biệt rõ giữa SỰ THẬT thực nghiệm, GIẢ THUYẾT khoa học, QUAN ĐIỂM / HỆ GIÁ TRỊ, SUY ĐOÁN và THÔNG TIN chưa đủ dữ liệu.
3. Nêu rõ mức độ chắc chắn khi cần thiết ("Dựa trên bằng chứng hiện tại...", "Điều này đúng trong điều kiện...", "Tôi chưa có đủ cơ sở để khẳng định điều này.").
4. Trình bày nhiều góc nhìn đối với các vấn đề còn tranh luận.

QUY TẮC ĐẶC THÙ BẮT BUỘC:
- TÀI CHÍNH: Chỉ mang tính giáo dục nền tảng; tuyệt đối không hứa hẹn lợi nhuận, không khẳng định tài sản nào chắc chắn tăng giá, luôn giải thích rủi ro.
- THUẾ: Luật thuế phụ thuộc quốc gia và thời điểm hiệu lực; luôn yêu cầu xác định quốc gia và năm áp dụng khi bàn quy định cụ thể; phân biệt tối ưu hợp pháp và trốn thuế bất hợp pháp.
- TÂM LÝ HỌC & NHẬT KÝ: Tuyệt đối không chẩn đoán bệnh lý, không tự động kết luận về tính cách hay sức khỏe tâm lý của người dùng.
- THUYẾT PHỤC: Phân biệt rõ thuyết phục lành mạnh (tôn trọng quyền lựa chọn, trung thực) và thao túng.`;

const MENTOR_MODE_INSTRUCTIONS: Record<string, string> = {
  teaching: `CHẾ ĐỘ HIỆN TẠI: CHẾ ĐỘ GIẢNG DẠY (Step-by-Step Teaching).
- Giải thích kiến thức từng bước rõ ràng, từ khái niệm nền tảng đến cơ chế vận hành sâu bên dưới.
- Sử dụng ví dụ thực tế dễ hình dung và kết thúc bằng 1 câu hỏi nhỏ để người học tự kiểm tra độ hiểu.`,
  socratic: `CHẾ ĐỘ HIỆN TẠI: CHẾ ĐỘ SOCRATIC (Socratic Questioning).
- TUYỆT ĐỐI KHÔNG trả lời hộ ngay lập tức khi người dùng có thể tự suy luận.
- Đặt câu hỏi gợi mở từng bước, kiểm tra giả định ngầm phía sau câu nói của người dùng và yêu cầu người dùng giải thích suy nghĩ của họ trước.`,
  critique: `CHẾ ĐỘ HIỆN TẠI: CHẾ ĐỘ PHẢN BIỆN (Constructive Devil's Advocate).
- Đóng vai một người đối thoại thông minh, điềm tĩnh có quan điểm khác.
- Tìm điểm yếu hoặc mắt xích thiếu bằng chứng trong lập luận của người dùng, đưa ra phản ví dụ thực tế và đặt câu hỏi khó.
- Không cố gắng "chiến thắng" hay áp đảo người dùng; mục tiêu duy nhất là nâng cao chất lượng tư duy của họ.`,
  application: `CHẾ ĐỘ HIỆN TẠI: CHẾ ĐỘ ỨNG DỤNG (Practical Action & Transfer).
- Giúp người dùng chuyển hóa nguyên lý lý thuyết thành khung hành động cụ thể trong công việc, học tập, quản lý tài chính hoặc quyết định cá nhân.
- Phân tích các phương án, điều kiện áp dụng, rủi ro thực tế và bước thử nghiệm nhỏ có thể làm ngay hôm nay.`,
};

function formatApiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (
    raw.includes('GEMINI_API_KEY_MISSING') ||
    raw.includes('API_KEY_INVALID') ||
    raw.includes('403') ||
    raw.includes('PERMISSION_DENIED')
  ) {
    return {
      status: 403,
      message:
        'Chưa thể kết nối với dịch vụ AI. Vui lòng kiểm tra khóa API của ứng dụng trong bảng Settings > Secrets.',
    };
  }
  if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message:
        'Đã vượt giới hạn lưu lượng truy cập tạm thời (Quota). Bạn có thể thử lại sau ít giây hoặc nâng cấp hạn mức khóa API trong Settings > Secrets.',
    };
  }
  return {
    status: 500,
    message: `Đã xảy ra lỗi khi xử lý yêu cầu từ Cố vấn AI: ${raw}`,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // 1. Personalized Learning Roadmap (Preserved & Compatible)
  app.post('/api/mentor/roadmap', async (req: Request, res: Response) => {
    try {
      const { domainId, domainTitle, currentLevel, longTermGoal, dailyMinutes, availableTopics } =
        req.body as {
          domainId: string;
          domainTitle: string;
          currentLevel: string;
          longTermGoal: string;
          dailyMinutes: number;
          availableTopics: { id: string; title: string }[];
        };

      const ai = getGenAIClient();
      const topicsText = (availableTopics || [])
        .map((t) => `- ID: "${t.id}" | Chủ đề: ${t.title}`)
        .join('\n');

      const prompt = `Người học thiết lập lộ trình học tập cá nhân hóa:
1. Lĩnh vực ưu tiên: ${domainTitle} (mã: ${domainId})
2. Mức kiến thức hiện tại: ${currentLevel}
3. Mục tiêu dài hạn: ${longTermGoal}
4. Quỹ thời gian học mỗi ngày: ${dailyMinutes} phút/ngày

Danh sách các chủ đề con trong lĩnh vực này:
${topicsText}

Hãy thiết kế lộ trình cá nhân hóa gồm 4 chặng tiến bộ từ Foundation đến Independent Thinking, chọn đúng 1 mã ID chủ đề đầu tiên phù hợp làm "recommendedFirstTopicId".`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: CORE_MENTOR_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mentorGreeting: { type: Type.STRING },
              coreStrategy: { type: Type.STRING },
              antiDependencyReminder: { type: Type.STRING },
              recommendedFirstTopicId: { type: Type.STRING },
              milestones: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phaseNumber: { type: Type.INTEGER },
                    phaseTitle: { type: Type.STRING },
                    timeframe: { type: Type.STRING },
                    focusTopics: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    dailyPracticeRoutine: { type: Type.STRING },
                    milestoneCheckQuestion: { type: Type.STRING },
                  },
                  required: [
                    'phaseNumber',
                    'phaseTitle',
                    'timeframe',
                    'focusTopics',
                    'dailyPracticeRoutine',
                    'milestoneCheckQuestion',
                  ],
                },
              },
            },
            required: [
              'mentorGreeting',
              'coreStrategy',
              'antiDependencyReminder',
              'recommendedFirstTopicId',
              'milestones',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const formatted = formatApiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 2. Generate 8-Part Structured Lesson (Backward-Compatible with 7-Part Schema)
  app.post('/api/mentor/lesson', async (req: Request, res: Response) => {
    try {
      const {
        domainId,
        domainTitle,
        topicId,
        topicTitle,
        topicSummary,
        epistemicGuardrail,
        userLevel,
        dailyMinutes,
        userGoal,
      } = req.body as {
        domainId: string;
        domainTitle: string;
        topicId: string;
        topicTitle: string;
        topicSummary: string;
        epistemicGuardrail: string;
        userLevel?: string;
        dailyMinutes?: number;
        userGoal?: string;
      };

      const ai = getGenAIClient();
      const prompt = `Hãy biên soạn BÀI HỌC CHUYÊN SÂU THEO ĐÚNG CẤU TRÚC 8 PHẦN cho chủ đề sau:
- Lĩnh vực: ${domainTitle} (${domainId})
- Chủ đề: ${topicTitle} (mã: ${topicId})
- Định hướng: ${topicSummary}
- Lưu ý nhận thức luận: ${epistemicGuardrail}
- Trình độ người học: ${userLevel || 'Cơ bản'}
- Thời lượng mục tiêu: ${dailyMinutes || 20} phút
${userGoal ? `- Mục tiêu dài hạn: ${userGoal}` : ''}

Đảm bảo đủ 8 phần rõ ràng:
1. Câu hỏi mở đầu (openingQuestion): Một câu hỏi tình huống gợi tò mò trước khi vào lý thuyết.
2. Khái niệm cốt lõi (part1Intro + terminology): Giải thích đơn giản, sáng rõ, kèm 2-4 thuật ngữ chuyên môn có tiếng Anh và ví dụ.
3. Đào sâu (part2Essence): Nguyên nhân, cơ chế vận hành và mối liên hệ liên ngành.
4. Ví dụ thực tế (part3Examples): 3 ví dụ từ cuộc sống, công việc/kinh doanh, xã hội/lịch sử.
5. Góc nhìn đối lập (part4CounterPerspectives): Ít nhất 2 góc nhìn phản biện/tranh luận hoặc giới hạn điều kiện áp dụng.
6. Câu hỏi suy nghĩ (part5SocraticQuestions): 3-4 câu hỏi để người học tự suy luận.
7. Bài tập thực hành (part6ActionExercise): Một hoạt động thực tế nhỏ có thể thực hiện ngay.
8. Tóm tắt (part7Summary): Điều quan trọng nhất, điều cần suy nghĩ thêm và một hành động cụ thể.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: CORE_MENTOR_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              domainName: { type: Type.STRING },
              estimatedMinutes: { type: Type.INTEGER },
              openingQuestion: {
                type: Type.STRING,
                description: '1. Câu hỏi mở đầu khơi gợi tư duy trước khi giải thích khái niệm.',
              },
              epistemicNote: { type: Type.STRING },
              terminology: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    termVi: { type: Type.STRING },
                    termEn: { type: Type.STRING },
                    simpleExplanation: { type: Type.STRING },
                    realWorldExample: { type: Type.STRING },
                  },
                  required: ['termVi', 'termEn', 'simpleExplanation', 'realWorldExample'],
                },
              },
              part1Intro: {
                type: Type.STRING,
                description: '2. Khái niệm cốt lõi: Giải thích đơn giản, rõ ràng.',
              },
              part2Essence: {
                type: Type.STRING,
                description: '3. Đào sâu: Giải thích nguyên nhân, cơ chế và mối liên hệ liên ngành.',
              },
              part3Examples: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    context: { type: Type.STRING },
                    scenario: { type: Type.STRING },
                    insight: { type: Type.STRING },
                  },
                  required: ['context', 'scenario', 'insight'],
                },
              },
              part4CounterPerspectives: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              part5SocraticQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              part6ActionExercise: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                  reflectionCriteria: { type: Type.STRING },
                },
                required: ['title', 'instructions', 'reflectionCriteria'],
              },
              part7Summary: {
                type: Type.OBJECT,
                properties: {
                  keyTakeaways: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  foodForThought: { type: Type.STRING },
                  concreteAction: { type: Type.STRING },
                },
                required: ['keyTakeaways', 'foodForThought', 'concreteAction'],
              },
            },
            required: [
              'title',
              'domainName',
              'estimatedMinutes',
              'openingQuestion',
              'epistemicNote',
              'terminology',
              'part1Intro',
              'part2Essence',
              'part3Examples',
              'part4CounterPerspectives',
              'part5SocraticQuestions',
              'part6ActionExercise',
              'part7Summary',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json({
        ...parsed,
        topicId,
        domainId,
        generatedAt: new Date().toISOString(),
      });
    } catch (err) {
      const formatted = formatApiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 3. Smart Review Remedial Simplifier (When Learner Struggles)
  app.post('/api/mentor/simplify', async (req: Request, res: Response) => {
    try {
      const { domainTitle, topicTitle, confusionNote } = req.body as {
        domainTitle: string;
        topicTitle: string;
        confusionNote?: string;
      };

      const ai = getGenAIClient();
      const prompt = `Người học đang gặp khó khăn và đánh dấu CẦN ÔN LẠI (REVIEW) với chủ đề:
- Lĩnh vực: ${domainTitle}
- Chủ đề: ${topicTitle}
${confusionNote ? `- Điểm người học thấy khó hiểu: "${confusionNote}"` : ''}

Hãy hỗ trợ người học theo nguyên tắc Ôn tập thông minh:
1. Giải thích lại ý cốt lõi bằng phép ẩn dụ đời thường cực kỳ giản dị, không dùng từ hàn lâm phức tạp.
2. Cung cấp một ví dụ hoàn toàn mới, sát với sinh hoạt hàng ngày.
3. Đề xuất một bài tập bước đệm đơn giản hơn nhiều để người học lấy lại đà tự tin.
4. Viết một lời khích lệ nhẹ nhàng, không phán xét.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: CORE_MENTOR_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              simplerExplanation: { type: Type.STRING },
              freshEverydayExample: { type: Type.STRING },
              steppingStoneExercise: { type: Type.STRING },
              encouragementNote: { type: Type.STRING },
            },
            required: [
              'simplerExplanation',
              'freshEverydayExample',
              'steppingStoneExercise',
              'encouragementNote',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const formatted = formatApiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 4. Evaluate Learner's Self-Explanation & Exercise Submission (Preserved)
  app.post('/api/mentor/evaluate', async (req: Request, res: Response) => {
    try {
      const {
        domainTitle,
        topicTitle,
        socraticQuestions,
        exerciseInstructions,
        learnerResponse,
      } = req.body as {
        domainTitle: string;
        topicTitle: string;
        socraticQuestions: string[];
        exerciseInstructions: string;
        learnerResponse: string;
      };

      const ai = getGenAIClient();
      const prompt = `Người học vừa gửi phần tự giải thích và thực hành cho chủ đề:
- Lĩnh vực: ${domainTitle}
- Chủ đề: ${topicTitle}
- Câu hỏi suy nghĩ:
${(socraticQuestions || []).map((q, idx) => `${idx + 1}. ${q}`).join('\n')}
- Bài tập thực hành: ${exerciseInstructions}

BÀI LÀM CỦA NGƯỜI HỌC:
"""
${learnerResponse}
"""

Đánh giá trung thực trên 4 năng lực (Giải thích, Phân tích, Phản biện, Áp dụng). Không tự động coi là thành thạo nếu bài viết chỉ chép lại hoặc còn sơ sài.
Chọn 1 trạng thái phù hợp nhất trong: "ĐANG HỌC", "ĐÃ HIỂU CƠ BẢN", "CÓ THỂ GIẢI THÍCH", "CÓ THỂ ÁP DỤNG", "CẦN ÔN LẠI".`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: CORE_MENTOR_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanationFeedback: { type: Type.STRING },
              analysisFeedback: { type: Type.STRING },
              critiqueFeedback: { type: Type.STRING },
              applicationFeedback: { type: Type.STRING },
              blindSpotsAndAssumptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              followUpSocraticQuestion: { type: Type.STRING },
              recommendedStatus: { type: Type.STRING },
              rationale: { type: Type.STRING },
            },
            required: [
              'explanationFeedback',
              'analysisFeedback',
              'critiqueFeedback',
              'applicationFeedback',
              'blindSpotsAndAssumptions',
              'followUpSocraticQuestion',
              'recommendedStatus',
              'rationale',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const formatted = formatApiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 5. 6-Step Critical Thinking Free Analyzer (Preserved)
  app.post('/api/mentor/critical-thinking', async (req: Request, res: Response) => {
    try {
      const { statement, userInitialThoughts } = req.body as {
        statement: string;
        userInitialThoughts?: string;
      };

      const ai = getGenAIClient();
      const prompt = `Phân tích Tư duy Phản biện 6 Bước cho tuyên bố sau:
"""
${statement}
"""
${
  userInitialThoughts
    ? `Suy nghĩ độc lập ban đầu của người học:\n"""\n${userInitialThoughts}\n"""`
    : ''
}

Thực hiện trọn vẹn 6 bước: (1) Xác định tuyên bố, (2) Kiểm tra giả định, (3) Kiểm tra bằng chứng & phân loại nhận thức luận, (4) Quan điểm đối lập Steelman, (5) Thiên kiến nhận thức, (6) Kết luận có điều kiện và 1 câu hỏi tự quyết định.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: CORE_MENTOR_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              step1CoreClaim: { type: Type.STRING },
              step2HiddenAssumptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              step3EvidenceCheck: {
                type: Type.OBJECT,
                properties: {
                  epistemicType: { type: Type.STRING },
                  sourceStrength: { type: Type.STRING },
                  missingEvidence: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['epistemicType', 'sourceStrength', 'missingEvidence'],
              },
              step4CounterArguments: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              step5CognitiveBiases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    biasVi: { type: Type.STRING },
                    biasEn: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ['biasVi', 'biasEn', 'explanation'],
                },
              },
              step6ConditionalConclusion: { type: Type.STRING },
              independentNextStepQuestion: { type: Type.STRING },
            },
            required: [
              'step1CoreClaim',
              'step2HiddenAssumptions',
              'step3EvidenceCheck',
              'step4CounterArguments',
              'step5CognitiveBiases',
              'step6ConditionalConclusion',
              'independentNextStepQuestion',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json({
        originalStatement: statement,
        ...parsed,
      });
    } catch (err) {
      const formatted = formatApiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 6. Thinking Lab 4 Specialized Drills Evaluator
  app.post('/api/mentor/thinking-drill', async (req: Request, res: Response) => {
    try {
      const { drillType, scenarioTitle, promptText, userSubmission } = req.body as {
        drillType: 'argument' | 'bias' | 'two_sides' | 'source_check';
        scenarioTitle: string;
        promptText: string;
        userSubmission: Record<string, string>;
      };

      const ai = getGenAIClient();
      const submissionFormatted = Object.entries(userSubmission || {})
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n');

      const prompt = `Người học đang luyện tập tại THINKING LAB – dạng bài "${drillType}":
- Tiêu đề bài tập: ${scenarioTitle}
- Nội dung tình huống / tuyên bố:
"""
${promptText}
"""

PHẦN PHÂN TÍCH ĐỘC LẬP CỦA NGƯỜI HỌC:
${submissionFormatted}

Hãy đóng vai người cố vấn tư duy sắc sảo:
1. Ghi nhận những điểm người học đã bóc tách đúng và sắc bén (strengths).
2. Chỉ ra những khía cạnh tinh tế, giả định ẩn, thiên kiến phụ hoặc góc nhìn mà người học còn bỏ sót (missedNuances).
3. Đưa ra góc nhìn phân tích mẫu ngắn gọn để người học đối chiếu (mentorPerspective).
4. Đặt 1 câu hỏi mở nâng cao để người học tự suy ngẫm thêm (nextThinkingQuestion).`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: CORE_MENTOR_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.STRING },
              missedNuances: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              mentorPerspective: { type: Type.STRING },
              nextThinkingQuestion: { type: Type.STRING },
            },
            required: [
              'strengths',
              'missedNuances',
              'mentorPerspective',
              'nextThinkingQuestion',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const formatted = formatApiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 7. Personal Reflection Journal AI Companion
  app.post('/api/mentor/journal-reflect', async (req: Request, res: Response) => {
    try {
      const { entries } = req.body as {
        entries: {
          title: string;
          learnedToday: string;
          changedMind: string;
          unansweredQuestion: string;
          decisionWeighing: string;
          mistakeAnalysis: string;
          createdAt: string;
        }[];
      };

      const ai = getGenAIClient();
      const serialized = (entries || [])
        .slice(0, 6)
        .map(
          (e, i) =>
            `[Nhật ký ${i + 1} - ${e.title}]\n- Học được: ${e.learnedToday}\n- Thay đổi suy nghĩ: ${e.changedMind}\n- Câu hỏi bỏ ngỏ: ${e.unansweredQuestion}\n- Quyết định cân nhắc: ${e.decisionWeighing}\n- Phân tích sai lầm: ${e.mistakeAnalysis}`
        )
        .join('\n\n');

      const prompt = `Dưới đây là các ghi chép Nhật ký Phát triển Cá nhân của người dùng:

${serialized}

NHIỆM VỤ BẮT BUỘC:
1. Tóm tắt ngắn gọn dòng chảy suy nghĩ và sự trưởng thành nhận thức của người viết (summary).
2. Phát hiện 2–3 chủ đề, mối bận tâm hoặc mô thức tư duy lặp lại qua các trang viết (recurringThemes).
3. Đặt 3 câu hỏi phản tư (Socratic reflection questions) sâu sắc, tôn trọng để người dùng tự chiêm nghiệm.

QUY TẮC CẤM TUYỆT ĐỐI: KHÔNG ĐƯỢC tự động đưa ra kết luận về tính cách cố định hay chẩn đoán sức khỏe tâm lý/bệnh lý của người dùng dưới bất kỳ hình thức nào.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: CORE_MENTOR_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              recurringThemes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              socraticQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['summary', 'recurringThemes', 'socraticQuestions'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json({
        ...parsed,
        generatedAt: new Date().toISOString(),
      });
    } catch (err) {
      const formatted = formatApiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 8. Multi-Mode AI Mentor Streaming Endpoint (SSE)
  app.post('/api/mentor/chat-stream', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    try {
      const { messages, activeDomainTitle, learnerContext, mentorMode } = req.body as {
        messages: { role: 'user' | 'mentor'; content: string }[];
        activeDomainTitle?: string;
        learnerContext?: string;
        mentorMode?: string;
      };

      const ai = getGenAIClient();
      const modeInstruction =
        MENTOR_MODE_INSTRUCTIONS[mentorMode || 'socratic'] ||
        MENTOR_MODE_INSTRUCTIONS.socratic;

      const contextualSystemInstruction = `${CORE_MENTOR_SYSTEM_INSTRUCTION}

${modeInstruction}

BỐI CẢNH HIỆN TẠI:
- Lĩnh vực trọng tâm: ${activeDomainTitle || 'Tổng hợp 10 lĩnh vực phát triển cá nhân'}
${learnerContext ? `- Ghi nhớ học tập (AI Learning Memory):\n${learnerContext}` : ''}

ĐỊNH DẠNG TRÌNH BÀY:
- Chia đoạn ngắn gọn, thoáng mắt, dễ đọc trên cả điện thoại và máy tính.
- Luôn nêu rõ mức độ chắc chắn khi bàn về dữ kiện thực tế.`;

      const formattedContents = (messages || []).map((m) => ({
        role: m.role === 'mentor' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const stream = await ai.models.generateContentStream({
        model: MODEL_NAME,
        contents: formattedContents,
        config: {
          systemInstruction: contextualSystemInstruction,
        },
      });

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      const formatted = formatApiError(err);
      res.write(`data: ${JSON.stringify({ error: formatted.message })}\n\n`);
      res.end();
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
