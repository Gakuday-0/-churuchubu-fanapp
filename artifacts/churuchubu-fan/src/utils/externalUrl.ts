/**
 * 外部リンク用URLの正規化。
 *
 * スプレッドシートのセルにラベルや前後の空白があっても、
 * 実際の http(s) URL だけをリンクとして取り出します。
 */
export function normalizeExternalUrl(
  value: string | null | undefined,
): string | undefined {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return undefined;

  const url = trimmed.match(/https?:\/\/[^\s"'<>]+/i)?.[0];
  if (!url) return undefined;

  return url.replace(/[),.;!?、。]+$/u, '');
}