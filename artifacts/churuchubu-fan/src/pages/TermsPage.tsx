import { Mail } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import SeoHead from '@/components/common/SeoHead';
import Card from '@/components/common/Card';
import PageContainer from '@/components/common/PageContainer';
import { SEO_CONFIG } from '@/data/config';
import { TERMS_PAGE } from '@/data/terms';

export default function TermsPage() {
  return (
    <PageContainer spacing="md">
      <SeoHead
        title={SEO_CONFIG.pages.terms.title}
        description={SEO_CONFIG.pages.terms.description}
        canonical="/terms"
      />

      <div>
        <h1 className="text-base font-bold text-gray-800">{TERMS_PAGE.title}</h1>
        <p className="mt-1 text-[11px] text-gray-400">{TERMS_PAGE.updatedAt}</p>
      </div>

      <div className="space-y-4">
        {TERMS_PAGE.sections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-bold leading-relaxed text-gray-800">
                {section.title}
              </h2>
            </div>

            <div className="space-y-3 px-4 py-4 text-sm leading-relaxed text-gray-600">
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.id === 'contact' && (
                <div className="space-y-4 border-t border-border pt-4">
                  <h3 className="text-xs font-bold text-gray-700">
                    {TERMS_PAGE.contactTitle}
                  </h3>

                  {TERMS_PAGE.contactLinks.map((contact) => {
                    const isX = contact.label.startsWith('X');
                    const Icon = isX ? FaXTwitter : Mail;

                    return (
                      <div key={contact.label}>
                        <p className="mb-1 text-[11px] text-gray-400">{contact.label}</p>
                        <a
                          href={contact.url}
                          target={isX ? '_blank' : undefined}
                          rel={isX ? 'noopener noreferrer' : undefined}
                          className={
                            isX
                              ? 'inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition-opacity active:opacity-70'
                              : 'inline-flex items-center gap-2 break-all rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted active:opacity-70'
                          }
                        >
                          <Icon size={15} />
                          {contact.value}
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}