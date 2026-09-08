/**
 * MembersScroll — ホームのメンバーセクション
 *
 * MemberCard をそのまま再利用し、メンバーページと同一デザインを維持します。
 * デザイン変更は MemberCard 側のみで完結します。
 */

import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import MemberCard from '@/components/members/MemberCard';
import { MEMBERS } from '@/data/members';

export default function MembersScroll() {
  return (
    <section className="pt-6">
      {/* タイトル行 */}
      <div className="flex items-center justify-between px-4 mb-3">
        <SectionTitle as="h2" className="mb-0">メンバー</SectionTitle>
        <Link
          to="/members"
          className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground"
        >
          全員見る <ChevronRight size={13} />
        </Link>
      </div>

      {/* 2列グリッド（メンバーページと同一） */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {MEMBERS.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
