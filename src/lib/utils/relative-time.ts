function formatJa(
  value: number,
  unit: "minute" | "hour" | "day" | "week" | "month" | "year",
): string {
  if (unit === "minute") return `${value}分前`;
  if (unit === "hour") return `${value}時間前`;
  if (unit === "day") return `${value}日前`;
  if (unit === "week") return `${value}週間前`;
  if (unit === "month") return `${value}か月前`;
  return `${value}年前`;
}

function formatEn(
  value: number,
  unit: "minute" | "hour" | "day" | "week" | "month" | "year",
): string {
  if (unit === "minute") return `${value}m ago`;
  if (unit === "hour") return `${value}h ago`;
  if (unit === "day") return `${value}d ago`;
  if (unit === "week") return `${value}w ago`;
  if (unit === "month") return `${value}mo ago`;
  return `${value}y ago`;
}

export function relativeTime(date: string, locale: string): string {
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return "";
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const diffSec = Math.floor(diffMs / 1000);
  const ja = locale === "ja";

  if (diffSec < 60) return ja ? "たった今" : "just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return ja ? formatJa(diffMin, "minute") : formatEn(diffMin, "minute");

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return ja ? formatJa(diffHour, "hour") : formatEn(diffHour, "hour");

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return ja ? formatJa(diffDay, "day") : formatEn(diffDay, "day");

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return ja ? formatJa(diffWeek, "week") : formatEn(diffWeek, "week");

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return ja ? formatJa(diffMonth, "month") : formatEn(diffMonth, "month");

  const diffYear = Math.floor(diffDay / 365);
  return ja ? formatJa(Math.max(1, diffYear), "year") : formatEn(Math.max(1, diffYear), "year");
}
