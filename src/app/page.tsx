"use client";

import React, { useState, useEffect } from "react";
import {
  GRADES_DATA,
  SUBJECT_CATEGORIES,
  Boss,
  GradeLevel,
} from "@/data/curriculumData";
import RoadmapView from "@/components/RoadmapView";
import BossCard from "@/components/BossCard";
import ParentGuideSection from "@/components/ParentGuideSection";
import InteractiveBattleModal from "@/components/InteractiveBattleModal";
import {
  Swords,
  Shield,
  Trophy,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  RotateCcw,
  Save,
} from "lucide-react";

const SUBJECT_FILTERS: Record<string, string[]> = {
  mandarin: ["國語文"],
  math: ["數學領域"],
  nature: ["生活課程", "自然科學"],
  social: ["社會領域"],
  english: ["英語文"],
  tech: ["科技資訊"],
};

export default function HomePage() {
  const [currentGrade, setCurrentGrade] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"hero" | "parent">("hero");
  const [defeatedBosses, setDefeatedBosses] = useState<string[]>([]);
  const [battleBoss, setBattleBoss] = useState<Boss | null>(null);
  const [showTrophyCabinet, setShowTrophyCabinet] = useState(false);

  // 初始化讀取本機存檔
  useEffect(() => {
    try {
      const saved = localStorage.getItem("elementary_hero_defeated_bosses");
      if (!saved) return;
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return;
      const knownBossIds = new Set(
        GRADES_DATA.flatMap((grade) => grade.bosses.map((boss) => boss.id))
      );
      const validBossIds: string[] = [];
      for (const id of parsed) {
        if (
          typeof id === "string" &&
          knownBossIds.has(id) &&
          !validBossIds.includes(id)
        ) {
          validBossIds.push(id);
        }
      }
      // localStorage 僅能在客戶端讀取，於 effect 同步可避免 hydration 不一致
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDefeatedBosses(validBossIds);
    } catch {
      // 容錯防禦：忽略損毀的本機存檔
    }
  }, []);

  const handleVictory = (bossId: string) => {
    setDefeatedBosses((prev) => {
      if (prev.includes(bossId)) return prev;
      const next = [...prev, bossId];
      try {
        localStorage.setItem(
          "elementary_hero_defeated_bosses",
          JSON.stringify(next)
        );
      } catch {}
      return next;
    });
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        "確定要重設所有魔王討伐進度與戰利品存檔嗎？此動作將清除瀏覽器的 LocalStorage 紀錄。"
      )
    ) {
      try {
        localStorage.removeItem("elementary_hero_defeated_bosses");
      } catch {}
      setDefeatedBosses([]);
    }
  };

  const currentGradeData: GradeLevel =
    GRADES_DATA.find((g) => g.grade === currentGrade) || GRADES_DATA[0];

  // 篩選魔王
  const filteredBosses = currentGradeData.bosses.filter((b) => {
    if (selectedSubject === "all") return true;
    const subjects = SUBJECT_FILTERS[selectedSubject];
    return subjects ? subjects.includes(b.subject) : true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 頂部裝飾光網背景 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.12),rgba(255,255,255,0))] pointer-events-none" />

      {/* 導航欄 Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              🗡️
            </div>
            <div>
              <div className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
                小學生的勇者之路
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                  教育部最新深化課綱・AI數位科技版
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                國小 1~6 年級 RPG 課業地圖與家長通關導航
              </div>
            </div>
          </div>

          {/* 視角切換器 */}
          <div className="flex items-center gap-2">
            <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center">
              <button
                onClick={() => setViewMode("hero")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "hero"
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">勇者視角 (小孩)</span>
                <span className="sm:hidden">勇者</span>
              </button>

              <button
                onClick={() => setViewMode("parent")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "parent"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">公會指南 (家長)</span>
                <span className="sm:hidden">家長</span>
              </button>
            </div>

            <button
              onClick={() => setShowTrophyCabinet(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:bg-slate-800 transition-colors relative"
              title="查看已獲得的戰利品"
            >
              <Trophy className="w-5 h-5" />
              {defeatedBosses.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center">
                  {defeatedBosses.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 主體內容 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 relative z-10">
        {/* Hero 主視覺橫幅 */}
        <section className="relative rounded-3xl p-6 sm:p-10 border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-amber-400">
              <Sparkles className="w-4 h-4" />
              把作業變成魔王，把知識變成神裝
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              別害怕課本上的大魔王！
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                每個小學生，都是拯救世界的勇者！
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              根據台灣教育部最新<strong>深化微調課綱</strong>與《中小學生成式AI教學指引》規範，全台小學分為三大學習階段。
              我們將各年級的關鍵單元、考試難點與數位科技素養，化身為守門魔王！
              陪同孩子清晰理解每個年級必備核心能力，家長也能從容掌握 AI 時代的破關陪讀心法。
            </p>

            {/* 快速特色標籤 */}
            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                低、中、高年級三階段全覆蓋
              </span>
              <span className="px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                教育部最新深化課綱＋生成式AI指引
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                雙向切換：勇者戰鬥 × 家長錦囊
              </span>
            </div>
          </div>
        </section>

        {/* 教育部最新課綱重點政策速覽卡片 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-indigo-500/30 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
                <span>📢</span> 教育部最新課綱政策快訊
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                台灣課綱已轉型「動態深化微調機制」，不再實施10年全面大翻修（無118課綱）
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                教育部正式定調課綱不再搞「10年一次的大翻轉」，而是持續推動<strong>「最新深化微調版」</strong>！本平台第一時間融合教育部最新《中小學生成式AI教學指引》、《數位教學指引 3.0》、生生用平板自主學習、以及本土語文部定必修，讓家長與孩子穩穩站在最新教育起跑線上。
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0 text-[11px]">
              <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-indigo-200">
                <div className="font-bold text-amber-400">🤖 生成式 AI 素養</div>
                <div className="text-[10px] text-slate-400">提示詞技巧與數位防偽</div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-indigo-200">
                <div className="font-bold text-emerald-400">📱 生生用平板政策</div>
                <div className="text-[10px] text-slate-400">數位自主學習與視力自律</div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-indigo-200">
                <div className="font-bold text-rose-400">🗣️ 本土語文必修</div>
                <div className="text-[10px] text-slate-400">多元文化與在地生活體驗</div>
              </div>
            </div>
          </div>
        </section>

        {/* 台灣國小 1~6 年級冒險地圖 (Roadmap) */}
        <section id="roadmap" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>🗺️</span> 勇者學習地圖 (Roadmap)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                點擊年級站點，進入該年級的專屬冒險地圖與魔王試煉場
              </p>
            </div>
          </div>

          <RoadmapView
            currentGrade={currentGrade}
            onSelectGrade={setCurrentGrade}
            defeatedBosses={defeatedBosses}
          />
        </section>

        {/* 當前年級橫幅資訊 */}
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {currentGradeData.stageName}
              </div>
              <h3 className="text-2xl font-black text-white mt-0.5">
                {currentGradeData.levelName}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {currentGradeData.overview}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-slate-400">本年級核心技能：</span>
              <div className="flex flex-wrap gap-1.5">
                {currentGradeData.keySkills.slice(0, 2).map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-800 text-amber-300 border border-slate-700"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 若處於家長模式，展示專屬指引手冊 */}
          {viewMode === "parent" ? (
            <ParentGuideSection gradeData={currentGradeData} />
          ) : (
            /* 勇者模式下的年級快速任務指引 */
            <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xl shrink-0">
                  ⚔️
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    今日勇者討伐任務進行中
                  </div>
                  <div className="text-xs text-slate-400">
                    本年級共有 {currentGradeData.bossCount} 隻大魔王，擊敗魔王可獲得專屬戰利品！
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">
                  進度：
                  <span className="text-amber-400 font-bold ml-1">
                    {
                      currentGradeData.bosses.filter((b) =>
                        defeatedBosses.includes(b.id)
                      ).length
                    }
                  </span>{" "}
                  / {currentGradeData.bossCount} 隻
                </span>
              </div>
            </div>
          )}
        </section>

        {/* 魔王討伐競技場 (Boss Battles) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>👾</span> {currentGrade} 年級魔王試煉副本
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                點選科目分類，挑戰各科目代表性課程與作業魔王
              </p>
            </div>

            {/* 科目篩選按鈕 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {SUBJECT_CATEGORIES.map((cat) => {
                const isActive = selectedSubject === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedSubject(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-slate-100 text-slate-950 shadow-md"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 魔王卡片網格 */}
          {filteredBosses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBosses.map((boss) => (
                <BossCard
                  key={boss.id}
                  boss={boss}
                  isDefeated={defeatedBosses.includes(boss.id)}
                  onOpenBattle={(b) => setBattleBoss(b)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
              該領域在此年級暫無專屬魔王，請切換至「全部領域」查看！
            </div>
          )}
        </section>

        {/* 台灣國小最新深化課綱三大學習階段核心素養 */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              台灣教育部最新深化課綱導覽
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              國民小學三大學習階段架構（AI 與數位時代增修版）
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              依據十二年國民基本教育課程綱要最新動態微調指引，國小階段全面落實「自主學習、科技素養、本土關懷與全球視野」。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm">
                第一階段
              </div>
              <h4 className="text-base font-bold text-white">
                國小一、二年級 (低年級)・感知奠基
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                生活自理與日常常規適應。國語文重點在於注音符號拼讀與繪本自主閱讀；數學著重百以內數感、加減直式運算與九九乘法熟練；結合「生活課程」進行動植物生態與校園探索；全面落實本土語文必修生活化體驗，並養成生生用平板 3010 護眼健康習慣。
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-sm">
                第二階段
              </div>
              <h4 className="text-base font-bold text-white">
                國小三、四年級 (中年級)・邏輯開拓
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                學科獨立分流！生活課程分化為「自然科學」與「社會領域」。數學迎來除法、小數、分數與幾何角度；國語強化段落摘要與心智圖思維；英語開展情境溝通；接軌教育部《數位教學指引 3.0》，透過 Scratch 圖形化積木建立演算法循序與邏輯拆解運算思維。
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-sm">
                第三階段
              </div>
              <h4 className="text-base font-bold text-white">
                國小五、六年級 (高年級)・思辨整合
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                高階抽象思維與批判思考！數學攻克因數倍數、異分母分數、比與比值、圓面積與速率；國語跨入議論文與古典文學啟蒙；深度導入教育部《中小學生成式AI教學指引》——學習提問提示詞（Prompting）、批判性事實查核（Fact-checking）、防範假訊息與 Deepfake，並結合 SDGs 永續議題成為現代地球公民！
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 戰利品成就陳列室 Modal */}
      {showTrophyCabinet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h3 className="text-xl font-black text-white">勇者榮譽戰利品庫</h3>
              </div>
              <button
                onClick={() => setShowTrophyCabinet(false)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                關閉
              </button>
            </div>

            {defeatedBosses.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                目前尚未討伐任何魔王，趕快進入關卡挑戰吧！
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GRADES_DATA.flatMap((g) => g.bosses)
                  .filter((b) => defeatedBosses.includes(b.id))
                  .map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-xl bg-slate-800/80 border border-amber-500/30 flex items-start gap-3"
                    >
                      <div className="text-2xl">{b.icon}</div>
                      <div>
                        <div className="text-xs font-bold text-amber-300">
                          {b.lootReward.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          來自：{b.name}（{b.subject}）
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                          {b.lootReward.desc}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 存檔狀態與管理 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <Save className="w-3.5 h-3.5" />
                <span>存檔狀態：已即時同步至 LocalStorage (Key: elementary_hero_defeated_bosses)</span>
              </div>
              {defeatedBosses.length > 0 && (
                <button
                  onClick={handleResetProgress}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/50 flex items-center gap-1.5 text-[11px] transition-colors"
                  title="清空瀏覽器 LocalStorage 中的通關存檔"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  重設所有討伐進度
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 互動魔王戰 Modal */}
      {battleBoss && (
        <InteractiveBattleModal
          key={battleBoss.id}
          boss={battleBoss}
          onClose={() => setBattleBoss(null)}
          onVictory={handleVictory}
          isDefeated={defeatedBosses.includes(battleBoss.id)}
        />
      )}

      {/* 底部 Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-bold text-slate-300">
              小學生的勇者之路 (Elementary Hero&apos;s Quest)
            </div>
            <div>
              本專案依據教育部最新深化微調課綱、《中小學生成式AI教學指引》與《數位教學指引 3.0》編制。
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 text-slate-400">
            <span className="text-amber-400 font-semibold">教育部最新深化課綱</span>
            <span>•</span>
            <span className="text-cyan-400 font-semibold">AI 與數位科技素養</span>
            <span>•</span>
            <span>RPG 遊戲化學習</span>
            <span>•</span>
            <span>親職教育導航</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
