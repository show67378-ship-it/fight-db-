// robots.txt を取得し、指定 URL がクロール許可されているか判定する簡易パーサー。
// User-agent: * のグループの Allow / Disallow のみを見る(最長一致優先の一般的な解釈)。

interface RobotsRule {
  path: string;
  allow: boolean;
}

const robotsCache = new Map<string, RobotsRule[]>();

function parseRobotsTxt(text: string): RobotsRule[] {
  const rules: RobotsRule[] = [];
  let inWildcardGroup = false;
  let sawAnyUserAgent = false;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.split("#")[0].trim();
    if (!line) continue;
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();

    if (key === "user-agent") {
      sawAnyUserAgent = true;
      inWildcardGroup = value === "*";
      continue;
    }
    if (!sawAnyUserAgent) continue;
    if (!inWildcardGroup) continue;

    if (key === "allow" && value) {
      rules.push({ path: value, allow: true });
    } else if (key === "disallow" && value) {
      rules.push({ path: value, allow: false });
    }
  }
  return rules;
}

async function getRobotsRules(origin: string): Promise<RobotsRule[]> {
  const cached = robotsCache.get(origin);
  if (cached) return cached;

  let rules: RobotsRule[] = [];
  try {
    const res = await fetch(`${origin}/robots.txt`, {
      headers: { "User-Agent": CRAWLER_USER_AGENT },
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) {
      rules = parseRobotsTxt(await res.text());
    }
  } catch {
    // robots.txt が取得できない場合は安全側に倒し、禁止ルールなし(=許可)として扱う。
  }
  robotsCache.set(origin, rules);
  return rules;
}

export const CRAWLER_USER_AGENT =
  "Mozilla/5.0 (compatible; KakutoDBCrawler/0.1; +https://kakuto.example/crawler)";

export async function isAllowedByRobots(url: string): Promise<boolean> {
  const parsed = new URL(url);
  const rules = await getRobotsRules(parsed.origin);
  if (rules.length === 0) return true;

  // 最長一致するルールを採用する(標準的な robots.txt 解釈)。
  let best: RobotsRule | null = null;
  for (const rule of rules) {
    if (parsed.pathname.startsWith(rule.path)) {
      if (!best || rule.path.length > best.path.length) best = rule;
    }
  }
  return best ? best.allow : true;
}
