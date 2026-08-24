// 検索用の軽量ユーティリティ。クライアント/サーバーどちらからもimport可能(DB接続を含まない)。

// 「朝倉未来」「朝倉 未来」のような姓名間の空白(半角/全角)の有無を区別しないための正規化。
export function stripSpaces(value: string): string {
  return value.replace(/[\s　]+/g, "");
}

// 検索クエリが対象文字列のいずれかに部分一致するか(空白は無視)。
export function matchesQuery(query: string, ...values: (string | undefined | null)[]): boolean {
  const q = stripSpaces(query.trim());
  if (q === "") return true;
  return values.some((v) => !!v && stripSpaces(v).includes(q));
}
