// コメント投稿時の簡易自動判定。将来的にAI(LLM)判定へ差し替え/併用できるよう、
// 判定ロジックをこの1関数に閉じ込めている。
export interface CommentCheckResult {
  ok: boolean;
  reason?: string;
}

const MAX_LENGTH = 500;

// 誹謗中傷・差別・脅迫等でよく使われる語のごく基本的な一覧。
// 完全ではないため、すり抜けを見つけたら追加していく想定。
const NG_WORDS = [
  "死ね",
  "殺す",
  "殺害",
  "ぶっ殺",
  "消えろ",
  "きえろ",
  "うざい",
  "きもい",
  "キモい",
  "気持ち悪い",
  "ゴミ",
  "クズ",
  "カス",
  "馬鹿",
  "バカ",
  "アホ",
  "ブス",
  "デブ",
  "低能",
  "無能",
  "在日",
  "チョン",
  "しね",
  "shine",
  "死ねよ",
  "fuck",
  "shit",
  "bitch",
];

const URL_PATTERN = /https?:\/\/|www\./i;
const REPEATED_CHAR_PATTERN = /(.)\1{9,}/; // 同じ文字が10回以上連続

export function checkComment(body: string): CommentCheckResult {
  const trimmed = body.trim();

  if (!trimmed) return { ok: false, reason: "empty" };
  if (trimmed.length > MAX_LENGTH) return { ok: false, reason: "too_long" };

  const lower = trimmed.toLowerCase();
  for (const word of NG_WORDS) {
    if (lower.includes(word.toLowerCase())) {
      return { ok: false, reason: "ng_word" };
    }
  }

  if (URL_PATTERN.test(trimmed)) return { ok: false, reason: "url_spam" };
  if (REPEATED_CHAR_PATTERN.test(trimmed)) return { ok: false, reason: "spam_pattern" };

  return { ok: true };
}
