import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthContext } from '@/lib/user/AuthContext';
import QRScanDialog from './QRScanDialog';
import { Menu, Transition } from '@headlessui/react';
import { RequestHelper } from '@/lib/request-helper';
import { Fragment, useContext } from 'react';
import { SectionReferenceContext } from '@/lib/context/section';
import AdminNavbarColumn from './AdminNavbarColumn';
import AdminNavbarGrid from './AdminNavbarGrid';
import FloatingDockWrapper from './FloatingDock/wrapper';
import clsx from 'clsx';

type Props = {
  dockItemIdRoot?: string;
};

type Scan = {
  precendence: number;
  name: string;
  isCheckIn: boolean;
  startTime: Date;
  endTime: Date;
  isPermanentScan: boolean;
};

export default function AppHeader2_Core(props: Props) {
  const { user, hasProfile } = useAuthContext();
  const { faqRef, scheduleRef } = useContext(SectionReferenceContext);

  const router = useRouter();

  const isSuperAdmin = user ? user.permissions.indexOf('super_admin') !== -1 : false;
  const isAdmin = isSuperAdmin || (user ? user.permissions.indexOf('admin') !== -1 : false);

  const [scanList, setScanList] = useState<Scan[]>([]);
  const [currentScan, setCurrentScan] = useState<Scan | null>(null);

  const navItems = [
    {
      text: 'Home',
      href: '/',
      onClick: () => {
        if (router.pathname === '/') {
          window.scroll({
            top: 0,
            behavior: 'smooth',
          });
        } else {
          router.push('/');
        }
      },
    },
    {
      text: 'Schedule',
      href: '/#schedule-section',
      onClick: () => {
        if (router.pathname === '/') {
          scheduleRef.current?.scrollIntoView({
            behavior: 'smooth',
          });
        } else {
          router.push('/#schedule-section');
        }
      },
    },
    {
      text: 'FAQ',
      href: '/#faq-section',
      onClick: () => {
        if (router.pathname === '/') {
          faqRef.current?.scrollIntoView({
            behavior: 'smooth',
          });
        } else {
          router.push('/#faq-section');
        }
      },
    },
  ];

  useEffect(() => {
    async function getScanData() {
      const scans = await RequestHelper.get<Scan[]>('/api/scantypes', {
        headers: {
          authorization: user?.token || '',
        },
      });
      setScanList(scans.data);
    }
    if (!isAdmin) {
      setScanList([]);
    } else {
      getScanData();
    }
  }, [user, isAdmin]);

  const floatingDockItems = (): JSX.Element[] => {
    const items: JSX.Element[] = [];
    const itemIdRoot: string = (props.dockItemIdRoot ?? 'AppHeader2-Core-floating-dock-item') + '_';
    let itemIdx = 0;

    navItems.map((item, idx) => {
      items.push(
        <button
          id={itemIdRoot + idx}
          onClick={item.onClick}
          className={clsx(
            'py-2 px-4 text-[#40B7BA] cursor-pointer flex justify-center font-bold',
            'hover:bg-[#DFFEFF] transition-[background] duration-300 ease-in-out',
            'rounded-[20px]',
          )}
        >
          {item.text}
        </button>,
      );

      itemIdx += 1;
    });

    // Profile/Apply button
    items.push(
      <div id={itemIdRoot + itemIdx} className="p-2 text-white cursor-pointer">
        {user && hasProfile ? (
          <Link href="/profile">
            <div className="py-3 px-5 rounded-[30px] bg-[#40B7BA] font-bold">Profile</div>
          </Link>
        ) : (
          <Link href="/register">
            <div className="py-3 px-5 rounded-[30px] bg-[#40B7BA] font-bold">Apply</div>
          </Link>
        )}
      </div>,
    );

    return items;
  };

  return (
    <div className="flex justify-center py-2 w-full">
      <div
        id="nav-bar"
        className="relative font-dmSans border-[3px] border-[rgba(30,30,30,0.60)] rounded-xl px-16 p-1 bg-white opacity-95 text-[#40B7BA] cursor-pointer w-[60%] lg:w-[50%]"
      >
        <FloatingDockWrapper
          classes={{
            wrapperDiv: clsx('gap-6 flex items-center justify-center'),
          }}
          items={floatingDockItems()}
        />

        <QRScanDialog scan={currentScan} onModalClose={() => setCurrentScan(null)} />

        {/* Admin menu */}
        {isAdmin && (
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="p-2 cursor-pointer flex items-center gap-x-2">
                <div className="text-[#40B7BA]">Admin</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#40B7BA"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-full origin-top-right divide-x divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none flex">
                {isSuperAdmin && (
                  <div className="px-1 py-1 w-1/4">
                    <AdminNavbarColumn
                      sectionTitle="Admin"
                      options={[
                        {
                          optionName: 'User Dashboard',
                          onClick: () => router.push('/admin/users'),
                        },
                        {
                          optionName: 'Stats at a Glance',
                          onClick: () => router.push('/admin/stats'),
                        },
                      ]}
                    />
                  </div>
                )}
                <div className="w-1/2 px-1 py-1">
                  <AdminNavbarGrid
                    numCols={2}
                    sectionTitle="Temporary Scans"
                    options={scanList
                      .filter((scan) => !scan.isPermanentScan)
                      .map((scan) => ({
                        optionName: scan.name,
                        onClick: () => setCurrentScan(scan),
                      }))}
                  />
                </div>
                <div className="px-1 py-1">
                  <AdminNavbarColumn
                    sectionTitle="Permanent Scans"
                    options={scanList
                      .filter((scan) => scan.isPermanentScan)
                      .map((scan) => ({
                        optionName: scan.name,
                        onClick: () => setCurrentScan(scan),
                      }))}
                  />
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </div>
  );
}
