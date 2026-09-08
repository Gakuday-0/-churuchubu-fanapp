/**
 * チケットURLの正規化・有無判定を全画面で共有します。
 *
 * Googleスプレッドシートのセルに前後の空白・改行や
 * 「チケットURL https://...」のようなラベルが残っていても、
 * 実際のURLを取り出して購入リンクとして扱います。
 */
export function normalizeTicketUrl(
  value: string | null | undefined,
): string | undefined {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return undefined;

  const url = trimmed.match(/https?:\/\/[^\s"'<>]+/i)?.[0];
  if (!url) return undefined;

  return url.replace(/[),.;!?、。]+$/u, '');
}

export function hasTicketUrl(value: string | null | undefined): boolean {
  return Boolean(normalizeTicketUrl(value));
}