import {
  getCrawlRuns,
  getCrawlRunWithSources,
  getCrawlerSources,
  getPendingDuplicateCandidates,
} from "@/lib/crawler-data";
import { resolveDuplicateCandidate, startCrawl } from "@/lib/crawler-actions";

export const dynamic = "force-dynamic";

const sourceStatusLabel: Record<string, string> = {
  pending: "待機",
  running: "実行中",
  completed: "完了",
  failed: "エラー",
  skipped: "スキップ",
};

const sourceStatusClass: Record<string, string> = {
  pending: "border-border bg-surface-2 text-ink-dim",
  running: "border-accent/40 bg-accent-soft text-accent",
  completed: "border-good/40 bg-good-soft text-good",
  failed: "border-warn/40 bg-warn-soft text-warn",
  skipped: "border-border bg-surface-2 text-ink-dim",
};

function formatDuration(start: Date, end: Date | null): string {
  const endTime = end ?? new Date();
  const seconds = Math.max(0, Math.round((endTime.getTime() - start.getTime()) / 1000));
  if (seconds < 60) return `${seconds}秒`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}分${seconds % 60}秒`;
}

export default async function AdminCrawlPage() {
  const [runs, sources, duplicates] = await Promise.all([
    getCrawlRuns(10),
    getCrawlerSources(),
    getPendingDuplicateCandidates(30),
  ]);

  const latest = runs[0];
  const latestDetail = latest ? await getCrawlRunWithSources(latest.id) : null;
  const enabledSources = sources.filter((s) => s.enabled && s.parserName !== "unimplemented");
  const registeredOnly = sources.filter((s) => !s.enabled || s.parserName === "unimplemented");

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
      <h1 className="font-head mt-3 text-3xl font-bold text-ink">全国DBフルクロール</h1>
      <p className="mt-2 text-sm text-ink-dim">
        公式団体・ジム一覧・大会・選手情報を巡回して正規化・重複判定した上でDBへ統合します。
        処理はバックグラウンドで実行されるため、この画面を閉じても停止しません。
      </p>

      <form action={startCrawl} className="mt-8 rounded-lg border border-border bg-surface p-5">
        <h2 className="font-head text-sm font-semibold text-ink">クロール開始</h2>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-dim">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="dryRun" className="h-4 w-4" />
            dry-run(DBへ書き込まず取得・解析・重複判定のみ確認)
          </label>
        </div>
        <div className="mt-3">
          <label className="text-xs text-ink-dim">
            対象source id(カンマ区切り、空欄なら有効な全source)
          </label>
          <input
            type="text"
            name="sourceIds"
            placeholder="jbjjf-academy,jbc-gym"
            className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-ink"
          />
        </div>
        <button
          type="submit"
          className="font-head mt-4 rounded-sm bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent-ink hover:opacity-90"
        >
          全国DBフルクロール開始
        </button>
        <p className="mt-2 text-xs text-ink-dim">
          有効な実装済み source: {enabledSources.map((s) => s.name).join(" / ") || "なし"}
        </p>
      </form>

      {latest && latestDetail && (
        <div className="mt-8 rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-head text-sm font-semibold text-ink">最新の実行</h2>
            <span
              className={`font-head rounded-sm border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                latest.status === "completed"
                  ? "border-good/40 bg-good-soft text-good"
                  : "border-accent/40 bg-accent-soft text-accent"
              }`}
            >
              {latest.status === "completed" ? "完了" : "実行中"}
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-ink-dim sm:grid-cols-3">
            <p>種別: {latest.crawlType}{latest.dryRun ? "(dry-run)" : ""}</p>
            <p>開始: {latest.startedAt.toLocaleString("ja-JP")}</p>
            <p>経過: {formatDuration(latest.startedAt, latest.finishedAt)}</p>
            <p>取得ページ数: {latest.pagesFetched}</p>
            <p>発見ジム数: {latest.gymsFound}</p>
            <p>新規ジム: {latest.gymsCreated}</p>
            <p>更新ジム: {latest.gymsUpdated}</p>
            <p>選手数: {latest.fightersFound}</p>
            <p>重複候補: {latest.duplicateCandidates}</p>
            <p>完了source: {latest.completedSources}/{latest.totalSources}</p>
            <p>失敗source: {latest.failedSources}</p>
            <p>エラー数: {latest.errorsCount}</p>
          </dl>

          <div className="mt-4 space-y-2">
            {latestDetail.sourceRuns.map((sr) => (
              <div
                key={sr.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-border bg-bg px-3 py-2 text-sm"
              >
                <span className="text-ink">{sr.source.name}</span>
                <div className="flex flex-wrap items-center gap-3 text-xs text-ink-dim">
                  <span>found={sr.recordsFound} created={sr.createdCount} updated={sr.updatedCount}</span>
                  <span
                    className={`font-head rounded-sm border px-2 py-0.5 font-semibold uppercase tracking-wide ${sourceStatusClass[sr.status] ?? ""}`}
                  >
                    {sourceStatusLabel[sr.status] ?? sr.status}
                  </span>
                </div>
              </div>
            ))}
            {latestDetail.sourceRuns.some((sr) => sr.status === "failed") && (
              <div className="mt-2 space-y-1">
                {latestDetail.sourceRuns
                  .filter((sr) => sr.status === "failed")
                  .map((sr) => (
                    <p key={sr.id} className="text-xs text-warn">
                      {sr.source.name}: {sr.errorMessage}
                    </p>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {duplicates.length > 0 && (
        <div className="mt-8 rounded-lg border border-border bg-surface p-5">
          <h2 className="font-head text-sm font-semibold text-ink">
            重複候補(自動統合されていません・{duplicates.length}件)
          </h2>
          <div className="mt-3 space-y-2">
            {duplicates.map((d) => (
              <div key={d.id} className="rounded-sm border border-border bg-bg p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-ink-dim">
                    強度: <span className="text-ink">{d.matchStrength}</span> ・{" "}
                    {d.matchReasons.join(", ")}
                  </p>
                  <div className="flex gap-2">
                    <form action={resolveDuplicateCandidate.bind(null, d.id, "rejected")}>
                      <button className="font-head rounded-sm border border-border px-2 py-1 text-[11px] uppercase text-ink-dim hover:text-ink">
                        誤検知
                      </button>
                    </form>
                    <form action={resolveDuplicateCandidate.bind(null, d.id, "confirmed_duplicate")}>
                      <button className="font-head rounded-sm border border-accent/40 bg-accent-soft px-2 py-1 text-[11px] uppercase text-accent">
                        重複と確認
                      </button>
                    </form>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-ink-dim sm:grid-cols-2">
                  <p>{d.entityA?.name ?? d.entityAId} ({d.entityA?.prefecture}{d.entityA?.city})</p>
                  <p>{d.entityB?.name ?? d.entityBId} ({d.entityB?.prefecture}{d.entityB?.city})</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-lg border border-border bg-surface p-5">
        <h2 className="font-head text-sm font-semibold text-ink">実行履歴</h2>
        <div className="mt-3 space-y-1 text-sm text-ink-dim">
          {runs.map((r) => (
            <p key={r.id}>
              {r.startedAt.toLocaleString("ja-JP")} ・ {r.crawlType}
              {r.dryRun ? "(dry-run)" : ""} ・ {r.status} ・ 新規{r.gymsCreated}/更新{r.gymsUpdated} ・
              失敗{r.failedSources}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-surface p-5">
        <h2 className="font-head text-sm font-semibold text-ink">
          未実装のsource(登録のみ・{registeredOnly.length}件)
        </h2>
        <p className="mt-2 text-xs text-ink-dim">
          {registeredOnly.map((s) => s.name).join(" / ")}
        </p>
      </div>
    </div>
  );
}
