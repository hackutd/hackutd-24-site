import { useAuthContext } from '@/lib/user/AuthContext';
import Link from 'next/link';

export default function AppHeader2_Core() {
  const { hasProfile } = useAuthContext();

  return (
    <div className="flex justify-center py-2 w-full">
      {/* Real navbar */}
      <div className="font-dmSans flex items-center gap-4 border-[3px] border-[rgba(30,30,30,0.60)] rounded-xl px-20 bg-white">
        <Link href="/" className="p-2 text-[#40B7BA] cursor-pointer">
          Home
        </Link>
        <Link href="/#schedule-section" className="p-2 text-[#40B7BA] cursor-pointer">
          Schedule
        </Link>
        <Link href="/hackerpacks" className="p-2 text-[#40B7BA] cursor-pointer">
          Resources
        </Link>
        <Link href="/#faq-section" className="p-2 text-[#40B7BA] cursor-pointer">
          FAQ
        </Link>

        {/*TODO: Readd after applications open*/}
        <div className="p-2 text-white cursor-pointer">
           {/* {!hasProfile && (
            <Link href="/register">
              <div className="py-3 px-5 rounded-[30px] bg-[#40B7BA] font-bold">Apply</div>
            </Link>
          )} */}
          {/* {hasProfile && (
            <Link href="/profile">
              <div className="py-3 px-5 rounded-[30px] bg-[#40B7BA] font-bold">Profile</div>
            </Link>
          )} */}
        </div>
      </div>
    </div>
  );
}
