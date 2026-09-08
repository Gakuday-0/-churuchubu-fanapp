import { Fragment, type ReactNode } from 'react';
import { cn } from '@workspace/churuchubu-design-system/lib/utils';

/**
 * 特典ページ用の本文表示。
 *
 * 日本語の通常の折り返しは維持しつつ、日付・金額・券名など、
 * 途中で分割すると意味が変わるまとまりだけを改行不可にします。
 * 文字列内の改行は、入力された段落区切りとして保持します。
 */
const ATOMIC_PHRASES = [
  '2026年9月1日より適用',
  '2026年9月1日',
  '特典内容が変更になります',
  '2026年8月26日',
  '2026年8月末',
  '2026年7月31日',
  '高校生以下 ¥900',
  '学生証の提示が必須です',
  '学生証提示必須',
  'チェキ券との併用で使用可能となります',
  'チェキ券との併用で使用可能なものへ変更します',
  'チェキ券との併用により使用可能です',
  'チェキ券・交流30秒延長券・30秒撮影券',
  '握手券及び交流30秒延長券',
  '30秒交流延長券',
  '30秒撮影券',
  '¥1,000',
  '¥900',
  '¥700',
  '¥500',
  '¥300',
  '1,000円',
  '900円',
  '700円',
  '500円',
  '300円',
].sort((a, b) => b.length - a.length);

const ATOMIC_PHRASE_PATTERN = new RegExp(
  `(${ATOMIC_PHRASES.map(escapeRegExp).join('|')})`,
  'g',
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderLine(line: string): ReactNode[] {
  return line.split(ATOMIC_PHRASE_PATTERN).map((part, index) =>
    ATOMIC_PHRASES.includes(part) ? (
      <span key={`${part}-${index}`} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={`${part}-${index}`}>{part}</Fragment>
    ),
  );
}

export default function BenefitText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={cn('benefit-copy', className)}>
      {children.split(/\r?\n/).map((line, index) => (
        <Fragment key={`${line}-${index}`}>
          {index > 0 && <br />}
          {renderLine(line)}
        </Fragment>
      ))}
    </span>
  );
}