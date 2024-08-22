import FilePlusIcon from '@/public/icons/file-plus.svg';
import CalendarIcon from '@/public/icons/calendar.svg';
import TrophyIcon from '@/public/icons/trophy.svg';
import QuestionIcon from '@/public/icons/question.svg';
import AdminIcon from '@/public/icons/admin.svg';
import clsx from 'clsx';
import Link from 'next/link';
import { useAuthContext } from '@/lib/user/AuthContext';
import { useContext, useRef, useState, useEffect } from 'react';
import { SectionReferenceContext } from '@/lib/context/section';
import { useRouter } from 'next/router';

export default function AppNavbarBottom() {
  const { hasProfile } = useAuthContext();
  const { faqRef, scheduleRef } = useContext(SectionReferenceContext);
  const router = useRouter();

  const navBarRef = useRef<HTMLDivElement>(null);
  const [diffs, setDiffs] = useState<number[]>([0, 0, 0, 0]);

  // Handle mouse movement within the navigation bar
  const handleMouseMove = (e: MouseEvent) => {
    const navBar = navBarRef.current;
    if (!navBar) return;

    const { x, y, width, height } = navBar.getBoundingClientRect();
    const isMouseInsideNavBar =
      e.clientX >= x && e.clientX <= x + width && e.clientY >= y && e.clientY <= y + height;

    if (isMouseInsideNavBar) {
      const children = navBar.children;
      const newDiffs = [...diffs];
      for (let i = 0; i < children.length; ++i) {
        const child = children[i];
        const rect = child.getBoundingClientRect();
        const center = rect.x + rect.width / 2;
        const diff = e.clientX - center;
        // Limit the diff to a smaller range to prevent excessive movement
        newDiffs[i] = Math.min(Math.max(diff, -15), 15);
      }
      setDiffs(newDiffs);
    } else {
      setDiffs(new Array(diffs.length).fill(0)); // Reset diffs when mouse is outside navbar
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [diffs]);

  const getScale = (diff: number) => {
    const scaleFactor = 1.5; // Increase this value for a more pronounced magnifying effect
    return 1 + Math.max(0, (scaleFactor - 1) * (1 - Math.abs(diff) / 15));
  };

  return (
    <div
      ref={navBarRef}
      className={clsx(
        'fixed z-[1000] bottom-2 left-1/2 -translate-x-1/2',
        'flex md:hidden gap-8 bg-[rgba(0,0,0,0.70)]', // Increased gap for more spacing between elements
        'p-3 rounded-xl w-[40%] max-w-[250px] justify-center items-center',
      )}
      style={{ minWidth: '200px' }} // Set the minimum width here
    >
      {/* <FilePlusIcon /> */}
      <button
        onClick={() => {
          if (router.pathname === '/')
            scheduleRef.current?.scrollIntoView({
              behavior: 'smooth',
            });
          else router.push('/#schedule-section');
        }}
        style={{
          transform: `translateX(${diffs[0]}px) scale(${getScale(diffs[0])})`,
          transition: 'transform 0.3s ease',
        }}
      >
        <CalendarIcon />
      </button>

      {/* <Link href="/#prizes-section"> */}
      {/*   <TrophyIcon /> */}
      {/* </Link> */}

      <button
        onClick={() => {
          if (router.pathname === '/')
            faqRef.current?.scrollIntoView({
              behavior: 'smooth',
            });
          else router.push('/#faq-section');
        }}
        style={{
          transform: `translateX(${diffs[1]}px) scale(${getScale(diffs[1])})`,
          transition: 'transform 0.3s ease',
        }}
      >
        <QuestionIcon />
      </button>

      <Link href={hasProfile ? '/profile' : '/auth'}>
        <div
          style={{
            transform: `translateX(${diffs[2]}px) scale(${getScale(diffs[2])})`,
            transition: 'transform 0.3s ease',
          }}
        >
          <AdminIcon />
        </div>
      </Link>
    </div>
  );
}
