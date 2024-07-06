import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import AppHeader2_Core from './core';

export const APP_HEADER_HEIGHT = 86;
const INITIAL_HEADER_HEIGHT = APP_HEADER_HEIGHT;
const TOP_OFFSET = 0; // Can be set to APP_HEADER_HEIGHT if want to app bar to be separated from the Hero part

export default function AppHeader2_Wrapper() {
  // Handle scrolling state

  const [height, setHeight] = useState(INITIAL_HEADER_HEIGHT);

  const prevScrollY = useRef(0);
  const appHeaderRef = useRef<HTMLDivElement | null>(null);

  // Handle scrolling effect

  useEffect(() => {
    const handleUp = () => {
      // Reset
      if (window.scrollY <= 0) {
        setHeight(INITIAL_HEADER_HEIGHT);
        return;
      }

      const appHeaderTop = appHeaderRef.current?.getBoundingClientRect().top ?? 0;

      if (appHeaderTop < -APP_HEADER_HEIGHT) {
        // App header is not near viewport?
        // -> Set new height to make menu near viewport
        if (window.scrollY > INITIAL_HEADER_HEIGHT) {
          setHeight(window.scrollY);
        }
      }
    };

    const handleDown = () => {
      // Reset
      if (window.scrollY <= 0) {
        setHeight(INITIAL_HEADER_HEIGHT);
        return;
      }

      const appHeaderTop = appHeaderRef.current?.getBoundingClientRect().top ?? 0;

      if (appHeaderTop >= 0) {
        // App header is at top of viewport?
        // -> Set new height to make menu disappear gradually
        setHeight(window.scrollY + APP_HEADER_HEIGHT);
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
        'fixed top-0 z-[1000]', // NOTE: Comment line below for special hiding effect

        // NOTE: Uncomment line below for special hiding effect
        // 'relative z-[1000]',
      )}

      // NOTE: Uncomment line below for special hiding effect
      // style={{ height, marginBottom: -(height - TOP_OFFSET) }}
    >
      {/* App header core */}
      <div
        ref={appHeaderRef}
        className={'w-full bg-transparent'} // NOTE: Comment this line for special hiding effect

        // NOTE: Uncomment this block for special hiding effect
        // className={clsx('sticky top-0 w-full bg-transparent')}
        // style={{
        //   height: APP_HEADER_HEIGHT,
        // }}
      >
        <AppHeader2_Core />
      </div>
    </header>
  );
}
