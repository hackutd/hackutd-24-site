import FilePlusIcon from '@/public/icons/file-plus.svg';
import CalendarIcon from '@/public/icons/calendar.svg';
import TrophyIcon from '@/public/icons/trophy.svg';
import QuestionIcon from '@/public/icons/question.svg';
import HomeIcon from '@/public/icons/home.svg';
import AdminIcon from '@/public/icons/admin.svg';
import clsx from 'clsx';
import Link from 'next/link';
import { useAuthContext } from '@/lib/user/AuthContext';
import { useContext } from 'react';
import { SectionReferenceContext } from '@/lib/context/section';
import { useRouter } from 'next/router';

export default function AppNavbarBottom() {
  const { hasProfile } = useAuthContext();
  const { faqRef, scheduleRef } = useContext(SectionReferenceContext);
  const router = useRouter();

  return (
    <div
      className={clsx(
        'fixed z-[1000] bottom-2 left-1/2 -translate-x-1/2',
        'flex md:hidden gap-4 bg-[rgba(0,0,0,0.70)]',
        'p-4 rounded-xl',
      )}
    >
      {/* Home Icon */}
      <button
        onClick={() => {
          if (router.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            router.push('/').then(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });
          }
        }}
      >
        <HomeIcon />
      </button>

      {/* <FilePlusIcon /> */}
      {/* Calendar Icon */}
      <button
        onClick={() => {
          if (router.pathname === '/')
            scheduleRef.current?.scrollIntoView({
              behavior: 'smooth',
            });
          else router.push('/#schedule-section');
        }}
      >
        <CalendarIcon />
      </button>

      {/* <Link href="/#prizes-section"> */}
      {/*   <TrophyIcon /> */}
      {/* </Link> */}

      {/* Question Icon */}
      <button
        onClick={() => {
          if (router.pathname === '/')
            faqRef.current?.scrollIntoView({
              behavior: 'smooth',
            });
          else router.push('/#faq-section');
        }}
      >
        <QuestionIcon />
      </button>

      {/* Admin/Profile Icon */}
      <Link href={hasProfile ? '/profile' : '/auth'}>
        <AdminIcon />
      </Link>
    </div>
  );
}
