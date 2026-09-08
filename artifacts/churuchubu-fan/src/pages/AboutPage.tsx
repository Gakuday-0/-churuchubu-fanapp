import { Mail } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import SeoHead from '@/components/common/SeoHead';
import PageContainer from '@/components/common/PageContainer';
import SectionTitle from '@/components/common/SectionTitle';
import Card from '@/components/common/Card';
import { ABOUT_TITLE, ABOUT_DESCRIPTION, ABOUT_CONTACT } from '@/data/about';
import { SEO_CONFIG } from '@/data/config';

export default function AboutPage() {
  const { x, email } = ABOUT_CONTACT;

  return (
    <PageContainer spacing="md">
      <SeoHead
        title={SEO_CONFIG.pages.about.title}
        description={SEO_CONFIG.pages.about.description}
        canonical="/about"
      />

      {/* ページタイトル */}
      <h1 className="text-base font-bold text-gray-800">{ABOUT_TITLE}</h1>

      {/* サイト概要カード */}
      <Card className="px-4 py-4">
        <SectionTitle as="h2" className="mb-3">
          当サイトについて
        </SectionTitle>
        <p className="whitespace-pre-line text-sm text-gray-600 leading-relaxed">
          {ABOUT_DESCRIPTION}
        </p>
      </Card>

      {/* Contact カード */}
      <Card className="overflow-hidden">
        {/* カードヘッダー */}
        <div className="border-b border-border px-4 py-3">
          <SectionTitle as="h2" className="mb-0">
            {ABOUT_CONTACT.sectionTitle}
          </SectionTitle>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* 管理者名 */}
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">{ABOUT_CONTACT.label}</p>
            <p className="text-sm font-bold text-gray-800">{ABOUT_CONTACT.name}</p>
          </div>

          {/* X リンク */}
          <div>
            <p className="text-[11px] text-gray-400 mb-1">{x.label}</p>
            <a
              href={x.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white text-sm font-medium transition-opacity active:opacity-70"
            >
              <FaXTwitter size={15} />
              {x.handle}
            </a>
          </div>

          {/* メール */}
          <div>
            <p className="text-[11px] text-gray-400 mb-1">{email.label}</p>
            <a
              href={`mailto:${email.address}`}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted active:opacity-70"
            >
              <Mail size={15} />
              {email.address}
            </a>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
