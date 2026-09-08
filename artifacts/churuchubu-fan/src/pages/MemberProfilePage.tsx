import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';
import SeoHead from '@/components/common/SeoHead';
import PageContainer from '@/components/common/PageContainer';
import Card from '@/components/common/Card';
import { getMemberById } from '@/data/members';
import { SEO_CONFIG } from '@/data/config';

export default function MemberProfilePage() {
  const { memberId } = useParams<{ memberId: string }>();
  const member = getMemberById(memberId ?? '');

  if (!member) {
    return <Navigate to="/members" replace />;
  }

  const memberTitle = SEO_CONFIG.pages.memberProfile.title.replace('{name}', member.name);
  const memberDesc  = SEO_CONFIG.pages.memberProfile.description.replace('{name}', member.name);
  const hasOfficialColor = Boolean(member.colorHex && member.colorName);

  return (
    <PageContainer>
      <SeoHead
        title={memberTitle}
        description={memberDesc}
        canonical={`/members/${member.id}`}
      />

      {/* 戻るリンク */}
      <Link
        to="/members"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={16} />
        メンバー一覧に戻る
      </Link>

      {/* 写真を使わず、文字とカラーアクセントで構成するプロフィールカード */}
      <Card className="overflow-hidden">
        <div
          className="h-1"
          style={{ backgroundColor: member.colorHex ?? 'hsl(var(--border))' }}
        />

        <div className="px-5 py-6">
          <div className="border-b border-border pb-5">
            <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
              PROFILE
            </p>
            <h1 className="mt-3 text-2xl font-bold leading-tight tracking-wide text-foreground">
              {member.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {hasOfficialColor && (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span
                    className="h-3 w-3 rounded-full ring-1 ring-inset ring-black/10"
                    style={{ backgroundColor: member.colorHex }}
                    aria-hidden="true"
                  />
                  {member.colorName}
                </span>
              )}
              <span className="h-4 w-px bg-border" aria-hidden="true" />
              <span className="text-xs font-medium text-muted-foreground">
                {member.isStrengthened
                  ? '期間限定 強化メンバー'
                  : member.isSupport
                    ? 'サポートメンバー'
                    : '正規メンバー'}
              </span>
            </div>
          </div>

          {(member.affiliation || member.role) && (
            <dl className="space-y-3 border-b border-border py-5 text-sm">
              {member.affiliation && (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">所属</dt>
                  <dd className="font-semibold text-foreground">{member.affiliation}</dd>
                </div>
              )}
              {member.role && (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">立場</dt>
                  <dd className="text-right font-semibold text-foreground">{member.role}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="space-y-3 pt-5">
            <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
              SOCIAL
            </p>
            {member.xUrl && (
              <a
                href={member.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 transition-colors hover:bg-muted"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black">
                  <FaXTwitter size={15} className="text-white" />
                </span>
                <span className="text-sm font-semibold text-foreground">X (Twitter)</span>
                <ChevronLeft size={14} className="ml-auto rotate-180 text-muted-foreground" />
              </a>
            )}

            {member.tiktokUrl && (
              <a
                href={member.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 transition-colors hover:bg-muted"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900">
                  <FaTiktok size={15} className="text-white" />
                </span>
                <span className="text-sm font-semibold text-foreground">TikTok</span>
                <ChevronLeft size={14} className="ml-auto rotate-180 text-muted-foreground" />
              </a>
            )}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
