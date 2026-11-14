"use client";

import React from "react";
import { GradeLevel, GRADES_DATA } from "@/data/curriculumData";
import { MapPin, Trophy, Shield, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

interface RoadmapViewProps {
  currentGrade: number;
  onSelectGrade: (grade: number) => void;
  defeatedBosses: string[];
}

export default function RoadmapView({
  currentGrade,
  onSelectGrade,
  defeatedBosses,
}: RoadmapViewProps) {
  const totalBosses = GRADES_DATA.reduce((acc, g) => acc + g.bosses.length, 0);
  const clearedCount = defeatedBosses.length;
  const progressPercent = Math.round((clearedCount / totalBosses) * 100);

  return (
    <div className="space-y-6">
      {/* 總冒險進度看板 */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              台灣 108 課綱・國小六大冒險階段
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white">
              小學六年冒險遠征地圖 (Lv.1 ~ Lv.6)
            </h3>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
              作業與課業就是勇者路上的魔王，掌握核心觀念就是削弱魔王的終極武器！點選下方年級地標，檢視各年級的專屬課程試煉與家長破關心法。
            </p>
          </div>

          {/* 總成就徽章與進度 */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 min-w-[220px] text-right space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                全島魔王討伐率
              </span>
              <span className="text-amber-400 font-mono text-sm">
                {clearedCount} / {totalBosses} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 transition-all duration-700"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 text-left">
              已解鎖傳奇戰利品：<span className="text-amber-300 font-bold">{clearedCount}</span> 件
            </div>
          </div>
        </div>
      </div>

      {/* 互動式 1~6 年級地圖節點軌跡 */}
      <div className="relative">
        {/* 背景裝飾連接線 (桌面版) */}
        <div className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1.5 bg-slate-800 border-t border-b border-slate-700 z-0" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
          {GRADES_DATA.map((g: GradeLevel) => {
            const isSelected = currentGrade === g.grade;
            const gradeDefeated = g.bosses.filter((b) => defeatedBosses.includes(b.id)).length;
            const isGradeMastered = gradeDefeated === g.bosses.length;

            return (
              <button
                key={g.grade}
                onClick={() => onSelectGrade(g.grade)}
                className={`group text-left p-4 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-gradient-to-b from-slate-850 to-slate-900 border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.03] ring-2 ring-amber-500/30"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850/80"
                }`}
              >
                {/* 階段標籤 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isSelected
                          ? "bg-amber-500 text-slate-950"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {g.grade <= 2 ? "低年級" : g.grade <= 4 ? "中年級" : "高年級"}
                    </span>

                    {isGradeMastered ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">
                        {gradeDefeated}/{g.bossCount}
                      </span>
                    )}
                  </div>

                  {/* 等級徽章 */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-transform group-hover:scale-110 ${
                        isSelected
                          ? "bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {g.grade}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {g.grade} 年級
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Lv.{g.grade}
                      </div>
                    </div>
                  </div>

                  {/* 地區主題名 */}
                  <div className="pt-1">
                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {g.themeName}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                      {g.themeDescription}
                    </div>
                  </div>
                </div>

                {/* 底部指示 */}
                <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-amber-400 font-medium">
                    {g.bossCount} 大關卡
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? "text-amber-400 translate-x-1" : "text-slate-600"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
