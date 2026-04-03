interface FeedbackData {
  overall_rating: number;
  gameplay_rating: number | null;
  visuals_rating: number | null;
  fun_factor_rating: number | null;
  bugs_encountered: string | null;
  would_play_again: string;
  free_text: string | null;
  video_links: string[];
}

export function generateSummary(
  responses: FeedbackData[],
  locale: string
): string {
  const count = responses.length;
  if (count === 0) return locale === "ja" ? "分析するフィードバックがありません。" : "No feedback to analyze.";

  const avgOverall = (responses.reduce((a, r) => a + r.overall_rating, 0) / count).toFixed(1);
  const avgGameplay = avg(responses.map((r) => r.gameplay_rating));
  const avgVisuals = avg(responses.map((r) => r.visuals_rating));
  const avgFun = avg(responses.map((r) => r.fun_factor_rating));

  const playAgainYes = responses.filter((r) => r.would_play_again === "yes").length;
  const playAgainMaybe = responses.filter((r) => r.would_play_again === "maybe").length;
  const playAgainNo = responses.filter((r) => r.would_play_again === "no").length;

  const bugReports = responses.filter((r) => r.bugs_encountered?.trim()).map((r) => r.bugs_encountered!.trim());
  const freeTexts = responses.filter((r) => r.free_text?.trim()).map((r) => r.free_text!.trim());
  const allText = [...bugReports, ...freeTexts].join(" ");

  const sentiment = parseFloat(avgOverall) >= 4 ? "positive" : parseFloat(avgOverall) >= 3 ? "mixed" : "negative";
  const themes = extractThemes(allText);
  const hasVideos = responses.some((r) => r.video_links.length > 0);

  if (locale === "ja") {
    return buildJapanese({
      count, avgOverall, avgGameplay, avgVisuals, avgFun,
      playAgainYes, playAgainMaybe, playAgainNo,
      bugReports, sentiment, themes, hasVideos,
    });
  }

  return buildEnglish({
    count, avgOverall, avgGameplay, avgVisuals, avgFun,
    playAgainYes, playAgainMaybe, playAgainNo,
    bugReports, sentiment, themes, hasVideos,
  });
}

function avg(values: (number | null)[]): string {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return "N/A";
  return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1);
}

function extractThemes(text: string): string[] {
  const words = text.toLowerCase().replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter((w) => w.length > 3);
  const stopWords = new Set(["this", "that", "with", "from", "have", "been", "were", "they", "their", "about", "would", "could", "should", "there", "when", "what", "some", "very", "more", "also", "just", "like", "than", "into", "only", "other", "your", "them", "most", "after", "much", "then", "make", "well", "made", "does", "didn", "game", "play", "feel", "really", "didn"]);
  const freq: Record<string, number> = {};
  words.forEach((w) => { if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

interface SummaryData {
  count: number;
  avgOverall: string;
  avgGameplay: string;
  avgVisuals: string;
  avgFun: string;
  playAgainYes: number;
  playAgainMaybe: number;
  playAgainNo: number;
  bugReports: string[];
  sentiment: string;
  themes: string[];
  hasVideos: boolean;
}

function buildEnglish(d: SummaryData): string {
  const lines: string[] = [];

  lines.push(`Analyzed ${d.count} feedback response${d.count !== 1 ? "s" : ""}.`);
  lines.push("");

  const sentimentLabel = d.sentiment === "positive" ? "Overall sentiment is positive" : d.sentiment === "mixed" ? "Overall sentiment is mixed" : "Overall sentiment needs attention";
  lines.push(`${sentimentLabel} with an average rating of ${d.avgOverall}/5.`);

  lines.push("");
  lines.push("Ratings breakdown:");
  lines.push(`  Gameplay: ${d.avgGameplay}/5`);
  lines.push(`  Visuals: ${d.avgVisuals}/5`);
  lines.push(`  Fun factor: ${d.avgFun}/5`);

  lines.push("");
  const total = d.playAgainYes + d.playAgainMaybe + d.playAgainNo;
  if (total > 0) {
    lines.push(`Would play again: ${pct(d.playAgainYes, total)}% yes, ${pct(d.playAgainMaybe, total)}% maybe, ${pct(d.playAgainNo, total)}% no.`);
  }

  if (d.bugReports.length > 0) {
    lines.push("");
    lines.push(`${d.bugReports.length} tester${d.bugReports.length !== 1 ? "s" : ""} reported bugs or issues.`);
    const sample = d.bugReports.slice(0, 3);
    sample.forEach((b) => lines.push(`  - "${truncate(b, 120)}"`));
    if (d.bugReports.length > 3) lines.push(`  ...and ${d.bugReports.length - 3} more.`);
  } else {
    lines.push("");
    lines.push("No bug reports filed.");
  }

  if (d.themes.length > 0) {
    lines.push("");
    lines.push(`Frequently mentioned: ${d.themes.join(", ")}.`);
  }

  if (d.hasVideos) {
    lines.push("");
    lines.push("Video evidence was provided by some testers — check individual responses for links.");
  }

  return lines.join("\n");
}

function buildJapanese(d: SummaryData): string {
  const lines: string[] = [];

  lines.push(`${d.count}件のフィードバックを分析しました。`);
  lines.push("");

  const sentimentLabel = d.sentiment === "positive" ? "全体的な感想はポジティブ" : d.sentiment === "mixed" ? "全体的な感想はミックス" : "全体的な感想は改善が必要";
  lines.push(`${sentimentLabel}、平均評価 ${d.avgOverall}/5。`);

  lines.push("");
  lines.push("評価の内訳：");
  lines.push(`  ゲームプレイ: ${d.avgGameplay}/5`);
  lines.push(`  ビジュアル: ${d.avgVisuals}/5`);
  lines.push(`  楽しさ: ${d.avgFun}/5`);

  lines.push("");
  const total = d.playAgainYes + d.playAgainMaybe + d.playAgainNo;
  if (total > 0) {
    lines.push(`再プレイ意向: ${pct(d.playAgainYes, total)}% はい、${pct(d.playAgainMaybe, total)}% たぶん、${pct(d.playAgainNo, total)}% いいえ。`);
  }

  if (d.bugReports.length > 0) {
    lines.push("");
    lines.push(`${d.bugReports.length}人のテスターがバグや問題を報告。`);
    const sample = d.bugReports.slice(0, 3);
    sample.forEach((b) => lines.push(`  - 「${truncate(b, 100)}」`));
    if (d.bugReports.length > 3) lines.push(`  ...他${d.bugReports.length - 3}件。`);
  } else {
    lines.push("");
    lines.push("バグ報告なし。");
  }

  if (d.themes.length > 0) {
    lines.push("");
    lines.push(`よく言及されたワード: ${d.themes.join("、")}。`);
  }

  if (d.hasVideos) {
    lines.push("");
    lines.push("一部のテスターが動画エビデンスを提供 — 個別レスポンスのリンクを確認してください。");
  }

  return lines.join("\n");
}

function pct(n: number, total: number): number {
  return Math.round((n / total) * 100);
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + "..." : s;
}
