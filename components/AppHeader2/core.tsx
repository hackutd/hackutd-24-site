import { useAuthContext } from '@/lib/user/AuthContext';
import Link from 'next/link';

export default function AppHeader2_Core() {
  const { hasProfile } = useAuthContext();

  return (
    <div className="flex justify-center py-2 w-full">
      {/* Real navbar */}
      <div className="font-dmSans flex items-center gap-4 border-[3px] border-[rgba(30,30,30,0.60)] rounded-xl px-20 bg-white">
        <Link href="/" className="p-2 text-[#5D5A88] cursor-pointer">
          Home
        </Link>
        <Link href="/#schedule-section" className="p-2 text-[#5D5A88] cursor-pointer">
          Schedule
        </Link>
        <Link href="/hackerpacks" className="p-2 text-[#5D5A88] cursor-pointer">
          Resources
        </Link>
        <Link href="/#faq-section" className="p-2 text-[#5D5A88] cursor-pointer">
          FAQ
        </Link>

        <div className="p-2 text-white cursor-pointer">
          {!hasProfile && (
            <Link href="/register">
              <div className="py-3 px-5 rounded-[30px] bg-[#5D5A88] font-bold">Apply</div>
            </Link>
          )}
          {hasProfile && (
            <Link href="/profile">
              <div className="py-3 px-5 rounded-[30px] bg-[#5D5A88] font-bold">Profile</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
