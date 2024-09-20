import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import AppHeader2_Core from './core';
import { useAuthContext } from '@/lib/user/AuthContext';
import { useRouter } from 'next/router';

export default function AppHeader2_Wrapper() {
  const { user, signOut } = useAuthContext();
  const router = useRouter();

  // Handle scrolling state

  const prevScrollY = useRef(0);
  const headerCoreRef = useRef<HTMLDivElement | null>(null);

  const defaultHeaderHeight = 94;
  const appHeaderHeight = useRef(0);
  const initialHeaderHeight = useRef(0);
  const topOffset = useRef(0); // Can be set to APP_HEADER_HEIGHT if want app bar to be separated from the Hero part

  const [height, setHeight] = useState<number>(initialHeaderHeight.current);

  useEffect(() => {
    const height = headerCoreRef.current?.clientHeight;
    appHeaderHeight.current = (height ?? 0) === 0 ? defaultHeaderHeight : height;
    initialHeaderHeight.current = appHeaderHeight.current;
    topOffset.current = 0;
  }, [headerCoreRef.current?.clientHeight]);

  // Handle scrolling effect

  useEffect(() => {
    const handleUp = () => {
      // Reset
      if (window.scrollY <= 0) {
        setHeight(initialHeaderHeight.current);
        return;
      }

      const appHeaderTop = headerCoreRef.current?.getBoundingClientRect().top ?? 0;

      if (appHeaderTop < -appHeaderHeight.current) {
        // App header is not near viewport?
        // -> Set new height to make menu near viewport
        if (window.scrollY > initialHeaderHeight.current) {
          setHeight(window.scrollY);
        }
      }
    };

    const handleDown = () => {
      // Reset
      if (window.scrollY <= 0) {
        setHeight(initialHeaderHeight.current);
        return;
      }

      const appHeaderTop = headerCoreRef.current?.getBoundingClientRect().top ?? 0;

      if (appHeaderTop >= 0) {
        // App header is at top of viewport?
        // -> Set new height to make menu disappear gradually
        setHeight(window.scrollY + appHeaderHeight.current);
      }
    };

    // Main Part

    const handleScroll = (_event: Event) => {
      if (prevScrollY.current > window.scrollY) {
        // Scroll up
        handleUp();
      } else {
        // Scroll down
        handleDown();
      }

      prevScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={clsx(
        'hidden md:flex flex-col w-full',
        // 'fixed top-0 z-[1000]', // NOTE: Comment line below for special hiding effect
        // NOTE: Uncomment line below for special hiding effect
        'relative z-[1000]',
      )}
      // NOTE: Uncomment line below for special hiding effect
      style={{
        height,
        marginBottom: -(height - topOffset.current),
        pointerEvents: 'none', // allow click through
      }}
    >
      {/* App header core */}
      <div
        ref={headerCoreRef}
        // className={'w-full bg-transparent relative flex items-center'} // NOTE: Comment this line for special hiding effect
        // NOTE: Uncomment this block for special hiding effect
        className={clsx('sticky top-0 w-full bg-transparent flex items-center')} // Known issue for sticky: https://stackoverflow.com/questions/45530235/the-property-position-sticky-is-not-working
        style={{
          pointerEvents: 'auto',
        }}
      >
        <AppHeader2_Core />

        <button
          className="absolute left-[0rem] lg:left-[0rem] py-3 px-5 rounded-[30px] bg-[#40B7BA] font-bold text-white ml-3 border-2 border-white"
          onClick={async () => {
            if (user) {
              await signOut();
            } else {
              await router.push('/auth');
            }
          }}
        >
          {user ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
    </header>
  );
}
