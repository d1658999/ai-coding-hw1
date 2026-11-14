import { readFileSync } from "node:fs";
import { Buffer } from "node:buffer";
import ts from "typescript";

const DATA_PATH = new URL("../src/data/curriculumData.ts", import.meta.url);

const SUBJECTS = [
  "國語文",
  "數學領域",
  "生活課程",
  "自然科學",
  "社會領域",
  "英語文",
  "科技資訊",
];

const CATEGORIES = [
  "主線課程魔王",
  "段考期中大魔王",
  "課後作業試煉",
  "日常副本任務",
];

const LOOT_TYPES = ["武器", "防具", "飾品", "稱號", "魔法書"];

const DOMAIN_BY_SUBJECT = {
  國語文: "國",
  數學領域: "數",
  生活課程: "生活",
  自然科學: "自",
  社會領域: "社",
  英語文: "英",
  科技資訊: "議題融入",
};

const STAGE_BY_GRADE = {
  1: "第一學習階段",
  2: "第一學習階段",
  3: "第二學習階段",
  4: "第二學習階段",
  5: "第三學習階段",
  6: "第三學習階段",
};

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function parseCodes(subject, rawCode) {
  const match = /^【(.+)】$/.exec(rawCode);
  if (!match) {
    return { valid: false, reason: `代碼需以【】包覆，實際為「${rawCode}」` };
  }

  const expectedDomain = DOMAIN_BY_SUBJECT[subject];
  if (!expectedDomain) {
    return { valid: false, reason: `未知科目「${subject}」` };
  }

  if (expectedDomain === "議題融入") {
    return { valid: match[1] === "議題融入：資訊教育", reason: "" };
  }

  const codes = match[1].split(",").map((code) => code.trim());
  if (codes.length === 0 || codes.some((code) => code.length === 0)) {
    return { valid: false, reason: "代碼清單為空或含空項目" };
  }
  if (new Set(codes).size !== codes.length) {
    return { valid: false, reason: `代碼清單有重複項目「${match[1]}」` };
  }

  for (const code of codes) {
    const parts = code.split("-");
    if (parts.length !== 3) {
      return { valid: false, reason: `代碼格式應為 領域-階段-面向，實際為「${code}」` };
    }
    const [domain, stage, facet] = parts;
    if (domain !== expectedDomain) {
      return {
        valid: false,
        reason: `科目「${subject}」應使用領域代碼「${expectedDomain}」，實際為「${domain}」`,
      };
    }
    if (stage !== "E") {
      return { valid: false, reason: `國小階段代碼應為 E，實際為「${stage}」` };
    }
    if (!/^[ABC][123]$/.test(facet)) {
      return { valid: false, reason: `核心素養面向需為 A1-A3/B1-B3/C1-C3，實際為「${facet}」` };
    }
  }

  return { valid: true, reason: "" };
}

const source = readFileSync(DATA_PATH, "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: "curriculumData.ts",
}).outputText;

const dataUrl = `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`;
const { GRADES_DATA, SUBJECT_CATEGORIES } = await import(dataUrl);

assert(Array.isArray(GRADES_DATA), "GRADES_DATA 必須是陣列");
assert(Array.isArray(SUBJECT_CATEGORIES), "SUBJECT_CATEGORIES 必須是陣列");

if (Array.isArray(SUBJECT_CATEGORIES)) {
  assert(SUBJECT_CATEGORIES.length >= 2, "SUBJECT_CATEGORIES 至少需包含全部領域與一個科目");
  assert(SUBJECT_CATEGORIES[0]?.id === "all", "SUBJECT_CATEGORIES 第一項必須是 id 為 all 的全部領域");

  const categoryIds = new Set();
  for (const category of SUBJECT_CATEGORIES) {
    const label = `科目分類/${category.id || "(缺少 id)"}`;
    assert(isNonEmptyString(category.id), `${label}: id 不可為空`);
    assert(!categoryIds.has(category.id), `${label}: id 重複`);
    categoryIds.add(category.id);
    assert(isNonEmptyString(category.name), `${label}: name 不可為空`);
    assert(isNonEmptyString(category.icon), `${label}: icon 不可為空`);
    assert(isNonEmptyString(category.color), `${label}: color 不可為空`);
  }
}

if (Array.isArray(GRADES_DATA)) {
  assert(GRADES_DATA.length === 6, `GRADES_DATA 應有 6 個年級，實際為 ${GRADES_DATA.length}`);

  const gradeNumbers = GRADES_DATA.map((grade) => grade.grade);
  assert(
    JSON.stringify(gradeNumbers) === JSON.stringify([1, 2, 3, 4, 5, 6]),
    `年級需依序為 1-6，實際為 ${gradeNumbers.join(", ")}`
  );

  const seenBossIds = new Set();
  const seenBossNames = new Set();
  let totalBosses = 0;

  for (const grade of GRADES_DATA) {
    const label = `G${grade.grade}`;
    assert(Number.isInteger(grade.grade), `${label}: grade 必須是整數`);
    assert(
      typeof grade.stageName === "string" &&
        grade.stageName.includes(STAGE_BY_GRADE[grade.grade]),
      `${label}: stageName 與年級學習階段不符（${grade.stageName}）`
    );

    for (const field of [
      "levelName",
      "stageName",
      "themeName",
      "themeDescription",
      "overview",
      "bannerGradient",
      "accentColor",
    ]) {
      assert(isNonEmptyString(grade[field]), `${label}: ${field} 不可為空`);
    }

    assert(
      Array.isArray(grade.keySkills) && grade.keySkills.length > 0,
      `${label}: keySkills 至少需有一項`
    );
    if (Array.isArray(grade.keySkills)) {
      assert(grade.keySkills.every(isNonEmptyString), `${label}: keySkills 不可有空項目`);
    }

    const guide = grade.parentGuide;
    assert(guide && typeof guide === "object", `${label}: parentGuide 缺少`);
    if (guide) {
      for (const field of ["criticalBottleneck", "solutionStrategy", "parentMagicSpell"]) {
        assert(isNonEmptyString(guide[field]), `${label}: parentGuide.${field} 不可為空`);
      }
      assert(
        Array.isArray(guide.growthChecklist) && guide.growthChecklist.length > 0,
        `${label}: parentGuide.growthChecklist 至少需有一項`
      );
      if (Array.isArray(guide.growthChecklist)) {
        assert(
          guide.growthChecklist.every(isNonEmptyString),
          `${label}: parentGuide.growthChecklist 不可有空項目`
        );
      }
    }

    assert(Array.isArray(grade.bosses), `${label}: bosses 必須是陣列`);
    if (!Array.isArray(grade.bosses)) continue;

    assert(
      grade.bossCount === grade.bosses.length,
      `${label}: bossCount (${grade.bossCount}) 與實際魔王數 (${grade.bosses.length}) 不一致`
    );

    for (const boss of grade.bosses) {
      totalBosses += 1;
      const bossLabel = `${label}/${boss.id || "(缺少 id)"}`;

      assert(isNonEmptyString(boss.id), `${bossLabel}: id 不可為空`);
      assert(!seenBossIds.has(boss.id), `${bossLabel}: boss id 重複`);
      seenBossIds.add(boss.id);

      assert(isNonEmptyString(boss.name), `${bossLabel}: name 不可為空`);
      assert(!seenBossNames.has(boss.name), `${bossLabel}: boss name 重複（${boss.name}）`);
      seenBossNames.add(boss.name);

      for (const field of [
        "title",
        "subject",
        "icon",
        "color",
        "summary",
        "curriculumCode",
        "coreCompetency",
        "homeworkForm",
        "parentTips",
      ]) {
        assert(isNonEmptyString(boss[field]), `${bossLabel}: ${field} 不可為空`);
      }

      assert(SUBJECTS.includes(boss.subject), `${bossLabel}: 未知科目「${boss.subject}」`);
      assert(
        Number.isInteger(boss.difficulty) && boss.difficulty >= 1 && boss.difficulty <= 5,
        `${bossLabel}: difficulty 需為 1-5 的整數`
      );
      assert(CATEGORIES.includes(boss.category), `${bossLabel}: 未知分類「${boss.category}」`);
      assert(Number.isInteger(boss.hp) && boss.hp > 0, `${bossLabel}: hp 需為正整數`);
      assert(
        Array.isArray(boss.bossWeakness) && boss.bossWeakness.length > 0,
        `${bossLabel}: bossWeakness 至少需有一項`
      );
      if (Array.isArray(boss.bossWeakness)) {
        assert(boss.bossWeakness.every(isNonEmptyString), `${bossLabel}: bossWeakness 不可有空項目`);
      }

      const loot = boss.lootReward;
      assert(loot && typeof loot === "object", `${bossLabel}: lootReward 缺少`);
      if (loot) {
        assert(isNonEmptyString(loot.name), `${bossLabel}: lootReward.name 不可為空`);
        assert(isNonEmptyString(loot.desc), `${bossLabel}: lootReward.desc 不可為空`);
        assert(LOOT_TYPES.includes(loot.type), `${bossLabel}: 未知戰利品類型「${loot.type}」`);
      }

      if (isNonEmptyString(boss.curriculumCode) && isNonEmptyString(boss.subject)) {
        const result = parseCodes(boss.subject, boss.curriculumCode);
        assert(result.valid, `${bossLabel}: ${result.reason}`);
      }

      const quiz = boss.quiz;
      assert(quiz && typeof quiz === "object", `${bossLabel}: quiz 缺少`);
      if (quiz) {
        assert(isNonEmptyString(quiz.question), `${bossLabel}: quiz.question 不可為空`);
        assert(isNonEmptyString(quiz.explanation), `${bossLabel}: quiz.explanation 不可為空`);
        assert(Array.isArray(quiz.options), `${bossLabel}: quiz.options 必須是陣列`);
        if (Array.isArray(quiz.options)) {
          assert(quiz.options.length === 4, `${bossLabel}: quiz.options 需為 4 個選項`);
          assert(
            quiz.options.every(isNonEmptyString),
            `${bossLabel}: quiz.options 不可有空選項`
          );
          assert(
            new Set(quiz.options).size === quiz.options.length,
            `${bossLabel}: quiz.options 有重複選項`
          );
          assert(
            Number.isInteger(quiz.correctIndex) &&
              quiz.correctIndex >= 0 &&
              quiz.correctIndex < quiz.options.length,
            `${bossLabel}: quiz.correctIndex 超出選項範圍`
          );
        }
      }
    }
  }

  console.log(
    `檢查完成：${GRADES_DATA.length} 個年級、${totalBosses} 隻魔王、${SUBJECT_CATEGORIES.length} 個科目分類。`
  );
}

if (failures.length > 0) {
  console.error(`\n發現 ${failures.length} 項資料結構問題：`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  throw new Error("curriculumData.ts 驗證失敗");
}

console.log("curriculumData.ts 結構驗證通過。");
