"use client";

import React, { useState } from "react";
import { Boss } from "@/data/curriculumData";
import {
  Swords,
  Trophy,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  FileCheck,
  HeartHandshake,
  Check,
} from "lucide-react";

interface BossCardProps {
  boss: Boss;
  isDefeated: boolean;
  onOpenBattle: (boss: Boss) => void;
  viewMode: "hero" | "parent";
}

export default function BossCard({
  boss,
  isDefeated,
  onOpenBattle,
  viewMode,
}: BossCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
        isDefeated
          ? "bg-slate-900/90 border-emerald-500/40 shadow-emerald-500/5"
          : "bg-slate-900/80 border-slate-800 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5"
      }`}
    >
      {/* 頂部裝飾條 */}
      <div
        className={`h-1.5 w-full ${
          isDefeated
            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
            : "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
        }`}
      />

      <div className="p-5 sm:p-6 space-y-4">
        {/* 標籤分類 */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                isDefeated
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {boss.category}
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              {boss.subject}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              難度：{"★".repeat(boss.difficulty)}
              {"☆".repeat(5 - boss.difficulty)}
            </span>
            {isDefeated && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <Check className="w-3 h-3" />
                已討伐
              </span>
            )}
          </div>
        </div>

        {/* 魔王標題與簡介 */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
            {boss.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-black text-white flex items-center gap-2">
              {boss.name}
            </h4>
            <div className="text-xs text-amber-400/90 font-medium mt-0.5">
              {boss.title}
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {boss.summary}
            </p>
          </div>
        </div>

        {/* 血條與課綱指標 */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400 flex items-center gap-1">
              <span className="text-amber-400 font-bold">{boss.curriculumCode}</span>
              108課綱指標
            </span>
            <span className="font-mono text-rose-400 font-bold">
              {isDefeated ? "HP: 0 / " + boss.hp : `HP: ${boss.hp} / ${boss.hp}`}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isDefeated
                  ? "w-0 bg-slate-700"
                  : "w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500"
              }`}
            />
          </div>
        </div>

        {/* 核心素養摘記 */}
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 text-xs space-y-1">
          <div className="text-slate-300 font-medium flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>核心素養能力目標：</span>
          </div>
          <p className="text-slate-400 leading-relaxed pl-5">
            {boss.coreCompetency}
          </p>
        </div>

        {/* 魔王作業形式 */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs space-y-1">
          <div className="text-slate-300 font-medium flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>對應學校作業與評量：</span>
          </div>
          <p className="text-slate-400 leading-relaxed pl-5">
            {boss.homeworkForm}
          </p>
        </div>

        {/* 家長視角或展開區域 */}
        {(viewMode === "parent" || isExpanded) && (
          <div className="pt-3 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-200">
            {/* 家長陪讀攻略 */}
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-1.5">
              <div className="text-indigo-300 font-bold flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-indigo-400" />
                <span>公會會長（家長）陪讀秘訣：</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {boss.parentTips}
              </p>
            </div>

            {/* 魔王弱點與攻略 */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs space-y-2">
              <div className="text-amber-300 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>勇者克敵技巧（小孩必備技能）：</span>
              </div>
              <ul className="space-y-1 pl-5 list-disc text-slate-300 leading-relaxed">
                {boss.bossWeakness.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>

            {/* 掉落戰利品 */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-bold text-white">{boss.lootReward.name}</span>
                  <span className="text-[10px] text-amber-300/80 ml-2 px-1.5 py-0.5 rounded bg-amber-500/10">
                    {boss.lootReward.type}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                {boss.lootReward.desc}
              </span>
            </div>
          </div>
        )}

        {/* 底部操作按鈕 */}
        <div className="flex items-center gap-3 pt-2">
          {viewMode === "hero" && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              {isExpanded ? (
                <>
                  收起攻略 <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  查看弱點與攻略 <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}

          <div className="flex-1" />

          <button
            onClick={() => onOpenBattle(boss)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
              isDefeated
                ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20"
            }`}
          >
            {isDefeated ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                再次切磋複習
              </>
            ) : (
              <>
                <Swords className="w-3.5 h-3.5" />
                進入魔王戰！
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
