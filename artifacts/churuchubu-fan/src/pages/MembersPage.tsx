import SeoHead from '@/components/common/SeoHead';
import PageContainer from '@/components/common/PageContainer';
import SectionTitle from '@/components/common/SectionTitle';
import MemberCard from '@/components/members/MemberCard';
import { MEMBERS, STRENGTHENED_MEMBERS } from '@/data/members';
import { SEO_CONFIG } from '@/data/config';

export default function MembersPage() {
  return (
    <PageContainer>
      <SeoHead
        title={SEO_CONFIG.pages.members.title}
        description={SEO_CONFIG.pages.members.description}
        canonical="/members"
      />

      <SectionTitle as="h1">メンバー</SectionTitle>

      <div className="grid grid-cols-2 gap-3 mt-0">
        {MEMBERS.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3">
        {STRENGTHENED_MEMBERS.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </PageContainer>
  );
}
