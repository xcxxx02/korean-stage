# Korean Stage 零基础用户体验审查

日期：2026-08-23

## 审查范围

目标用户：完全不会韩语、不会读 Hangul、只会英语的初学者。

目标任务：从首页进入课程，学习第一个表达，学习词汇与语法，完成练习和对话，并理解自己的学习进度。

证据为本轮重新捕获的 1440 × 1024 页面截图。没有修改网站代码。

## 总体判断

网站视觉统一，许多韩语旁边确实有英文；但它目前更像“符合 coursework 要求的内容展示与提交检查器”，还不是一条由零基础学习者理解并完成的教学路径。最大问题不是韩文数量，而是学习者不知道先做什么、为什么这样做，以及如何判断自己真的学会了。

## 逐步审查

1. `01-home.png` — 首页：需要改善。课程目标清楚，但 `Lec 1` 是课程内部术语；课程地图与顶部分类导航采用两套结构。`Continue learning` 会记住最近访问页，即使 0/7 完成也可能直接回到 Unit 3，零基础用户容易从中间开始。
2. `02-learn.png` — Unit 1：高风险。页面要求 `Say it aloud`，但音频全部不可用；用户只能看 romanization 猜发音。`Replace 미나 with your own name` 没解释辅音结尾姓名要换成 `이에요`，可能直接教出错误句子。三个 readiness 句子不是可验证任务，却能直接 `Mark unit complete`。
3. `03-vocabulary.png` — Vocabulary review：只能作为速查表。Romanization 没有标签、音频或易读发音提示；`Countries & Nationalities` 实际只展示国家词，没有 nationality 表达。页面叫 review，但主导航没有先区分 Learn 与 Review。
4. `04-grammar.png` — Grammar 入口：需要前置教学。三个卡片都用韩语语法形式作为主标题，并假设用户理解“名词以辅音/元音结尾”。没有 `Start here`、推荐顺序或例句预览，卡片也缺少明显的进入提示。
5. `05-grammar-lesson.png` — Grammar 详情：零基础阻塞点。规则本身没有解释用户怎样从 Hangul 判断 final consonant。第一题要求判断 `민수` 的结尾，但页面没有读音、音节拆解或可视化 받침，因此不会读韩语的人只能猜。
6. `06-practice.png` / `07-practice-reveal.png` — Flashcards：零基础阻塞点。正面只有 `중국`，没有声音、读音提示或学习线索；翻面才出现英文和 `jungguk`，但没有解释它是 romanization，也不够接近英语用户可直接模仿的发音。只有翻面、前后和 shuffle，没有 `I knew it / Review again`，所以不形成真正的学习反馈。
7. `08-dialogue.png` — Dialogue：目前主流程不可用。页面说 `Watch first`，但视频不可播放，巨大的 missing-video 区域把实际双语台词推到首屏以下。台词虽有英文，却没有 romanization、分块发音或慢速练习；零基础用户无法按要求 rehearse Korean。
8. `09-team.png` — Team：对制作团队健康，对学习者位置错误。这是姓名、学生证、录音、评分与提交检查页面，不属于学习导航。它与 Learn/Practice 同级，会让普通学习者误以为是课程内容或自己的学习成绩。
9. `10-unit3-vocabulary.png` — Unit 3：目前最接近可用的初学者页面。韩英、romanization、发音提示、例句与顺序按钮都在；但同一概念重复出现在词汇轨道、详情、transcript、句型、替换示例和语法提示中，同时夹杂 `Member 1`、录制灯光/噪音等作者任务，学习重点仍不够集中。

## 最高优先级问题

### 1. 导航混合了三种不同目的

- 学习课程：Units 1–7
- 复习工具：Vocabulary review、Practice
- 制作/提交管理：Team、recording checklist

这三类内容应该有清楚的层级。对初学者，主路径应是 `Start → Learn in order → Practice → Dialogue`；Vocabulary review 可作为工具，Team 应进入独立的 project/admin 区域。

### 2. 网站假设用户已经会读 Hangul

Grammar、flashcards 和 dialogue 都依赖用户识别韩文字形或结尾音，但课程没有 Hangul/音节基础，也没有一致的 beginner pronunciation。必须在需要判断辅音/元音之前教会用户：怎样看一个音节块、什么是 final consonant，以及最少量的发音规则。

### 3. 指令与可用状态互相矛盾

`Say it aloud`、`Listen`、`Watch first`、`Rehearse` 都依赖真实音视频，但当前媒体不可用。诚实显示 missing state 是正确的，不过 learner UI 不应让不可完成的动作成为第一步。真实媒体加入前，应提供不冒充真人录音的文字分块、口型/音节提示和清楚的开发状态说明。

### 4. 完成状态不等于学会

Unit 1 可以直接标完成，Vocabulary review 没有掌握反馈，flashcards 只翻面，首页又按访问路径继续。需要以可验证的小任务驱动完成，例如听/读后选择含义、完成一次替换句、自己标记 `Need practice / Got it`，再决定下一步。

### 5. 学习内容与 coursework 证据混在一起

`Member 1`、lighting、background noise、3–5 count、exactly three exercises、submission readiness 都是团队制作或评分信息，不应占据学习者的主要界面。它们可以保留，但应该放到 Team/Project dashboard。

## 可访问性风险

- 文档语言是 `en`，本轮检查到的韩语文本没有任何 `lang="ko"` 标记；屏幕阅读器可能用英语语音错误朗读韩语。
- 大量音频按钮被禁用，虽然旁边有文字说明，但键盘与辅助技术用户没有等价的发音学习方式。
- Romanization 多处使用较小的灰色文字；截图显示它的视觉优先级很低，实际对比度仍需工具测量。
- 优点：主要页面有一个 H1，核心区域具有语义标签，当前步骤有文字与 `aria-current`，状态不只依赖颜色。

## 建议顺序

1. 先重构课程信息架构与主路径，而不是继续美化单个页面。
2. 在 Unit 1 前或其中加入 3–5 分钟的 Hangul survival guide。
3. 为所有学习页统一四层呈现：Korean → plain English → beginner pronunciation → example/use case。
4. 把 Team 与 recording/submission checklist 移出学习者主导航。
5. 用一个完整的 beginner task 重做完成机制，再扩展到其他单元。
6. 最后才做视觉细节与动效调整。

## 证据限制

本轮没有真人音视频，因此无法评估实际发音、字幕同步、语速或视频教学质量。截图和 DOM 检查不能证明完整 WCAG 合规；颜色对比、全键盘路径、缩放与屏幕阅读器仍需单独测试。
