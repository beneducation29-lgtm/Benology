import {
  LearningDomain,
  LearningPathLevel,
  MasteryStatus,
  SmartReviewState,
  StructuredLesson,
  ThinkingDrillScenario,
  UnderstandingLevel,
} from '../types/mentor';

export const MASTERY_STATUS_ORDER: MasteryStatus[] = [
  MasteryStatus.NOT_STARTED,
  MasteryStatus.LEARNING,
  MasteryStatus.BASIC_UNDERSTANDING,
  MasteryStatus.CAN_EXPLAIN,
  MasteryStatus.CAN_APPLY,
  MasteryStatus.NEEDS_REVIEW,
];

export const UNDERSTANDING_LEVEL_LABELS: Record<
  UnderstandingLevel,
  { label: string; description: string }
> = {
  [UnderstandingLevel.UNKNOWN]: {
    label: '1. Chưa biết',
    description: 'Chưa tiếp cận khái niệm hoặc nguyên lý của chủ đề này.',
  },
  [UnderstandingLevel.READ]: {
    label: '2. Đã đọc',
    description: 'Đã đọc qua bài học nhưng chưa tự truy xuất hoặc giải thích lại.',
  },
  [UnderstandingLevel.BASIC]: {
    label: '3. Hiểu cơ bản',
    description: 'Nắm được ý chính và nhận diện được giả định cốt lõi.',
  },
  [UnderstandingLevel.CAN_EXPLAIN]: {
    label: '4. Có thể giải thích',
    description: 'Diễn đạt lại mạch lạc bằng ngôn từ riêng cho người khác hiểu.',
  },
  [UnderstandingLevel.CAN_APPLY]: {
    label: '5. Có thể áp dụng',
    description: 'Vận dụng linh hoạt vào tình huống mới và phản biện độc lập.',
  },
};

export const SMART_REVIEW_LABELS: Record<
  SmartReviewState,
  { code: SmartReviewState; labelVi: string; guidance: string }
> = {
  [SmartReviewState.NEW]: {
    code: SmartReviewState.NEW,
    labelVi: 'Mới (NEW)',
    guidance: 'Sẵn sàng bắt đầu khám phá từ câu hỏi mở đầu.',
  },
  [SmartReviewState.LEARNING]: {
    code: SmartReviewState.LEARNING,
    labelVi: 'Đang học (LEARNING)',
    guidance: 'Đang đọc hiểu khái niệm cốt lõi và đào sâu cơ chế.',
  },
  [SmartReviewState.PRACTICING]: {
    code: SmartReviewState.PRACTICING,
    labelVi: 'Đang thực hành (PRACTICING)',
    guidance: 'Đang rèn giải thích lại và thử áp dụng vào tình huống thực tế.',
  },
  [SmartReviewState.REVIEW]: {
    code: SmartReviewState.REVIEW,
    labelVi: 'Cần ôn lại (REVIEW)',
    guidance: 'Ưu tiên ôn tập với ví dụ gần gũi và bài tập từng bước đơn giản hơn.',
  },
  [SmartReviewState.MASTERED]: {
    code: SmartReviewState.MASTERED,
    labelVi: 'Đã làm chủ (MASTERED)',
    guidance: 'Đã chứng minh khả năng giải thích, phản biện và áp dụng thực tế.',
  },
};

export const LEARNING_PATH_LEVEL_META: Record<
  LearningPathLevel,
  { code: string; nameEn: string; nameVi: string; objective: string }
> = {
  [LearningPathLevel.FOUNDATION]: {
    code: 'LEVEL 1',
    nameEn: 'FOUNDATION',
    nameVi: 'Nền tảng khái niệm',
    objective: 'Hiểu đúng các khái niệm cơ bản và câu hỏi gốc rễ của lĩnh vực.',
  },
  [LearningPathLevel.UNDERSTANDING]: {
    code: 'LEVEL 2',
    nameEn: 'UNDERSTANDING',
    nameVi: 'Nguyên lý & Mối liên hệ',
    objective: 'Hiểu cơ chế vận hành bên dưới và sự liên kết giữa các yếu tố.',
  },
  [LearningPathLevel.ANALYSIS]: {
    code: 'LEVEL 3',
    nameEn: 'ANALYSIS',
    nameVi: 'Phân tích đa chiều',
    objective: 'Mổ xẻ các tình huống phức tạp, nhận diện giả định và góc nhìn đối lập.',
  },
  [LearningPathLevel.APPLICATION]: {
    code: 'LEVEL 4',
    nameEn: 'APPLICATION',
    nameVi: 'Ứng dụng thực tiễn',
    objective: 'Chuyển hóa tri thức thành hành động và quyết định trong đời sống.',
  },
  [LearningPathLevel.INDEPENDENT_THINKING]: {
    code: 'LEVEL 5',
    nameEn: 'INDEPENDENT THINKING',
    nameVi: 'Tư duy độc lập',
    objective: 'Tự nghiên cứu, tự kiểm chứng giới hạn tri thức và xây dựng quan điểm riêng.',
  },
};

export const MASTERY_DESCRIPTIONS: Record<
  MasteryStatus,
  { shortDesc: string; criteria: string; tone: 'neutral' | 'info' | 'teal' | 'emerald' | 'amber' }
> = {
  [MasteryStatus.NOT_STARTED]: {
    shortDesc: 'Chưa bắt đầu khám phá chủ đề này.',
    criteria: 'Chọn bài học để mở câu hỏi gốc rễ đầu tiên.',
    tone: 'neutral',
  },
  [MasteryStatus.LEARNING]: {
    shortDesc: 'Đang tiếp cận khái niệm và đặt câu hỏi.',
    criteria: 'Đang đọc hiểu nguyên lý và suy ngẫm các câu hỏi mở.',
    tone: 'info',
  },
  [MasteryStatus.BASIC_UNDERSTANDING]: {
    shortDesc: 'Nắm được ý chính và phân biệt được giả định.',
    criteria: 'Nhận diện được khái niệm cốt lõi nhưng cần luyện diễn đạt lại.',
    tone: 'info',
  },
  [MasteryStatus.CAN_EXPLAIN]: {
    shortDesc: 'Tự giải thích lại mạch lạc bằng ngôn từ của chính mình.',
    criteria: 'Áp dụng kỹ thuật Feynman giải thích rõ cho người chưa biết.',
    tone: 'teal',
  },
  [MasteryStatus.CAN_APPLY]: {
    shortDesc: 'Phản biện độc lập và vận dụng vào tình huống mới.',
    criteria: 'Đưa ra quyết định thực tế có điều kiện và nhìn thấu góc nhìn đối lập.',
    tone: 'emerald',
  },
  [MasteryStatus.NEEDS_REVIEW]: {
    shortDesc: 'Cần ôn tập ngắt quãng hoặc kiểm tra lại lỗ hổng lập luận.',
    criteria: 'Còn nhầm lẫn giữa sự thật, giả thuyết hoặc chưa rõ điều kiện áp dụng.',
    tone: 'amber',
  },
};

export const LEARNING_DOMAINS: LearningDomain[] = [
  {
    id: 'philosophy',
    indexLabel: '01',
    title: 'Học Triết Học',
    shortTitle: 'Triết học',
    cardTagline: 'Tư duy về cuộc sống, chân lý và những câu hỏi lớn.',
    coreQuestion: 'Chúng ta sống vì điều gì, làm sao biết một điều là thật, và thế nào là hành động đúng đắn?',
    overview:
      'Học triết học theo hướng ứng dụng trực tiếp vào đời sống — rèn năng lực tự chất vấn giả định, xây dựng lập luận chặt chẽ và đối thoại với cả phương Đông lẫn phương Tây mà không giáo điều.',
    crossDomainLinks: ['Tư duy phản biện', 'Bản chất con người', 'Lịch sử'],
    pedagogicalPrinciples: [
      'Không học vẹt tên triết gia hay niên đại; tập trung vào câu hỏi gốc rễ và cách lập luận.',
      'Luôn đặt ít nhất một góc nhìn đối lập để người học tự cân nhắc, không áp đặt hệ tư tưởng duy nhất.',
      'Thường xuyên hỏi lại giả định ngầm phía sau niềm tin quen thuộc hàng ngày.',
    ],
    epistemicGuardrail:
      'Trong triết học, phần lớn học thuyết là hệ quy chiếu giá trị và lập luận logic, không phải định luật vật lý bất biến.',
    socraticPrompts: [
      'Bạn nghĩ gì về vấn đề này từ trải nghiệm sống của riêng bạn?',
      'Giả định nào đang nằm ẩn phía sau suy nghĩ hiện tại của bạn?',
      'Có góc nhìn đối lập nào đáng để lắng nghe nghiêm túc không?',
      'Nếu điều ngược lại hoàn toàn mới là đúng thì hệ quả sẽ ra sao?',
    ],
    topics: [
      {
        id: 'phil-what-is',
        pathLevel: LearningPathLevel.FOUNDATION,
        title: 'Triết học là gì và vì sao cần cho đời sống thực tế?',
        summary: 'Từ sự ngạc nhiên trước thế giới đến nghệ thuật kiểm tra lại cách ta đang sống.',
        guidingQuestion: 'Nếu không bao giờ tự hỏi vì sao mình chọn mục tiêu hiện tại, ai đang thực sự sống cuộc đời của bạn?',
      },
      {
        id: 'phil-big-questions',
        pathLevel: LearningPathLevel.FOUNDATION,
        title: 'Bốn câu hỏi lớn: Sự tồn tại, Chân lý, Đạo đức và Ý nghĩa',
        summary: 'Bản thể luận, nhận thức luận và đạo đức học qua những tình huống tiến thoái lưỡng nan đời thường.',
        guidingQuestion: 'Một hành động mang lại kết quả tốt nhưng xuất phát từ động cơ ích kỷ có được xem là đạo đức không?',
      },
      {
        id: 'phil-logic-reasoning',
        pathLevel: LearningPathLevel.UNDERSTANDING,
        title: 'Logic học, cấu trúc lập luận và ngụy biện phổ biến',
        summary: 'Phân biệt lập luận hợp lệ (valid), lập luận vững chắc (sound) và các lỗi ngụy biện thường gặp.',
        guidingQuestion: 'Vì sao một kết luận đúng vẫn có thể được xây dựng trên một lập luận hoàn toàn sai?',
      },
      {
        id: 'phil-east-west',
        pathLevel: LearningPathLevel.UNDERSTANDING,
        title: 'Đối thoại Triết học phương Đông và phương Tây',
        summary: 'So sánh Khổng giáo, Đạo gia, Phật giáo nguyên thủy với Hy Lạp cổ đại và Khai sáng châu Âu.',
        guidingQuestion: 'Sự hài hòa thuận theo tự nhiên (Vô vi) mâu thuẫn hay bổ sung cho khát vọng cải tạo thế giới bằng lý tính?',
      },
      {
        id: 'phil-major-schools',
        pathLevel: LearningPathLevel.ANALYSIS,
        title: 'Các trường phái lớn: Khắc kỷ, Hiện sinh, Thực dụng và Duy lý',
        summary: 'Cách mỗi trường phái trả lời bài toán khổ đau, tự do lựa chọn và trách nhiệm cá nhân.',
        guidingQuestion: 'Giữa việc kiểm soát phản ứng bên trong (Khắc kỷ) và dấn thân thay đổi hoàn cảnh bất công, ranh giới nằm ở đâu?',
      },
      {
        id: 'phil-daily-practice',
        pathLevel: LearningPathLevel.APPLICATION,
        title: 'Ứng dụng tư duy triết học vào quyết định hàng ngày',
        summary: 'Thiết lập nguyên tắc sống, đối diện bất định và giữ sự điềm tĩnh trước biến cố.',
        guidingQuestion: 'Quyết định khó khăn nhất bạn đang trì hoãn thực chất đang chạm vào nỗi sợ triết học nào?',
      },
      {
        id: 'phil-great-thinkers',
        pathLevel: LearningPathLevel.INDEPENDENT_THINKING,
        title: 'Đối thoại độc lập cùng các triết gia lớn & Xây dựng nhân sinh quan riêng',
        summary: 'Đối thoại phản biện cùng Socrates, Aristotle, Lão Tử, Kant, Nietzsche và Hannah Arendt mà không thần tượng hóa.',
        guidingQuestion: 'Khi đám đông đều coi một việc xấu là bình thường, điều gì giúp một cá nhân giữ được năng lực phán đoán độc lập?',
      },
    ],
  },
  {
    id: 'psychology',
    indexLabel: '02',
    title: 'Học Tâm Lý Học',
    shortTitle: 'Tâm lý học',
    cardTagline: 'Hiểu suy nghĩ, cảm xúc và hành vi con người.',
    coreQuestion: 'Tâm trí con người xử lý thông tin, nảy sinh cảm xúc và hình thành hành vi như thế nào?',
    overview:
      'Khám phá cơ chế vận hành của nhận thức, cảm xúc, thói quen và hành vi xã hội dựa trên bằng chứng khoa học thực nghiệm, đồng thời nhận thức rõ giới hạn của nghiên cứu tâm lý.',
    crossDomainLinks: ['Bản chất con người', 'Giao tiếp & Thuyết phục', 'Tài chính cá nhân'],
    pedagogicalPrinciples: [
      'Phân biệt nghiêm ngặt giữa nghiên cứu có bằng chứng mạnh, giả thuyết đang tranh luận và tâm lý học đại chúng chưa kiểm chứng.',
      'Tuyệt đối không biến hành vi đời thường thành nhãn dán bệnh lý hay chẩn đoán y khoa.',
      'Kết nối cơ chế nhận thức với cách thiết kế môi trường sống và giao tiếp lành mạnh.',
    ],
    epistemicGuardrail:
      'Không sử dụng kiến thức tâm lý để tự chẩn đoán bệnh lý cho bản thân hay dán nhãn người khác; nhiều nghiên cứu tâm lý học chịu ảnh hưởng của bối cảnh văn hóa và khủng hoảng tái lập (replication crisis).',
    socraticPrompts: [
      'Phản ứng cảm xúc đó đang cố bảo vệ bạn khỏi điều gì, hay đang đánh lừa bạn?',
      'Đây là kết quả nghiên cứu có đối chứng hay chỉ là câu nói truyền miệng phổ biến trên mạng?',
      'Nếu thay đổi bối cảnh môi trường xung quanh, hành vi này có tự động thay đổi không?',
    ],
    topics: [
      {
        id: 'psych-cognitive',
        pathLevel: LearningPathLevel.FOUNDATION,
        title: 'Tâm lý học nhận thức: Chú ý, Trí nhớ và Hai hệ thống tư duy',
        summary: 'Cách não bộ lọc thông tin, tiết kiệm năng lượng và vận hành tư duy nhanh – chậm.',
        guidingQuestion: 'Trong ngày hôm nay, bao nhiêu quyết định của bạn thực sự do suy xét có ý thức thay vì phản xạ tự động?',
      },
      {
        id: 'psych-emotion-motivation',
        pathLevel: LearningPathLevel.UNDERSTANDING,
        title: 'Cảm xúc và Động lực nội tại vs. Ngoại tại',
        summary: 'Vai trò tiến hóa của cảm xúc và thuyết Tự quyết (Self-Determination Theory) về động lực bền vững.',
        guidingQuestion: 'Vì sao phần thưởng bên ngoài đôi khi lại làm giảm hứng thú tự nhiên đối với một việc bạn từng yêu thích?',
      },
      {
        id: 'psych-biases',
        pathLevel: LearningPathLevel.ANALYSIS,
        title: 'Thiên kiến nhận thức (Cognitive Biases) và Điểm mù tâm trí',
        summary: 'Vì sao người thông minh vẫn dễ rơi vào thiên kiến xác nhận, neo đậu thông tin và tự tin thái quá.',
        guidingQuestion: 'Biết tên các thiên kiến nhận thức có tự động giúp bạn miễn nhiễm với chúng không? Vì sao?',
      },
      {
        id: 'psych-social',
        pathLevel: LearningPathLevel.ANALYSIS,
        title: 'Tâm lý học xã hội: Sự tuân phục, Đám đông và Bản sắc nhóm',
        summary: 'Áp lực đồng trang lứa, quy kết cơ bản (Fundamental Attribution Error) và hành vi liên nhóm.',
        guidingQuestion: 'Khi người khác mắc lỗi, vì sao ta hay đổ tại tính cách của họ, nhưng khi mình mắc lỗi lại đổ tại hoàn cảnh?',
      },
      {
        id: 'psych-habits-behavior',
        pathLevel: LearningPathLevel.APPLICATION,
        title: 'Cơ chế hình thành Thói quen và Thiết kế lại hành vi',
        summary: 'Vòng lặp tín hiệu – hành vi – phần thưởng và vai trò của thiết kế môi trường so với ý chí.',
        guidingQuestion: 'Khi bạn thất bại trong việc giữ kỷ luật, nguyên nhân nằm ở sự thiếu ý chí hay ở ma sát môi trường?',
      },
      {
        id: 'psych-decision-relations',
        pathLevel: LearningPathLevel.APPLICATION,
        title: 'Ra quyết định, Giao tiếp thấu cảm và Tâm lý học phát triển',
        summary: 'Ra quyết định dưới áp lực bất định, gắn bó trong mối quan hệ và sự phát triển qua các giai đoạn đời người.',
        guidingQuestion: 'Trong một cuộc tranh cãi căng thẳng, bạn đang lắng nghe để hiểu hay lắng nghe để tìm sơ hở phản công?',
      },
      {
        id: 'psych-limits-debates',
        pathLevel: LearningPathLevel.INDEPENDENT_THINKING,
        title: 'Giới hạn và Tranh luận trong nghiên cứu Tâm lý học hiện đại',
        summary: 'Khủng hoảng tái lập (Replication Crisis), mẫu nghiên cứu WEIRD và cách đọc kết quả khoa học tỉnh táo.',
        guidingQuestion: 'Một thí nghiệm tâm lý thực hiện trên sinh viên đại học phương Tây có luôn đúng với bối cảnh xã hội Việt Nam không?',
      },
    ],
  },
  {
    id: 'human-nature',
    indexLabel: '03',
    title: 'Bản Chất Con Người',
    shortTitle: 'Bản chất con người',
    cardTagline: 'Khám phá động lực, nhu cầu và hành vi của con người.',
    coreQuestion: 'Con người thực sự bị thúc đẩy bởi điều gì phía sau lời nói và hình ảnh bên ngoài?',
    overview:
      'Khảo sát đa chiều về động lực sâu kín của loài người thông qua 5 lăng kính: Triết học, Tâm lý học, Kinh tế học hành vi, Xã hội học và Sinh học tiến hóa — không quy giản con người thành một công thức đơn điệu.',
    crossDomainLinks: ['Tâm lý học', 'Lịch sử', 'Kinh tế'],
    pedagogicalPrinciples: [
      'Luôn chiếu cùng một hiện tượng qua ít nhất 3–5 lăng kính liên ngành (triết học, tiến hóa, xã hội, kinh tế hành vi).',
      'Nhìn thẳng vào cả phần vị kỷ lẫn năng lực vị tha và hợp tác kỳ diệu của con người.',
      'Phân tích sự tương tác giữa sinh học bẩm sinh và thể chế văn hóa – môi trường.',
    ],
    epistemicGuardrail:
      'Tránh ngụy biện tự nhiên (naturalistic fallacy): việc một xu hướng có nguồn gốc tiến hóa không đồng nghĩa xu hướng đó là đúng đắn về mặt đạo đức.',
    socraticPrompts: [
      'Nếu bóc tách lớp vỏ lý lẽ đạo đức bên ngoài, động lực thực sự thúc đẩy hành vi này là gì?',
      'Lăng kính sinh học tiến hóa và lăng kính văn hóa xã hội giải thích hiện tượng này khác nhau ra sao?',
      'Trong hoàn cảnh nào một người tử tế có thể hành xử tàn nhẫn, và ngược lại?',
    ],
    topics: [
      {
        id: 'hn-survival-needs',
        pathLevel: LearningPathLevel.FOUNDATION,
        title: 'Bản năng sinh tồn, Nỗi sợ và Ham muốn cốt lõi',
        summary: 'Cơ chế tiến hóa giúp tổ tiên sống sót nhưng lại tạo ra sự bất an thường trực trong xã hội hiện đại.',
        guidingQuestion: 'Vì sao khi đời sống vật chất đã an toàn hơn nhiều thế kỷ trước, nỗi lo âu về vị thế của con người vẫn không giảm đi?',
      },
      {
        id: 'hn-money-love-bonding',
        pathLevel: LearningPathLevel.UNDERSTANDING,
        title: 'Tiền bạc, Tình yêu và Nhu cầu gắn kết sâu sắc',
        summary: 'Khi giá trị trao đổi thị trường va chạm với những giá trị gắn kết không thể định giá bằng tiền.',
        guidingQuestion: 'Điều gì xảy ra với một mối quan hệ thân tình khi mọi sự đóng góp bắt đầu được cân đo như giao dịch thương mại?',
      },
      {
        id: 'hn-status-power-fame',
        pathLevel: LearningPathLevel.ANALYSIS,
        title: 'Địa vị, Quyền lực, Danh tiếng và Khao khát được công nhận',
        summary: 'Trò chơi địa vị (Status Games), tín hiệu xã hội và cách quyền lực làm biến đổi nhận thức của người nắm giữ nó.',
        guidingQuestion: 'Bạn đang theo đuổi một mục tiêu vì giá trị nội tại của nó, hay vì ánh mắt ngưỡng mộ mà nó mang lại?',
      },
      {
        id: 'hn-selfishness-cooperation',
        pathLevel: LearningPathLevel.APPLICATION,
        title: 'Lòng ích kỷ, Sự hợp tác và Mâu thuẫn cá nhân – tập thể',
        summary: 'Lý thuyết trò chơi, Bi kịch của cái chung (Tragedy of the Commons) và nguồn gốc của lòng tin xã hội.',
        guidingQuestion: 'Tại sao sự hợp tác có đi có lại có thể chiến thắng sự ích kỷ thuần túy trong các trò chơi lặp lại dài hạn?',
      },
      {
        id: 'hn-culture-environment',
        pathLevel: LearningPathLevel.INDEPENDENT_THINKING,
        title: 'Sức mạnh nhào nặn của Môi trường, Thể chế và Văn hóa',
        summary: 'Cách chuẩn mực văn hóa và cơ chế khuyến khích (incentives) định hình hành vi cá nhân.',
        guidingQuestion: 'Muốn xây dựng một tập thể trung thực, nên kêu gọi đạo đức nhiều hơn hay thiết kế lại cơ chế khuyến khích?',
      },
    ],
  },
  {
    id: 'personal-finance',
    indexLabel: '04',
    title: 'Tài Chính Cá Nhân',
    shortTitle: 'Tài chính cá nhân',
    cardTagline: 'Kiếm tiền – Giữ tiền – Đầu tư.',
    coreQuestion: 'Làm sao xây dựng năng lực tạo giá trị, bảo vệ thành quả và tích lũy tài sản bền vững qua thời gian?',
    overview:
      'Xây dựng nền tảng tài chính cá nhân theo đúng trật tự gốc rễ: Giai đoạn 1 (Kiếm tiền tạo giá trị) → Giai đoạn 2 (Giữ tiền & Quản trị rủi ro) → Giai đoạn 3 (Đầu tư dài hạn & Tâm lý thị trường).',
    crossDomainLinks: ['Kinh tế', 'Thuế & Hiểu biết tài chính', 'Tâm lý học'],
    pedagogicalPrinciples: [
      'Đi đúng trình tự: năng lực tạo thu nhập và kỷ luật giữ tiền phải vững trước khi nghĩ đến đầu tư sinh lời.',
      'Tuyệt đối không hứa hẹn lợi nhuận, không phím mã hay khẳng định tài sản nào chắc chắn tăng giá.',
      'Luôn đặt rủi ro cạnh lợi nhuận kỳ vọng và phân biệt rõ đầu tư, đầu cơ với cờ bạc.',
    ],
    epistemicGuardrail:
      'Nội dung chỉ mang tính giáo dục kiến thức tài chính nền tảng, không phải lời khuyên đầu tư cá nhân hóa. Người học cần tự nghiên cứu trước mọi quyết định.',
    socraticPrompts: [
      'Thu nhập đến từ đâu nếu không bắt nguồn từ việc giải quyết một vấn đề thực sự của thị trường?',
      'Nếu danh mục tài sản của bạn giảm 35% trong 12 tháng tới, cuộc sống thực tế và giấc ngủ của bạn bị ảnh hưởng thế nào?',
      'Quyết định mua tài sản này của bạn dựa trên dòng tiền nội tại (đầu tư) hay kỳ vọng có người mua lại giá cao hơn (đầu cơ)?',
    ],
    topics: [
      {
        id: 'fin-stage1-earn',
        pathLevel: LearningPathLevel.FOUNDATION,
        stageLabel: 'Giai đoạn 1 · Kiếm tiền',
        title: 'Phát triển kỹ năng có giá trị cao và Hiểu nhu cầu thị trường',
        summary: 'Giao điểm giữa năng lực khan hiếm, nhu cầu thực của thị trường và đòn bẩy nghề nghiệp/kinh doanh.',
        guidingQuestion: 'Thị trường trả công dựa trên mức độ vất vả của bạn hay dựa trên độ khan hiếm và giá trị bạn tạo ra?',
      },
      {
        id: 'fin-stage1-diversify-income',
        pathLevel: LearningPathLevel.UNDERSTANDING,
        stageLabel: 'Giai đoạn 1 · Kiếm tiền',
        title: 'Xây dựng sự nghiệp, Tạo giá trị kinh doanh và Đa dạng nguồn thu',
        summary: 'Khi nào nên tập trung đào sâu một nghề cốt lõi, khi nào mới nên mở rộng nguồn thu nhập thứ hai.',
        guidingQuestion: 'Đa dạng hóa nguồn thu quá sớm khi chưa có một kỹ năng xuất sắc có nguy cơ biến bạn thành người bình thường ở mọi thứ không?',
      },
      {
        id: 'fin-stage2-keep',
        pathLevel: LearningPathLevel.UNDERSTANDING,
        stageLabel: 'Giai đoạn 2 · Giữ tiền',
        title: 'Quản lý thu chi, Ngân sách, Quỹ dự phòng và Quản trị nợ',
        summary: 'Tách biệt mức sống khỏi mức thu nhập, thiết lập biên an toàn thanh khoản và nhận diện nợ xấu – nợ tốt.',
        guidingQuestion: 'Vì sao nhiều người có thu nhập tăng gấp ba lần sau 5 năm nhưng mức độ tự do tài chính vẫn bằng không?',
      },
      {
        id: 'fin-stage2-protect-inflation',
        pathLevel: LearningPathLevel.ANALYSIS,
        stageLabel: 'Giai đoạn 2 · Giữ tiền',
        title: 'Bảo vệ tài sản và Hiểu tác động ăn mòn của Lạm phát',
        summary: 'Lãi suất thực vs. lãi suất danh nghĩa, bảo hiểm rủi ro tai ương và bảo toàn sức mua dài hạn.',
        guidingQuestion: 'Giữ 100% tài sản dưới dạng tiền mặt có thực sự là không có rủi ro trong khung thời gian 15 năm?',
      },
      {
        id: 'fin-stage3-principles',
        pathLevel: LearningPathLevel.APPLICATION,
        stageLabel: 'Giai đoạn 3 · Đầu tư',
        title: 'Lợi nhuận – Rủi ro, Sức mạnh Lãi kép và Đa dạng hóa danh mục',
        summary: 'Mối quan hệ đánh đổi không thể tách rời giữa lợi suất và rủi ro, cùng toán học thực tế của lãi kép.',
        guidingQuestion: 'Khi ai đó chào mời cơ hội "lợi nhuận cao và an toàn tuyệt đối", rủi ro thực chất đang ẩn giấu ở đâu?',
      },
      {
        id: 'fin-stage3-assets-psych',
        pathLevel: LearningPathLevel.INDEPENDENT_THINKING,
        stageLabel: 'Giai đoạn 3 · Đầu tư',
        title: 'Các lớp tài sản, Tâm lý nhà đầu tư và Phân biệt Đầu tư – Đầu cơ – Cờ bạc',
        summary: 'Bản chất kinh tế của cổ phiếu, trái phiếu, quỹ chỉ số; kiểm soát FOMO và tự xây dựng nguyên tắc đầu tư độc lập.',
        guidingQuestion: 'Nếu thị trường đóng cửa không giao dịch trong 5 năm tới, bạn có còn sẵn lòng nắm giữ tài sản mình vừa định mua không?',
      },
    ],
  },
  {
    id: 'persuasion',
    indexLabel: '05',
    title: 'Giao Tiếp & Thuyết Phục',
    shortTitle: 'Giao tiếp & Thuyết phục',
    cardTagline: 'Trình bày ý tưởng và xây dựng sự tin tưởng.',
    coreQuestion: 'Làm sao truyền đạt ý tưởng rõ ràng, xây dựng lòng tin và đồng thuận mà vẫn tôn trọng tự do lựa chọn của người khác?',
    overview:
      'Rèn luyện nghệ thuật lập luận, lắng nghe chủ động, kể chuyện có bằng chứng và đàm phán tạo giá trị chung — đặt ranh giới đạo đức minh bạch giữa thuyết phục lành mạnh và thao túng.',
    crossDomainLinks: ['Tâm lý học', 'Tư duy phản biện', 'Triết học'],
    pedagogicalPrinciples: [
      'Luôn đối chiếu mọi kỹ thuật giao tiếp qua lăng kính: tôn trọng quyền tự quyết vs. che giấu thông tin để trục lợi.',
      'Bắt đầu việc thuyết phục từ sự lắng nghe chủ động để hiểu đúng mối bận tâm thật của người đối diện.',
      'Kết hợp lý lẽ chặt chẽ (Logos), uy tín trung thực (Ethos) và sự đồng cảm chân thành (Pathos).',
    ],
    epistemicGuardrail:
      'Mục tiêu là giao tiếp minh bạch để cùng đi tới quyết định tốt hơn, tuyệt đối không hướng dẫn các thủ thuật thao túng tâm lý hay ép buộc phi đạo đức.',
    socraticPrompts: [
      'Nếu người nghe biết toàn bộ thông tin mà bạn đang biết, họ có còn đồng ý với đề xuất của bạn không?',
      'Bạn đang cố thắng cuộc tranh luận hay đang cố giải quyết vấn đề chung?',
      'Điều gì khiến người đối diện cảm thấy an toàn để nói ra lời phản đối thật sự của họ?',
    ],
    topics: [
      {
        id: 'pers-ethics-boundary',
        pathLevel: LearningPathLevel.FOUNDATION,
        title: 'Ranh giới cốt lõi: Thuyết phục lành mạnh vs. Thao túng tâm lý',
        summary: 'Ba tiêu chí kiểm chứng tính chính trực: sự trung thực thông tin, quyền từ chối và lợi ích dài hạn.',
        guidingQuestion: 'Một chiến thuật giúp bạn đạt được cái gật đầu ngay hôm nay nhưng làm xói mòn lòng tin sau đó có đáng gọi là thành công?',
      },
      {
        id: 'pers-listening-trust',
        pathLevel: LearningPathLevel.UNDERSTANDING,
        title: 'Lắng nghe chủ động, Thấu hiểu nhu cầu và Xây dựng lòng tin',
        summary: 'Giải mã nhu cầu ngầm phía sau lời từ chối và tích lũy uy tín qua sự nhất quán.',
        guidingQuestion: 'Vì sao con người thường kháng cự ngay lập tức khi cảm thấy người khác đang cố sửa đổi suy nghĩ của mình?',
      },
      {
        id: 'pers-argument-story',
        pathLevel: LearningPathLevel.ANALYSIS,
        title: 'Cấu trúc trình bày ý tưởng, Bằng chứng và Nghệ thuật kể chuyện',
        summary: 'Sắp xếp luận điểm rõ ràng, kết hợp dữ liệu xác thực với câu chuyện cụ thể dễ hình dung.',
        guidingQuestion: 'Dữ liệu thống kê thuyết phục lý trí như thế nào và câu chuyện cụ thể chạm tới sự chú ý ra sao?',
      },
      {
        id: 'pers-negotiation-objections',
        pathLevel: LearningPathLevel.APPLICATION,
        title: 'Đàm phán nguyên tắc và Xử lý phản đối một cách tôn trọng',
        summary: 'Tách con người ra khỏi vấn đề, tập trung vào lợi ích thay vì lập trường cứng nhắc (BATNA).',
        guidingQuestion: 'Trong đàm phán, làm thế nào để biến sự phản đối của đối phương thành dữ liệu quý giúp cải thiện giải pháp?',
      },
      {
        id: 'pers-independent-dialogue',
        pathLevel: LearningPathLevel.INDEPENDENT_THINKING,
        title: 'Đối thoại trước bất đồng sâu sắc & Giữ sự chính trực ngôn từ',
        summary: 'Dẫn dắt các cuộc thảo luận phức tạp nơi các bên có hệ giá trị khác biệt mà không ngụy biện hay công kích cá nhân.',
        guidingQuestion: 'Khi nào sự im lặng lắng nghe hoặc thừa nhận giới hạn hiểu biết của mình lại có sức thuyết phục mạnh hơn ngàn lời biện hộ?',
      },
    ],
  },
  {
    id: 'taxation',
    indexLabel: '06',
    title: 'Thuế & Hiểu Biết Tài Chính',
    shortTitle: 'Thuế & Tài chính',
    cardTagline: 'Hiểu trách nhiệm tài chính và hệ thống thuế.',
    coreQuestion: 'Hệ thống thuế vận hành xã hội ra sao, và công dân/người kinh doanh cần hiểu gì để tuân thủ và lập kế hoạch hợp pháp?',
    overview:
      'Trang bị tư duy nền tảng về bản chất kinh tế – xã hội của thuế, các sắc thuế phổ biến, chứng từ kế toán và sự khác biệt rạch ròi giữa tối ưu thuế hợp pháp và hành vi trốn thuế.',
    crossDomainLinks: ['Tài chính cá nhân', 'Kinh tế', 'Lịch sử'],
    pedagogicalPrinciples: [
      'Luôn nhắc rằng luật thuế phụ thuộc chặt chẽ vào quốc gia/lãnh thổ và thời điểm hiệu lực của văn bản pháp luật.',
      'Phân biệt minh bạch giữa lập kế hoạch tài chính hợp pháp (tax planning) và trốn thuế/gian lận (tax evasion).',
      'Giúp người học hiểu chứng từ, hóa đơn và nghĩa vụ khai báo ngay từ khi bắt đầu đi làm hoặc kinh doanh nhỏ.',
    ],
    epistemicGuardrail:
      'Mọi quy định thuế suất và mức giảm trừ thay đổi theo luật từng quốc gia và từng thời kỳ. Không hướng dẫn che giấu thu nhập, mua bán hóa đơn hay gian lận thuế.',
    socraticPrompts: [
      'Bạn đang hỏi về quy định thuế áp dụng tại quốc gia nào và trong năm tài chính nào?',
      'Nếu không có hệ thống thuế, những hạ tầng công cộng nào bạn đang dùng mỗi ngày sẽ biến mất đầu tiên?',
      'Đâu là ranh giới pháp lý và đạo đức giữa việc áp dụng đúng các khoản giảm trừ hợp pháp và việc khai sai bản chất giao dịch?',
    ],
    topics: [
      {
        id: 'tax-nature-society',
        pathLevel: LearningPathLevel.FOUNDATION,
        title: 'Thuế là gì và Khế ước xã hội phía sau hệ thống thuế',
        summary: 'Vai trò tài trợ hàng hóa công cộng, điều tiết vĩ mô và phân phối lại trong nền kinh tế hiện đại.',
        guidingQuestion: 'Một hệ thống thuế như thế nào được coi là vừa công bằng vừa không làm triệt tiêu động lực làm việc sáng tạo?',
      },
      {
        id: 'tax-major-types',
        pathLevel: LearningPathLevel.UNDERSTANDING,
        title: 'Các loại thuế phổ biến: Thuế trực thu và Thuế gián thu',
        summary: 'Phân biệt thuế thu nhập cá nhân, thuế thu nhập doanh nghiệp, thuế giá trị gia tăng (VAT) và thuế tiêu thụ.',
        guidingQuestion: 'Khi bạn mua một ly cà phê hàng ngày, ai là người nộp thuế vào ngân sách và ai là người thực sự chịu gánh nặng thuế đó?',
      },
      {
        id: 'tax-income-business',
        pathLevel: LearningPathLevel.ANALYSIS,
        title: 'Thuế thu nhập cá nhân, Thuế hộ kinh doanh và Doanh nghiệp',
        summary: 'Nguyên tắc tính thuế lũy tiến, doanh thu vs. lợi nhuận chịu thuế, chi phí hợp lý được trừ.',
        guidingQuestion: 'Vì sao việc trộn lẫn tài khoản cá nhân và dòng tiền kinh doanh lại gây rủi ro lớn khi quyết toán thuế?',
      },
      {
        id: 'tax-compliance-planning',
        pathLevel: LearningPathLevel.APPLICATION,
        title: 'Hóa đơn chứng từ, Nghĩa vụ tuân thủ và Lập kế hoạch hợp pháp',
        summary: 'Quản trị hồ sơ chứng từ minh bạch và sử dụng đúng các ưu đãi/giảm trừ mà pháp luật cho phép.',
        guidingQuestion: 'Chi phí của việc tuân thủ đúng ngay từ đầu so với rủi ro pháp lý của sự thiếu hiểu biết khác nhau như thế nào?',
      },
      {
        id: 'tax-policy-evaluation',
        pathLevel: LearningPathLevel.INDEPENDENT_THINKING,
        title: 'Tự tra cứu văn bản pháp luật thuế & Đánh giá tác động chính sách thuế',
        summary: 'Cách đọc văn bản quy phạm pháp luật hiện hành theo đúng thẩm quyền/thời điểm hiệu lực và phân tích tác động kinh tế.',
        guidingQuestion: 'Khi nghe một tin đồn trên mạng về thay đổi mức thuế, quy trình kiểm tra văn bản gốc chính thống của bạn là gì?',
      },
    ],
  },
  {
    id: 'history',
    indexLabel: '07',
    title: 'Lịch Sử',
    shortTitle: 'Lịch sử',
    cardTagline: 'Hiểu quá khứ để hiểu hiện tại.',
    coreQuestion: 'Vì sao các biến cố lịch sử xảy ra, những lực lượng ngầm nào chi phối chúng, và bài học nào vẫn đang lặp lại hôm nay?',
    overview:
      'Vượt qua lối học thuộc lòng ngày tháng để phân tích cấu trúc 7 tầng của mọi sự kiện lịch sử: bối cảnh, nguyên nhân sâu xa, lợi ích các bên, đa góc nhìn, hệ quả dài hạn và phê bình sử liệu.',
    crossDomainLinks: ['Kinh tế', 'Bản chất con người', 'Tư duy phản biện'],
    pedagogicalPrinciples: [
      'Áp dụng cấu trúc 7 câu hỏi chuẩn mực cho mọi biến cố lịch sử.',
      'Không bao giờ kể lịch sử như câu chuyện một chiều; luôn đối chiếu góc nhìn của nhiều bên liên quan.',
      'Hướng dẫn người học thẩm định nguồn tư liệu sơ cấp (primary sources) và tư liệu thứ cấp (secondary sources).',
    ],
    epistemicGuardrail:
      'Sử liệu luôn được ghi chép bởi những con người có bối cảnh, giới hạn thông tin và động cơ riêng; cần phân biệt dữ kiện khảo cổ/văn bản với cách diễn giải hậu thế.',
    socraticPrompts: [
      'Ai là người viết lại tư liệu này, họ viết vào lúc nào và nhằm thuyết phục ai?',
      'Sự kiện bùng nổ là nguyên nhân gốc rễ hay chỉ là giọt nước tràn ly của những mâu thuẫn kinh tế – xã hội tích tụ trước đó?',
      'Một người dân bình thường sống ở phía bên kia chiến tuyến khi ấy đã nhìn nhận sự kiện này như thế nào?',
    ],
    topics: [
      {
        id: 'hist-source-criticism',
        pathLevel: LearningPathLevel.FOUNDATION,
        title: 'Phương pháp tư duy sử học và Thẩm định nguồn tư liệu',
        summary: 'Cách đọc sử liệu sơ cấp, phát hiện thiên kiến của người chép sử và tránh lỗi áp đặt tiêu chuẩn hiện tại lên quá khứ.',
        guidingQuestion: 'Vì sao câu nói "Lịch sử do người chiến thắng viết nên" vừa có phần đúng, vừa chưa đủ để phủ nhận nghiên cứu sử học nghiêm túc?',
      },
      {
        id: 'hist-causal-framework',
        pathLevel: LearningPathLevel.UNDERSTANDING,
        title: 'Khung 7 bước mổ xẻ một biến cố lịch sử lớn',
        summary: 'Tách biệt nguyên nhân trực tiếp, nguyên nhân cấu trúc (địa lý, kinh tế, công nghệ) và hệ quả ngoài dự tính.',
        guidingQuestion: 'Một quyết định giải quyết khủng hoảng ngắn hạn trong lịch sử đã từng gieo mầm cho cuộc khủng hoảng lớn hơn 20 năm sau như thế nào?',
      },
      {
        id: 'hist-economic-tech-shifts',
        pathLevel: LearningPathLevel.ANALYSIS,
        title: 'Các bước ngoặt Nông nghiệp, Thương mại và Cách mạng Công nghiệp',
        summary: 'Cách sự thay đổi công nghệ sản xuất và tuyến giao thương tái định hình trật tự xã hội loài người.',
        guidingQuestion: 'Những biến đổi công nghệ hôm nay có điểm gì tương đồng với cú sốc xã hội thời Cách mạng Công nghiệp lần thứ nhất?',
      },
      {
        id: 'hist-empires-institutions',
        pathLevel: LearningPathLevel.APPLICATION,
        title: 'Sự trỗi dậy và Suy tàn của các Đế chế và Thể chế',
        summary: 'Chu kỳ thịnh suy, sự mở rộng quá mức, suy giảm niềm tin nội bộ và bài học quản trị bền vững.',
        guidingQuestion: 'Các tổ chức và quốc gia thường sụp đổ vì kẻ thù bên ngoài trước hay vì sự xói mòn thể chế từ bên trong trước?',
      },
      {
        id: 'hist-present-lens',
        pathLevel: LearningPathLevel.INDEPENDENT_THINKING,
        title: 'Đối chiếu chu kỳ lịch sử để đọc hiểu biến động đương đại',
        summary: 'Sử dụng tư duy lịch sử để nhận diện quy luật lặp lại mà không rơi vào ngụy biện so sánh máy móc.',
        guidingQuestion: 'Khi so sánh một sự kiện thời sự hiện nay với một biến cố thế kỷ 20, điểm khác biệt cấu trúc nào quan trọng không kém điểm tương đồng?',
      },
    ],
  },
  {
    id: 'economics',
    indexLabel: '08',
    title: 'Kinh Tế',
    shortTitle: 'Kinh tế',
    cardTagline: 'Hiểu cách thế giới vận hành thông qua các hệ thống kinh tế.',
    coreQuestion: 'Con người và xã hội phân bổ nguồn lực khan hiếm như thế nào, và các biến số vĩ mô chạm tới ví tiền cá nhân ra sao?',
    overview:
      'Giải mã cách nền kinh tế vận hành từ quyết định mua sắm hàng ngày, cung cầu, giá cả, cạnh tranh đến lạm phát, lãi suất, chính sách tài khóa – tiền tệ và thương mại quốc tế.',
    crossDomainLinks: ['Tài chính cá nhân', 'Thuế & Hiểu biết tài chính', 'Lịch sử'],
    pedagogicalPrinciples: [
      'Mọi khái niệm kinh tế đều phải gắn với ví dụ đời sống thực tế: tiền thuê nhà, ổ bánh mì, lương tháng, lãi vay.',
      'Luôn hỏi về tác động bước hai (second-order effects): một chính sách giúp nhóm nào ngắn hạn và gây hệ quả gì dài hạn?',
      'Kết hợp kinh tế học tân cổ điển với kinh tế học hành vi để thấy khoảng cách giữa mô hình lý thuyết và con người thực.',
    ],
    epistemicGuardrail:
      'Kinh tế học nghiên cứu hệ thống phức hợp gồm hàng triệu con người phản ứng linh hoạt; các dự báo vĩ mô luôn đi kèm điều kiện giả định (ceteris paribus), không phải lời tiên tri chắc chắn.',
    socraticPrompts: [
      'Chi phí cơ hội thực sự (thứ tốt nhất bạn đã phải từ bỏ) của lựa chọn này là gì?',
      'Khi giá một mặt hàng thiết yếu bị giữ trần nhân tạo thấp hơn chi phí sản xuất, chuyện gì sẽ xảy ra với nguồn cung sau 6 tháng?',
      'Ai là người hưởng lợi và ai là người chịu thiệt thòi âm thầm khi lạm phát và lãi suất biến động?',
    ],
    topics: [
      {
        id: 'econ-supply-demand-price',
        pathLevel: LearningPathLevel.FOUNDATION,
        title: 'Khan hiếm, Chi phí cơ hội, Cung – Cầu và Tín hiệu Giá cả',
        summary: 'Giá cả không chỉ là con số trên nhãn hàng mà là hệ thống truyền tin khổng lồ điều phối nguồn lực xã hội.',
        guidingQuestion: 'Vì sao nước uống cần thiết cho sự sống hơn kim cương nhưng giá một chai nước lại rẻ hơn kim cương rất nhiều?',
      },
      {
        id: 'econ-competition-market',
        pathLevel: LearningPathLevel.UNDERSTANDING,
        title: 'Cạnh tranh, Độc quyền và Thất bại thị trường',
        summary: 'Khi nào thị trường tự do tạo ra sự sáng tạo hiệu quả, và khi nào xuất hiện ngoại tác tiêu cực cần điều tiết.',
        guidingQuestion: 'Điều gì xảy ra với chất lượng dịch vụ khi một doanh nghiệp loại bỏ hoàn toàn mọi đối thủ cạnh tranh?',
      },
      {
        id: 'econ-inflation-interest-jobs',
        pathLevel: LearningPathLevel.ANALYSIS,
        title: 'Lạm phát, Lãi suất, Thất nghiệp và Tăng trưởng kinh tế',
        summary: 'Mối liên hệ mật thiết giữa chi phí vay vốn, việc làm, thu nhập cố định và chu kỳ kinh tế.',
        guidingQuestion: 'Khi ngân hàng trung ương tăng lãi suất để kiềm chế lạm phát, người gửi tiết kiệm, người vay mua nhà và doanh nghiệp chịu tác động khác nhau thế nào?',
      },
      {
        id: 'econ-fiscal-monetary-trade',
        pathLevel: LearningPathLevel.APPLICATION,
        title: 'Chính sách Tài khóa, Chính sách Tiền tệ, Thương mại quốc tế & Kinh tế hành vi',
        summary: 'Thu chi ngân sách nhà nước, cung tiền, lợi thế so sánh toàn cầu và tâm lý phi lý tính của người tiêu dùng.',
        guidingQuestion: 'Tại sao hai quốc gia vẫn cùng có lợi khi giao thương ngay cả khi một nước làm giỏi hơn nước kia ở mọi mặt hàng?',
      },
      {
        id: 'econ-second-order-thinking',
        pathLevel: LearningPathLevel.INDEPENDENT_THINKING,
        title: 'Tư duy hệ quả bậc hai (Second-Order Thinking) trong quyết định kinh tế',
        summary: 'Tự phân tích tác động dây chuyền dài hạn của một biến động kinh tế đối với ngành nghề và tài chính gia đình.',
        guidingQuestion: 'Sau câu hỏi "Điều gì xảy ra ngay lập tức?", làm sao rèn phản xạ luôn hỏi tiếp "Và rồi điều gì sẽ xảy ra tiếp theo sau đó?"',
      },
    ],
  },
  {
    id: 'critical-thinking',
    indexLabel: '09',
    title: 'Tư Duy Phản Biện',
    shortTitle: 'Tư duy phản biện',
    cardTagline: 'Kiểm tra thông tin, lập luận và xây dựng suy nghĩ độc lập.',
    coreQuestion: 'Làm sao suy nghĩ độc lập, thẩm định bằng chứng khách quan mà không rơi vào sự hoài nghi cực đoan hay cố chấp?',
    overview:
      'Trái tim phương pháp luận của hệ thống: rèn luyện quy trình 6 bước mổ xẻ mọi tuyên bố, phát hiện giả định ẩn, kiểm định nguồn bằng chứng, xây dựng lập luận đối lập mạnh nhất (Steelman) và đưa ra kết luận có điều kiện.',
    crossDomainLinks: ['Triết học', 'Tâm lý học', 'Kỹ năng tự học'],
    pedagogicalPrinciples: [
      'Khi người học nêu một quan điểm, không vội khen đúng hay đồng tình ngay; hãy cùng mổ xẻ 6 bước.',
      'Dạy thói quen diễn đạt chính xác mức độ chắc chắn: "Dựa trên dữ liệu hiện tại...", "Điều này đúng trong điều kiện...".',
      'Áp dụng tư duy phản biện nghiêm khắc nhất lên chính những niềm tin mà bản thân mình yêu thích nhất.',
    ],
    epistemicGuardrail:
      'Tư duy phản biện không phải là công cụ để bắt bẻ thắng thua với người khác, mà là kỷ luật tự hiệu chỉnh nhận thức của chính mình trước thực tại.',
    socraticPrompts: [
      'Bằng chứng nào nếu xuất hiện sẽ khiến bạn sẵn sàng thay đổi hoàn toàn quan điểm hiện tại?',
      'Bạn đang đi từ bằng chứng tới kết luận, hay đã chọn sẵn kết luận rồi mới đi tìm bằng chứng hợp ý mình?',
      'Một người rất thông minh và tử tế nhưng không đồng ý với bạn sẽ đưa ra lập luận mạnh nhất là gì?',
    ],
    topics: [
      {
        id: 'ct-claims-assumptions',
        pathLevel: LearningPathLevel.FOUNDATION,
        title: 'Xác định Tuyên bố cốt lõi và Bóc tách Giả định ngầm',
        summary: 'Làm rõ điều thực sự đang được khẳng định và những tiền đề chưa chứng minh nằm bên dưới.',
        guidingQuestion: 'Trong câu nói "Chỉ cần nỗ lực hết mình thì ai cũng sẽ giàu có", những giả định ngầm nào đang bị bỏ qua?',
      },
      {
        id: 'ct-evidence-hierarchy',
        pathLevel: LearningPathLevel.UNDERSTANDING,
        title: 'Thang bậc Bằng chứng – Dữ liệu, Nghiên cứu vs. Trải nghiệm cá nhân',
        summary: 'Phân biệt giai thoại cá nhân (anecdote), tương quan thống kê (correlation) và quan hệ nhân quả (causation).',
        guidingQuestion: 'Vì sao câu chuyện "Ông tôi hút thuốc mỗi ngày vẫn thọ 90 tuổi" không thể bác bỏ dữ liệu dịch tễ học về thuốc lá?',
      },
      {
        id: 'ct-steelman-biases',
        pathLevel: LearningPathLevel.ANALYSIS,
        title: 'Kỹ thuật Steelman và Nhận diện Thiên kiến nhận thức',
        summary: 'Xây dựng phiên bản mạnh nhất cho quan điểm đối lập; kiểm tra thiên kiến sống sót, xác nhận và đám đông.',
        guidingQuestion: 'Khi đọc câu chuyện khởi nghiệp của các tỷ phú bỏ học đại học, thiên kiến sống sót đang che khuất nhóm dữ liệu nào?',
      },
      {
        id: 'ct-information-hygiene',
        pathLevel: LearningPathLevel.APPLICATION,
        title: 'Kiểm chứng nguồn tin & Tự vệ nhận thức giữa nhiễu loạn truyền thông',
        summary: 'Quy trình thẩm định động cơ nguồn phát, số liệu bị cắt cúp và tin giật gân trong đời sống hàng ngày.',
        guidingQuestion: 'Trước một tin tức khiến bạn tức giận hoặc phấn khích tột độ ngay lập tức, câu hỏi đầu tiên bạn nên đặt ra là gì?',
      },
      {
        id: 'ct-conditional-conclusions',
        pathLevel: LearningPathLevel.INDEPENDENT_THINKING,
        title: 'Tư duy xác suất và Kết luận có điều kiện',
        summary: 'Sống chung với sự bất định một cách minh mẫn: cập nhật niềm tin khi có dữ liệu mới (tư duy Bayes).',
        guidingQuestion: 'Tại sao việc dám nói "Tôi chưa có đủ dữ liệu để kết luận" lại là biểu hiện của trí tuệ trưởng thành chứ không phải sự yếu đuối?',
      },
    ],
  },
  {
    id: 'self-learning',
    indexLabel: '10',
    title: 'Kỹ Năng Tự Học',
    shortTitle: 'Kỹ năng tự học',
    cardTagline: 'Học cách học và phát triển suốt đời.',
    coreQuestion: 'Làm thế nào để tự làm chủ bất kỳ lĩnh vực mới nào trong tương lai mà không cần phụ thuộc vào người dạy hay AI?',
    overview:
      'Kỹ năng nền tảng giúp người học tự thiết kế mục tiêu rõ ràng, phân rã kỹ năng phức tạp, thực hành truy xuất chủ động (Active Recall), lặp lại ngắt quãng (Spaced Repetition) và kỹ thuật Feynman.',
    crossDomainLinks: ['Tư duy phản biện', 'Tâm lý học', 'Triết học'],
    pedagogicalPrinciples: [
      'Chuyển hóa cảm giác "hiểu quen mắt khi đọc" (ảo tưởng năng lực) thành khả năng tự tái tạo và vận dụng thực tế.',
      'Mỗi kỹ thuật học tập phải đi kèm cách tự kiểm chứng sự tiến bộ không cần AI chấm hộ.',
      'Hướng tới việc người dùng tự tra cứu nguồn gốc, tự đặt câu hỏi và trở thành người thầy của chính mình.',
    ],
    epistemicGuardrail:
      'Đọc trôi chảy một văn bản hay nghe giảng thấy hay chưa phải là học được; việc học chỉ thực sự diễn ra khi não bộ phải nỗ lực truy xuất và áp dụng trong bối cảnh mới.',
    socraticPrompts: [
      'Nếu đóng toàn bộ tài liệu và màn hình lại ngay lúc này, bạn có thể viết ra giấy nguyên lý cốt lõi vừa học cho một học sinh lớp 9 hiểu không?',
      'Mục tiêu học tập hiện tại của bạn đang đo bằng số giờ ngồi trước bàn hay bằng năng lực thực tế tạo ra được?',
      'Khi không có AI bên cạnh, quy trình 3 bước đầu tiên bạn tự kiểm chứng một lĩnh vực hoàn toàn mới là gì?',
    ],
    topics: [
      {
        id: 'sl-goals-deconstruction',
        pathLevel: LearningPathLevel.FOUNDATION,
        title: 'Chuyển mục tiêu mơ hồ thành Mục tiêu cụ thể & Phân rã kiến thức',
        summary: 'Tách một lĩnh vực đồ sộ thành cây kỹ năng nhỏ có thể luyện tập và kiểm chứng trong từng tuần.',
        guidingQuestion: 'Sự khác biệt giữa mục tiêu "Tôi muốn giỏi kinh tế" và một mục tiêu tự học có thể hành động ngay chiều nay là gì?',
      },
      {
        id: 'sl-active-learning',
        pathLevel: LearningPathLevel.UNDERSTANDING,
        title: 'Học chủ động vs. Tiêu thụ thụ động & Ảo tưởng về sự hiểu biết',
        summary: 'Vì sao đọc đi đọc lại và tô dạ quang kém hiệu quả hơn nhiều so với tự đặt câu hỏi và giải quyết bài toán.',
        guidingQuestion: 'Lần gần nhất bạn đọc xong một cuốn sách hay nhưng 2 tuần sau không nhớ nổi 3 luận điểm chính là khi nào, và vì sao?',
      },
      {
        id: 'sl-memory-science',
        pathLevel: LearningPathLevel.ANALYSIS,
        title: 'Bốn trụ cột ghi nhớ sâu: Active Recall, Spaced Repetition, Interleaving & Feynman',
        summary: 'Khoa học thần kinh về trí nhớ dài hạn và cách kết hợp 4 phương pháp vào lịch học ngắn mỗi ngày.',
        guidingQuestion: 'Tại sao việc cảm thấy hơi khó khăn khi cố nhớ lại kiến thức thực chất lại là tín hiệu tốt cho việc củng cố đường truyền thần kinh?',
      },
      {
        id: 'sl-transfer-practice',
        pathLevel: LearningPathLevel.APPLICATION,
        title: 'Chuyển giao kiến thức liên ngành (Knowledge Transfer) vào dự án thực',
        summary: 'Đưa nguyên lý từ sách vở sang giải quyết vấn đề thực tế trong công việc và cuộc sống.',
        guidingQuestion: 'Một nguyên lý bạn học ở Tâm lý học hay Kinh tế học có thể giải quyết bài toán nào trong công việc tuần này của bạn?',
      },
      {
        id: 'sl-self-evaluation-autonomy',
        pathLevel: LearningPathLevel.INDEPENDENT_THINKING,
        title: 'Tự đánh giá sự tiến bộ và Xây dựng sự độc lập khỏi AI',
        summary: 'Bộ câu hỏi tự kiểm tra độ hiểu sâu, tự tra cứu nguồn gốc và dùng AI như người đối thoại phản biện thay vì nạng chống tư duy.',
        guidingQuestion: 'Làm sao nhận biết ranh giới giữa việc dùng AI để mở rộng góc nhìn và việc để AI suy nghĩ thay cho mình?',
      },
    ],
  },
];

export const THINKING_DRILL_SCENARIOS: ThinkingDrillScenario[] = [
  // 1. Argument Analysis
  {
    id: 'arg-remote-work',
    type: 'argument',
    title: 'Năng suất làm việc từ xa và văn phòng',
    domainTag: 'Quản trị & Kinh tế',
    promptText:
      '“Công ty chúng ta cần hủy bỏ hoàn toàn chế độ làm việc từ xa vào tháng tới. Tháng trước, hai dự án giao cho nhóm làm việc online bị trễ hạn 1 tuần, trong khi các tập đoàn công nghệ lớn trên thế giới cũng đang yêu cầu nhân viên quay lại văn phòng 5 ngày/tuần để tăng sự gắn kết.”',
  },
  {
    id: 'arg-degree-value',
    type: 'argument',
    title: 'Bằng cấp đại học và thu nhập khởi nghiệp',
    domainTag: 'Giáo dục & Tài chính',
    promptText:
      '“Học đại học 4 năm ngày nay là sự lãng phí thời gian và chi phí cơ hội. Hàng loạt nhà sáng lập công nghệ thành công đã bỏ học giữa chừng, và mọi kiến thức chuyên môn hiện đều có sẵn miễn phí trên Internet.”',
  },
  // 2. Bias Detection
  {
    id: 'bias-sunk-cost',
    type: 'bias',
    title: 'Dự án kinh doanh thua lỗ kéo dài',
    domainTag: 'Tâm lý học & Tài chính',
    promptText:
      'Minh đã đầu tư 600 triệu đồng và 18 tháng công sức mở một quán đồ uống. Dù 8 tháng liên tiếp quán đều lỗ nặng do vị trí khuất và lưu lượng khách sụt giảm, khi bạn bè khuyên đóng cửa cắt lỗ để chuyển hướng, Minh kiên quyết vay thêm 200 triệu nữa với lý do: “Nếu dừng lại bây giờ thì toàn bộ 600 triệu và gần hai năm tuổi trẻ của tôi coi như đổ sông đổ biển hết sao?”',
  },
  {
    id: 'bias-stock-crowd',
    type: 'bias',
    title: 'Cơn sốt đầu tư theo hội nhóm',
    domainTag: 'Tâm lý nhà đầu tư',
    promptText:
      'Lan vốn rất thận trọng với tiền tiết kiệm. Nhưng suốt 3 tuần nay, đồng nghiệp cùng phòng và các diễn đàn mạng xã hội liên tục khoe ảnh lãi 40% nhờ mua một mã cổ phiếu nóng. Lan chỉ tìm đọc các bài phân tích khen ngợi tiềm năng của mã đó, bỏ qua báo cáo tài chính đang cảnh báo nợ vay cao, rồi rút toàn bộ quỹ dự phòng mua vào ở vùng giá đỉnh.',
  },
  // 3. Two Perspectives
  {
    id: 'two-ai-regulation',
    type: 'two_sides',
    title: 'Tốc độ đổi mới công nghệ vs. Kiểm soát an toàn xã hội',
    domainTag: 'Triết học & Kinh tế',
    promptText:
      'Xã hội nên ưu tiên cho phép công nghệ mới phát triển tự do nhanh nhất có thể, hay phải đặt ra khung kiểm duyệt chặt chẽ trước khi cho phép phổ biến rộng rãi?',
    sideA:
      'Bên A (Ưu tiên tự do sáng tạo): Quy định quá sớm sẽ bóp nghẹt đổi mới, làm chậm các đột phá y tế – giáo dục và khiến quốc gia tụt hậu.',
    sideB:
      'Bên B (Ưu tiên phòng ngừa rủi ro): Nếu chờ hậu quả xảy ra mới quản lý, những tổn thương về việc làm, tin giả và an ninh xã hội có thể không thể đảo ngược.',
  },
  {
    id: 'two-frugality-investing',
    type: 'two_sides',
    title: 'Tối ưu tiết kiệm chi tiêu vs. Đầu tư mở rộng thu nhập',
    domainTag: 'Tài chính cá nhân',
    promptText:
      'Với một người trẻ ở giai đoạn đầu sự nghiệp, con đường nào quan trọng hơn để xây dựng nền tảng tài chính vững chắc?',
    sideA:
      'Bên A (Kỷ luật tiết kiệm tối đa): Cắt giảm triệt để chi tiêu không thiết yếu ngay từ mức lương đầu tiên để rèn thói quen sống dưới mức thu nhập và tích lũy vốn sớm.',
    sideB:
      'Bên B (Tập trung tăng thu nhập): Tiết kiệm có giới hạn sàn (không thể cắt dưới mức sống cơ bản), trong khi đầu tư tiền bạc và thời gian để nâng cấp kỹ năng tạo thu nhập có biên độ tăng trưởng không giới hạn.',
  },
  // 4. Source Check
  {
    id: 'src-miracle-supplement',
    type: 'source_check',
    title: 'Bài viết "Nghiên cứu mới chứng minh thức uống giải độc tăng 300% trí nhớ"',
    domainTag: 'Kiểm chứng thông tin',
    promptText:
      'Một trang fanpage có tên "Sống Khỏe Tự Nhiên 24/7" đăng bài: “Các nhà khoa học hàng đầu châu Âu vừa công bố nghiên cứu chấn động: uống tinh chất thảo dược X mỗi sáng giúp tăng 300% khả năng ghi nhớ sau 14 ngày và ngăn ngừa lão hóa não tuyệt đối. Hàng ngàn khách hàng đã dùng thử và xác nhận hiệu quả! Đặt mua ngay cuối bài viết trước khi hết ưu đãi 50%.”',
    sourceMeta:
      'Không dẫn tên trường đại học, không có đường dẫn tạp chí khoa học bình duyệt (peer-reviewed), cuối bài gắn link bán sản phẩm trực tiếp.',
  },
  {
    id: 'src-economic-forecast',
    type: 'source_check',
    title: 'Video ngắn dự báo "Tiền mặt sẽ mất 80% giá trị trong 6 tháng tới"',
    domainTag: 'Kinh tế & Truyền thông',
    promptText:
      'Một kênh video cá nhân đăng clip dài 90 giây với nhạc nền kịch tính, trích dẫn một biểu đồ cung tiền cắt ngắn không ghi trục thời gian, khẳng định lạm phát sắp tăng phi mã 80% trong nửa năm tới và khuyên người xem rút sạch tiết kiệm chuyển sang mua gói tư vấn tài sản độc quyền của chủ kênh.',
    sourceMeta:
      'Biểu đồ bị cắt ngữ cảnh gốc từ Ngân hàng Trung ương, sử dụng ngôn từ kích hoạt nỗi sợ khẩn cấp (FOMO / Panic).',
  },
];

export const STARTER_LESSONS: Record<string, StructuredLesson> = {
  'ct-claims-assumptions': {
    topicId: 'ct-claims-assumptions',
    domainId: 'critical-thinking',
    title: 'Xác định Tuyên bố cốt lõi và Bóc tách Giả định ngầm',
    domainName: 'Tư Duy Phản Biện',
    estimatedMinutes: 20,
    openingQuestion:
      'Nếu hai người cùng nghe một lời khuyên “Hãy nghỉ việc ổn định để ra khởi nghiệp ngay khi còn trẻ”, vì sao một người xem đó là kim chỉ nam đổi đời còn người kia lại thấy đó là cái bẫy rủi ro?',
    epistemicNote:
      'Sự thật phương pháp luận (Logic học & Nhận thức luận): Mọi lập luận đều đứng trên các tiền đề; nếu tiền đề ngầm sai hoặc chỉ đúng một phần, kết luận không thể tự động vững chắc.',
    terminology: [
      {
        termVi: 'Tuyên bố cốt lõi',
        termEn: 'Core Claim',
        simpleExplanation: 'Điều chính yếu nhất mà người nói hoặc người viết đang muốn thuyết phục bạn tin là đúng hoặc nên làm.',
        realWorldExample:
          'Khi một bài viết dài nói về xu hướng công nghệ và chốt lại "Bạn phải nghỉ việc văn phòng ngay để khởi nghiệp", câu chốt đó chính là tuyên bố cốt lõi.',
      },
      {
        termVi: 'Giả định ngầm',
        termEn: 'Hidden Assumption / Unstated Premise',
        simpleExplanation: 'Niềm tin được người nói mặc nhiên coi là hiển nhiên đúng mà không hề nêu ra hay chứng minh.',
        realWorldExample:
          'Câu "Khóa học này đắt gấp ba nơi khác nên chắc chắn chất lượng tốt hơn" mang giả định ngầm rằng giá bán luôn tỷ lệ thuận với chất lượng giáo dục.',
      },
    ],
    part1Intro:
      'Trong cuộc sống hàng ngày, chúng ta hiếm khi bị thuyết phục bởi những lý lẽ hoàn toàn vô lý. Thay vào đó, chúng ta thường bị cuốn theo những nhận định nghe rất xuôi tai vì chúng dựa trên những điều "ai cũng tưởng là hiển nhiên". Học cách tách riêng Tuyên bố (họ đang khẳng định điều gì?) và Giả định ngầm (họ đang mặc định điều gì là đúng?) giống như việc bật đèn kiểm tra móng nhà trước khi quyết định mua ngôi nhà đó.',
    part2Essence:
      'Một lập luận hoàn chỉnh luôn gồm: Bằng chứng nổi + Giả định ẩn → Kết luận (Tuyên bố). Phần lớn các cuộc tranh cãi bế tắc hoặc quyết định sai lầm cá nhân xảy ra không phải vì hai bên thiếu thông tin bề mặt, mà vì mỗi người đang đứng trên một giả định ngầm khác nhau mà không nhận ra. Khi bạn gọi tên được giả định ngầm, lập luận đó lập tức chuyển từ "chân lý hiển nhiên" thành "một giả thuyết có điều kiện cần kiểm chứng".',
    part3Examples: [
      {
        context: 'Công việc & Sự nghiệp',
        scenario:
          'Nhận định: "Anh Nam làm chuyên môn kỹ thuật xuất sắc nhất phòng, nên đề bạt anh ấy làm Trưởng phòng quản lý 20 người là hợp lý nhất."',
        insight:
          'Giả định ngầm ở đây là: kỹ năng làm chuyên môn giỏi đồng nghĩa với kỹ năng lãnh đạo, giao việc và phát triển con người giỏi (trong thực tế quản trị, đây là hai nhóm năng lực rất khác nhau).',
      },
      {
        context: 'Tài chính & Đời sống',
        scenario:
          'Nhận định: "Khu đất này 5 năm qua năm nào cũng tăng giá 15%, mua bây giờ sang năm chắc chắn có lời."',
        insight:
          'Giả định ngầm: xu hướng giá trong quá khứ sẽ tự động lặp lại tuyến tính trong tương lai mà không chịu sự thay đổi của lãi suất, thanh khoản hay chu kỳ tín dụng.',
      },
      {
        context: 'Xã hội & Giáo dục',
        scenario:
          'Nhận định: "Nhiều tỷ phú công nghệ bỏ học đại học mà vẫn thành công vang dội, chứng tỏ bằng đại học không còn giá trị."',
        insight:
          'Giả định ngầm: mẫu số cực nhỏ những người thành công ngoại biệt đại diện cho xác suất thành công chung của toàn bộ những người bỏ học (bỏ qua hàng vạn người thất bại không lên báo).',
      },
    ],
    part4CounterPerspectives: [
      'Góc nhìn thực tiễn: Trong tình huống khẩn cấp cần phản ứng nhanh (ví dụ an toàn giao thông, cấp cứu), việc dừng lại bóc tách mọi giả định ngầm có thể làm chậm trễ hành động cần thiết; khi ấy các quy tắc kinh nghiệm (heuristics) có giá trị sinh tồn riêng.',
      'Góc nhìn giao tiếp xã hội: Nếu trong trò chuyện đời thường lúc nào cũng chất vấn giả định của bạn bè như thẩm phán, ta dễ gây mệt mỏi cho mối quan hệ. Cần ưu tiên áp dụng công cụ này cho các quyết định quan trọng và tự kiểm tra chính suy nghĩ của mình trước tiên.',
    ],
    part5SocraticQuestions: [
      'Hãy nghĩ về một lời khuyên nghề nghiệp hoặc tài chính bạn từng nghe rất nhiều lần: tuyên bố cốt lõi của lời khuyên đó là gì, và nó đang dựa trên ít nhất 2 giả định ngầm nào?',
      'Điều kiện thực tế nào nếu thay đổi sẽ khiến lời khuyên đó trở nên sai lầm hoặc nguy hiểm?',
      'Tại sao chúng ta rất dễ phát hiện giả định vô lý trong lập luận của người mình không thích, nhưng lại gần như "mù" trước giả định ngầm trong niềm tin của chính mình?',
    ],
    part6ActionExercise: {
      title: 'Thực hành "Soi chiếu 3 dòng" với một quyết định thực tế của bạn',
      instructions:
        'Chọn 1 quyết định hoặc 1 niềm tin bạn đang giữ trong tuần này (về việc học, chi tiêu, hay công việc). Viết ngắn gọn vào khung thực hành bên dưới theo 3 ý: (1) Tuyên bố tôi đang tin là gì? (2) Hai giả định tôi đang mặc nhiên coi là đúng là gì? (3) Nếu một trong hai giả định đó sai thì tôi sẽ điều chỉnh kế hoạch ra sao?',
      reflectionCriteria:
        'Đánh giá dựa trên việc bạn có tách bạch được tuyên bố khỏi giả định ẩn và nêu được điều kiện giới hạn cụ thể hay không.',
    },
    part7Summary: {
      keyTakeaways: [
        'Tuyên bố cốt lõi cho biết điểm đến của lập luận; giả định ngầm là cây cầu vô hình nối dữ kiện tới điểm đến đó.',
        'Một tuyên bố chỉ vững chắc tối đa bằng mắt xích giả định yếu nhất nằm bên dưới nó.',
        'Đặt câu hỏi "Điều gì phải đúng để kết luận này đúng?" là cách nhanh nhất để phát hiện giả định ngầm.',
      ],
      foodForThought:
        'Niềm tin nào về giới hạn bản thân mà bạn đã mang theo suốt nhiều năm qua thực chất chỉ là một giả định chưa bao giờ được kiểm chứng lại?',
      concreteAction:
        'Hôm nay, khi đọc một tiêu đề tin tức hoặc bài phân tích thu hút sự chú ý của bạn, hãy dừng lại 60 giây để viết ra 1 giả định ngầm của tác giả trước khi chia sẻ hoặc đồng tình.',
    },
    generatedAt: '2026-11-01T08:00:00.000Z',
  },
  'phil-what-is': {
    topicId: 'phil-what-is',
    domainId: 'philosophy',
    title: 'Triết học là gì và vì sao cần cho đời sống thực tế?',
    domainName: 'Học Triết Học',
    estimatedMinutes: 20,
    openingQuestion:
      'Nếu một người đạt được mọi tiêu chuẩn thành công mà xã hội xung quanh đặt ra nhưng mỗi tối vẫn cảm thấy trống rỗng, điều gì thực sự đã bị bỏ quên trong hành trình đó?',
    epistemicNote:
      'Quan điểm & Phương pháp luận triết học: Triết học không cung cấp một đáp án đóng khung duy nhất mà cung cấp công cụ tư duy để con người tự thẩm định các giá trị sống.',
    terminology: [
      {
        termVi: 'Triết học',
        termEn: 'Philosophy (Philosophia – Tình yêu sự thông thái)',
        simpleExplanation: 'Hoạt động suy tư có hệ thống và có lý lẽ về những câu hỏi nền tảng nhất của cuộc sống, tri thức và đạo đức.',
        realWorldExample:
          'Khoa học giúp bạn chế tạo chiếc điện thoại nhanh hơn; triết học giúp bạn tự hỏi: chiếc điện thoại đó đang làm cuộc đời mình phong phú hơn hay đang lấy mất sự hiện diện của mình bên người thân?',
      },
      {
        termVi: 'Cuộc đời được thẩm xét',
        termEn: 'The Examined Life',
        simpleExplanation: 'Lối sống chủ động nhìn lại động cơ, giá trị và lựa chọn của bản thân thay vì trôi theo thói quen hay áp lực đám đông.',
        realWorldExample:
          'Thay vì mua một món đồ xa xỉ chỉ vì đồng nghiệp đều có, bạn dừng lại tự hỏi điều gì thực sự mang lại sự bình an và tự trọng cho mình.',
      },
    ],
    part1Intro:
      'Nhiều người nghĩ triết học là những cuốn sách dày đầy thuật ngữ trừu tượng chỉ dành cho giảng đường. Thực ra, ngay khoảnh khắc bạn tự hỏi "Mình cố gắng làm việc ngày đêm vì điều gì?", "Làm sao biết thông tin này là thật?", hay "Trong tình huống khó xử này, làm thế nào mới là tử tế?", bạn đã đang làm triết học. Triết học đơn giản là nghệ thuật suy nghĩ rõ ràng về những điều quan trọng nhất khi không có sẵn công thức tính toán.',
    part2Essence:
      'Mỗi con người đều đang sống dựa trên một "triết lý ngầm" — tức bộ quy tắc về cái gì đáng giá, cái gì là thành công, cái gì là đúng sai. Nếu ta không chủ động học cách suy xét triết học, ta không hề "không có triết lý", mà ta chỉ vô tình vay mượn một cách thiếu chọn lọc triết lý sống từ quảng cáo, mạng xã hội hoặc nỗi sợ của người xung quanh. Triết học đưa những tiền đề vô thức đó ra ngoài ánh sáng của lý tính để bạn tự chủ lựa chọn.',
    part3Examples: [
      {
        context: 'Lựa chọn nghề nghiệp',
        scenario:
          'Đứng trước hai công việc: một bên lương cao hơn 40% nhưng yêu cầu quảng bá sản phẩm kém chất lượng gây hại người dùng; một bên thu nhập vừa phải nhưng tạo giá trị thật.',
        insight:
          'Đây không chỉ là bài toán tài chính mà là bài toán đạo đức học và ý nghĩa sống: bạn định nghĩa "lợi ích của tôi" tách rời hay gắn liền với phẩm giá cá nhân?',
      },
      {
        context: 'Đối diện nghịch cảnh cá nhân',
        scenario:
          'Một dự án tâm huyết thất bại do biến động thị trường nằm ngoài tầm kiểm soát.',
        insight:
          'Triết học Khắc kỷ (Stoicism) giúp phân tách rạch ròi giữa phần ta kiểm soát được (nỗ lực, thái độ học hỏi tiếp theo) và phần nằm ngoài quyền kiểm soát (kết quả đã qua), giúp giữ vững nội lực thay vì suy sụp.',
      },
    ],
    part4CounterPerspectives: [
      'Phê phán thực dụng: Nếu chỉ mải mê suy tư và chất vấn mọi khái niệm mà không bước ra hành động, triết học có nguy cơ biến thành sự tê liệt phân tích (analysis paralysis) hoặc trò chơi chữ nghĩa xa rời đời thực.',
      'Góc nhìn khoa học thực nghiệm: Nhiều câu hỏi mà triết học cổ đại từng suy đoán bằng lý trí thuần túy (như cấu tạo vật chất hay cơ chế não bộ) ngày nay cần phải dựa vào dữ liệu thực nghiệm của vật lý học và thần kinh học thay vì chỉ suy luận trên bàn giấy.',
    ],
    part5SocraticQuestions: [
      'Bạn nghĩ gì về nhận định của Socrates: "Một cuộc đời không được tự thẩm xét thì không đáng sống"? Liệu một người sống giản dị, chẳng bao giờ đặt câu hỏi triết học phức tạp có thể vẫn rất hạnh phúc không?',
      'Giả định nào đang nằm phía sau định nghĩa về "một cuộc sống thành công" mà bạn đang theo đuổi lúc này?',
      'Nếu ngày mai mọi người xung quanh không ai còn biết bạn giàu hay nghèo, chức vụ cao hay thấp, bạn sẽ giữ lại hoạt động nào và từ bỏ hoạt động nào trong lịch trình hiện tại?',
    ],
    part6ActionExercise: {
      title: 'Kiểm kê "Triết lý sống thực tế" qua lịch sử sử dụng thời gian',
      instructions:
        'Nhìn lại 3 ngày gần nhất của bạn. Liệt kê 2 việc ngốn nhiều thời gian/tâm trí nhất của bạn ngoài giờ ngủ, sau đó tự trả lời trung thực: hành động thực tế đó đang phản ánh giá trị ưu tiên nào, và nó có khớp với giá trị bạn vẫn nói là quan trọng nhất đời mình không?',
      reflectionCriteria:
        'Khả năng tự quan sát trung thực khoảng cách giữa giá trị tuyên bố (stated values) và giá trị thực hành (lived values), không tự bào chữa.',
    },
    part7Summary: {
      keyTakeaways: [
        'Triết học bắt đầu khi ta ngừng sống theo quán tính và đặt câu hỏi về gốc rễ của chân lý, đạo đức và ý nghĩa.',
        'Ai cũng sống theo một triết lý nào đó; khác biệt nằm ở chỗ triết lý ấy do bạn tự suy xét hay tiếp nhận thụ động từ bên ngoài.',
        'Triết học lành mạnh luôn đi đôi với hành động thực tế và tinh thần cởi mở trước góc nhìn đối lập.',
      ],
      foodForThought:
        'Giữa sự an tâm của việc tin theo số đông và sự cô đơn đôi khi có của việc tự suy nghĩ độc lập, điều gì đáng giá hơn với bạn trong dài hạn?',
      concreteAction:
        'Dành 10 phút tối nay viết ra 3 nguyên tắc mà bạn không sẵn lòng đánh đổi dù có lợi ích ngắn hạn hấp dẫn.',
    },
    generatedAt: '2026-11-01T08:00:00.000Z',
  },
};
