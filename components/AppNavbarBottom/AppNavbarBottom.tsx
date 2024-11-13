import CalendarIcon from '@/public/icons/calendar.svg';
import QuestionIcon from '@/public/icons/question.svg';
import HomeIcon from '@/public/icons/home.svg';
import AdminIcon from '@/public/icons/admin.svg';
import ScannerIcon from '@/public/icons/scanner.svg';
import LivestreamIcon from '@/public/icons/livestream.svg';
import clsx from 'clsx';
import { useAuthContext } from '@/lib/user/AuthContext';
import { useContext } from 'react';
import { SectionReferenceContext } from '@/lib/context/section';
import { useRouter } from 'next/router';
import { NavbarCallbackRegistryContext } from '@/lib/context/navbar';
import FloatingDockWrapper from '../AppHeader2/FloatingDock/wrapper';

function isAuthorized(user): boolean {
  if (!user || !user.permissions) return false;
  return (
    (user.permissions as string[]).includes('admin') ||
    (user.permissions as string[]).includes('super_admin')
  );
}

type Props = {
  dockItemIdRoot?: string;
};

export default function AppNavbarBottom(props: Props) {
  const { user, hasProfile } = useAuthContext();
  const { faqRef, scheduleRef } = useContext(SectionReferenceContext);
  const { callbackRegistry } = useContext(NavbarCallbackRegistryContext);

  const router = useRouter();

  const floatingDockItems = (): JSX.Element[] => {
    const items: JSX.Element[] = [];
    const itemIdRoot: string = (props.dockItemIdRoot ?? 'AppNavbarBottom-floating-dock-item') + '_';
    let itemIdx = 0;

    // HomeIcon
    items.push(
      <button
        id={itemIdRoot + itemIdx}
        className={clsx('p-1.5 hover:bg-[rgb(39,39,42)] rounded-full')}
        onClick={async () => {
          if (Object.hasOwn(callbackRegistry, router.pathname)) {
            await callbackRegistry[router.pathname]();
          }
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
      </button>,
    );
    itemIdx++;

    // LivestreamIcon
    items.push(
      <button
        id={itemIdRoot + itemIdx}
        className={clsx('p-1.5 hover:bg-[rgb(39,39,42)] rounded-full')}
        onClick={async () => {
          if (Object.hasOwn(callbackRegistry, router.pathname)) {
            await callbackRegistry[router.pathname]();
          }
          if (router.pathname !== '/livestream') {
            router.push('/livestream');
          }
        }}
      >
        <LivestreamIcon style={{ width: '30px', height: '30px' }} />
      </button>,
    );
    itemIdx++;

    // CalendarIcon
    items.push(
      <button
        id={itemIdRoot + itemIdx}
        className={clsx('p-1.5 hover:bg-[rgb(39,39,42)] rounded-full')}
        onClick={async () => {
          if (Object.hasOwn(callbackRegistry, router.pathname)) {
            await callbackRegistry[router.pathname]();
          }
          if (router.pathname === '/')
            scheduleRef.current?.scrollIntoView({
              behavior: 'smooth',
            });
          else router.push('/#schedule-section');
        }}
      >
        <CalendarIcon />
      </button>,
    );
    itemIdx++;

    // QuestionIcon
    items.push(
      <button
        id={itemIdRoot + itemIdx}
        className={clsx('p-1.5 hover:bg-[rgb(39,39,42)] rounded-full')}
        onClick={async () => {
          if (Object.hasOwn(callbackRegistry, router.pathname)) {
            await callbackRegistry[router.pathname]();
          }
          if (router.pathname === '/')
            faqRef.current?.scrollIntoView({
              behavior: 'smooth',
            });
          else router.push('/#faq-section');
        }}
      >
        <QuestionIcon />
      </button>,
    );
    itemIdx++;

    // AdminIcon
    items.push(
      <button
        id={itemIdRoot + itemIdx}
        className={clsx('p-1.5 hover:bg-[rgb(39,39,42)] rounded-full')}
        onClick={async () => {
          if (Object.hasOwn(callbackRegistry, router.pathname)) {
            await callbackRegistry[router.pathname]();
          }
          await router.push(hasProfile ? '/profile' : '/auth');
        }}
      >
        <AdminIcon />
      </button>,
    );
    itemIdx++;

    // Scanner Icon
    {
      isAuthorized(user) &&
        items.push(
          <button
            id={itemIdRoot + itemIdx}
            className={clsx('p-1.5 hover:bg-[rgb(39,39,42)] rounded-full')}
            onClick={async () => {
              if (Object.hasOwn(callbackRegistry, router.pathname)) {
                await callbackRegistry[router.pathname]();
              }
              await router.push(isAuthorized(user) ? '/admin/scan' : '/auth');
            }}
          >
            <ScannerIcon />
          </button>,
        );
      itemIdx++;
    }

    return items;
  };

  return (
    <div
      className={clsx(
        'md:hidden fixed z-[1000] bottom-2 left-1/2 -translate-x-1/2',
        'bg-[rgba(0,0,0,0.70)] p-3 rounded-xl',
        'w-[max(80%, 250px)] max-w-[300px]',
      )}
    >
      <FloatingDockWrapper
        settings={{
          widthScaleFactor: 0.5,
          distanceMagnify: 80,
        }}
        classes={{
          wrapperDiv: clsx('gap-4 flex items-center justify-center'),
        }}
        items={floatingDockItems()}
      />
    </div>
  );
}
