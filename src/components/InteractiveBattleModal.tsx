"use client";

import React, { useState, useEffect } from "react";
import { Boss } from "@/data/curriculumData";
import { Swords, Trophy, Sparkles, X, CheckCircle2, AlertCircle, Heart, Zap } from "lucide-react";

interface InteractiveBattleModalProps {
  boss: Boss | null;
  onClose: () => void;
  onVictory: (bossId: string) => void;
  isDefeated: boolean;
}

export default function InteractiveBattleModal({
  boss,
  onClose,
  onVictory,
  isDefeated,
}: InteractiveBattleModalProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [currentHp, setCurrentHp] = useState(boss ? boss.hp : 0);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  // 當切換或重新開啟不同魔王時，確保戰鬥狀態完全重置
  useEffect(() => {
    if (boss) {
      setSelectedOption(null);
      setHasAnswered(false);
      setCurrentHp(boss.hp);
      setIsAttacking(false);
      setIsVictory(false);
    }
  }, [boss?.id, boss?.hp]);

  if (!boss) return null;

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
  };

  const handleAttack = () => {
    if (selectedOption === null || hasAnswered) return;
    setHasAnswered(true);

    if (selectedOption === boss.quiz.correctIndex) {
      // 答對，發動爆擊
      setIsAttacking(true);
      setTimeout(() => {
        setCurrentHp(0);
        setIsVictory(true);
        setIsAttacking(false);
        onVictory(boss.id);
      }, 700);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setHasAnswered(false);
    setCurrentHp(boss.hp);
    setIsVictory(false);
  };

  const hpPercent = Math.max(0, Math.round((currentHp / boss.hp) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* 頂部裝飾光暈與關閉按鈕 */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 戰鬥抬頭與魔王資訊 */}
        <div className="p-6 pb-4 border-b border-slate-800 bg-gradient-to-b from-slate-800/60 to-slate-900/60">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md">
              {boss.category}
            </span>
            <span className="px-2.5 py-1 text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
              {boss.subject}
            </span>
            {isDefeated && (
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                已通關 (切磋練習)
              </span>
            )}
            <span className="text-xs text-amber-400/80 font-mono">
              難度：{"★".repeat(boss.difficulty)}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <span className="text-3xl">{boss.icon}</span>
                {boss.name}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{boss.title}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold mb-1 justify-end">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                魔王血量：{currentHp} / {boss.hp}
              </div>
              {/* 血條 */}
              <div className="w-36 sm:w-48 h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    hpPercent > 50
                      ? "bg-gradient-to-r from-emerald-500 to-green-400"
                      : hpPercent > 20
                      ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                      : "bg-gradient-to-r from-rose-600 to-red-500"
                  }`}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 戰鬥互動區 */}
        <div className="p-6 space-y-6">
          {!isVictory ? (
            <>
              {/* 課綱核心弱點提點 */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">魔王弱點提示：</span>
                  {boss.bossWeakness[0]}
                </div>
              </div>

              {/* 題目卡片 */}
              <div className={`transition-transform duration-200 ${isAttacking ? "scale-95 opacity-50" : ""}`}>
                <div className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  勇者答題破防挑戰：
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-medium text-base mb-4 leading-relaxed">
                  {boss.quiz.question}
                </div>

                {/* 選項列表 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {boss.quiz.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === boss.quiz.correctIndex;

                    let btnStyle = "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-750 hover:border-slate-600";
                    if (isSelected && !hasAnswered) {
                      btnStyle = "bg-amber-500/20 border-amber-500 text-amber-200 font-bold ring-2 ring-amber-500/50";
                    } else if (hasAnswered) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold";
                      } else if (isSelected && !isCorrect) {
                        btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 line-through";
                      } else {
                        btnStyle = "bg-slate-800/30 border-slate-800 text-slate-500";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={hasAnswered}
                        className={`p-3.5 rounded-xl border text-left text-sm transition-all flex items-center gap-3 ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-700/80 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-600">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 回饋結果 */}
              {hasAnswered && (
                <div
                  className={`p-4 rounded-xl border animate-in zoom-in-95 duration-200 ${
                    selectedOption === boss.quiz.correctIndex
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {selectedOption === boss.quiz.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>正中弱點！發動致命暴擊 9999 傷害！</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-rose-400" />
                        <span>攻擊被魔王防護罩彈開了！別氣餒！</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {boss.quiz.explanation}
                  </p>
                </div>
              )}

              {/* 操作按鈕 */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {!hasAnswered ? (
                  <button
                    onClick={handleAttack}
                    disabled={selectedOption === null}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
                  >
                    <Swords className="w-4 h-4" />
                    發動攻擊！
                  </button>
                ) : selectedOption !== boss.quiz.correctIndex ? (
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-2 transition-all"
                  >
                    重新挑戰
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            /* 通關勝利畫面與掉落寶物 */
            <div className="py-8 text-center space-y-6 animate-in zoom-in-90 duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-xl shadow-amber-500/30">
                <Trophy className="w-10 h-10 text-slate-950" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  QUEST CLEAR! 魔王討伐成功
                </div>
                <h4 className="text-3xl font-black text-white">恭喜勇者！順利攻克關卡！</h4>
                <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
                  你已經掌握了台灣108課綱【{boss.curriculumCode}】核心概念，成功擊潰了【{boss.name}】！
                </p>
              </div>

              {/* 掉落寶物卡 */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-b from-amber-500/10 to-amber-900/10 border-2 border-amber-500/40 text-left shadow-lg">
                <div className="text-xs font-bold text-amber-400 tracking-wider uppercase mb-1 flex items-center justify-between">
                  <span>✨ 掉落傳奇戰利品</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                    {boss.lootReward.type}
                  </span>
                </div>
                <div className="text-lg font-black text-white">{boss.lootReward.name}</div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {boss.lootReward.desc}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  再次挑戰複習
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20"
                >
                  收入裝備庫並返回冒險地圖
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
