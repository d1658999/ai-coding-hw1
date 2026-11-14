"use client";

import React from "react";
import { GradeLevel } from "@/data/curriculumData";
import {
  ShieldAlert,
  Sparkles,
  CheckCircle,
  Lightbulb,
  Heart,
  HelpCircle,
  Compass,
} from "lucide-react";

interface ParentGuideSectionProps {
  gradeData: GradeLevel;
}

export default function ParentGuideSection({ gradeData }: ParentGuideSectionProps) {
  const { parentGuide, grade, levelName, stageName } = gradeData;

  return (
    <div className="space-y-6">
      {/* 頂部引導看板 */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              公會會長室・{stageName}
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <span>🛡️</span>
              {grade} 年級家長專屬導航手冊
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              根據台灣教育部 108 課綱精神，國小學習重點在於「素養與解決問題能力」而非死背。以下是 {grade} 年級孩子最常見的挫折點與專屬陪讀指南。
            </p>
          </div>

          {/* 應援金句卡 */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 max-w-sm shrink-0">
            <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              本年級家長魔法應援句
            </div>
            <p className="text-xs font-medium text-amber-200 italic leading-relaxed">
              {parentGuide.parentMagicSpell}
            </p>
          </div>
        </div>
      </div>

      {/* 雙欄分析：最常見卡關點 vs 破關對策 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 卡關痛點 */}
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>【最常卡關點】孩子可能遇到的學習深水區</span>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-900/10 border border-rose-500/20 text-xs text-rose-200 font-semibold leading-relaxed">
            {parentGuide.criticalBottleneck}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            國小很多階段會出現思維轉型（從具象到抽象、從字詞到篇章）。當孩子在這些題目表現遲緩或反抗時，請理解這不是孩子粗心偷懶，而是大腦神經正在奮力建立新迴路。
          </p>
        </div>

        {/* 陪讀心法對策 */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Lightbulb className="w-5 h-5" />
            <span>【公會錦囊】不生氣、不破壞親子關係的引導策略</span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-900/10 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed font-medium">
            {parentGuide.solutionStrategy}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            陪伴的精髓在於「拆解步驟」與「具體生活實例代入」。多問開放式問題，讓孩子扮演老師教你一次，理解深度會瞬間提高。
          </p>
        </div>
      </div>

      {/* 本年級能力檢核清單 */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-400" />
            {grade} 年級勇者核心能力檢核清單（108課綱對照）
          </h4>
          <span className="text-xs text-slate-400">可作為家長定期觀察孩子發展之參考</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {parentGuide.growthChecklist.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-850/80 border border-slate-750 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span className="text-xs text-slate-300 leading-relaxed font-medium">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
