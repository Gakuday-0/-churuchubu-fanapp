import { FaXTwitter, FaYoutube, FaTiktok } from 'react-icons/fa6';
import { SiYoutubemusic, SiApplemusic } from 'react-icons/si';
import { Button } from '@workspace/churuchubu-design-system/components/ui/button';
import { Link } from 'react-router-dom';
import SectionTitle from '@/components/common/SectionTitle';
import MerchandiseMenu from '@/components/common/MerchandiseMenu';
import { SNS_LINKS } from '@/data/sns';

const snsLink = (id: string) => {
  const link = SNS_LINKS.find((item) => item.id === id);
  if (!link) {
    throw new Error(`SNS link is not configured: ${id}`);
  }
  return link;
};

const OFFICIAL_LINKS = [
  { data: snsLink('twitter'), label: '公式 X', icon: <FaXTwitter size={25} /> },
  { data: snsLink('tiktok'), label: '公式 TikTok', icon: <FaTiktok size={25} /> },
  { data: snsLink('youtube'), label: '公式 YouTube', icon: <FaYoutube size={25} /> },
] as const;

const SUBSCRIPTION_LINKS = [
  { data: snsLink('ytmusic'), label: 'YouTube Music', icon: <SiYoutubemusic size={20} /> },
  { data: snsLink('applemusic'), label: 'Apple Music', icon: <SiApplemusic size={20} /> },
] as const;

const cardClassName =
  'relative flex min-h-[136px] flex-col overflow-hidden rounded-md border border-border bg-white transition-colors duration-200 hover:bg-muted/30 active:opacity-90';

const lineStyle = {
  backgroundColor: '#F9A8D4',
};

export default function SnsButtons() {
  return (
    <section className="px-4 pt-6">
      <SectionTitle as="h2">公式SNS</SectionTitle>

      <div className="grid grid-cols-2 gap-3">
        {OFFICIAL_LINKS.map(({ data, label, icon }) => (
          <a
            key={data.id}
            href={data.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cardClassName}
          >
            <span className="h-1.5 w-full shrink-0" style={lineStyle} />
            <span className="flex flex-1 flex-col items-center justify-center gap-3 px-3 py-5">
              <span className="text-gray-700">{icon}</span>
              <span className="text-sm font-semibold tracking-wide text-gray-800">
                {label}
              </span>
            </span>
          </a>
        ))}

        <div className={cardClassName}>
          <span className="h-1.5 w-full shrink-0" style={lineStyle} />
          <div className="flex flex-1 flex-col items-center justify-center px-3 py-4">
            <p className="mb-3 text-sm font-semibold tracking-wide text-gray-800">
              サブスク配信中
            </p>
            <div className="flex w-full items-center justify-center gap-2">
              {SUBSCRIPTION_LINKS.map(({ data, label, icon }, index) => (
                <a
                  key={data.id}
                  href={data.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label}で配信中`}
                   className="flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-md px-1.5 py-1.5 text-gray-600 transition-colors hover:bg-secondary active:opacity-70"
                >
                  <span>{icon}</span>
                  <span className="text-center text-[10px] font-medium leading-tight">
                    {label}
                  </span>
                  {index === 0 && (
                    <span className="sr-only">Apple Musicと</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MerchandiseMenu compact />

      <Button
        asChild
        variant="outline"
         className="mt-3 w-full rounded-md text-sm font-semibold"
      >
        <Link to="/benefits">その他の特典についてはこちら</Link>
      </Button>
    </section>
  );
}
