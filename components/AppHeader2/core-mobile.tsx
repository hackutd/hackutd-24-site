import { useAuthContext } from '@/lib/user/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { Fragment, useContext, useEffect, useState } from 'react';
import AdminNavbarColumn from './AdminNavbarColumn';
import { useRouter } from 'next/router';
import AdminNavbarGrid from './AdminNavbarGrid';
import { RequestHelper } from '@/lib/request-helper';
import QRScanDialog from './QRScanDialog';
import { SectionReferenceContext } from '@/lib/context/section';
import { NavbarCallbackRegistryContext } from '@/lib/context/navbar';
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

export default function AppHeader2_Core_AdminMobile(props: Props) {
  const { user } = useAuthContext();
  const router = useRouter();

  const isSuperAdmin = user ? user.permissions.indexOf('super_admin') !== -1 : false;
  const isAdmin = isSuperAdmin || (user ? user.permissions.indexOf('admin') !== -1 : false);

  const [scanList, setScanList] = useState<Scan[]>([]);
  const [currentScan, setCurrentScan] = useState<Scan | null>(null);

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

  const mainDockItems = (): JSX.Element[] => {
    const items: JSX.Element[] = [];
    const itemIdRoot: string = (props.dockItemIdRoot ?? 'AppHeader2-Core-mainDockItems') + '_';
    let itemIdx = 0;

    if (isAdmin) {
      items.push(
        <Menu id={itemIdRoot + itemIdx} as="div">
          <Menu.Button
            className={clsx(
              'py-2 px-4 text-[#40B7BA] cursor-pointer flex gap-1 items-center justify-center font-bold',
              'hover:bg-[#DFFEFF] transition-[background] duration-300 ease-in-out',
              'rounded-[20px]',
            )}
          >
            <div className="text-[#40B7BA]">Admin</div>
            <svg
              xmlns="http:www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#40B7BA"
              className="size-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="flex-col absolute right-0 mt-2 w-full origin-top-right divide-x divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none flex">
              <div className="px-1 py-1 w-full">
                <AdminNavbarColumn
                  sectionTitle="Admin"
                  options={[
                    {
                      optionName: 'User Dashboard',
                      onClick: () => router.push('/admin/users'),
                    },
                    {
                      optionName: 'Late Check-in',
                      onClick: () => router.push('/admin/waitlist'),
                    },
                    ...(isSuperAdmin
                      ? [
                          {
                            optionName: 'Stats at a Glance',
                            onClick: () => router.push('/admin/stats'),
                          },
                        ]
                      : []),
                  ]}
                />
              </div>

              <div className="w-full px-1 py-1">
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
        </Menu>,
      );
      itemIdx++;
    }

    return items;
  };

  return (
    <div className="flex justify-center py-2 w-full">
      <div
        id="nav-bar"
        className="relative font-dmSans border-[3px] border-[rgba(30,30,30,0.60)] rounded-xl p-1 bg-white opacity-100 text-[#40B7BA] cursor-pointer w-[80%]"
      >
        <FloatingDockWrapper
          classes={{
            wrapperDiv: clsx('gap-4 flex items-center justify-center'),
          }}
          items={mainDockItems()}
        />

        <QRScanDialog scan={currentScan} onModalClose={() => setCurrentScan(null)} />
      </div>
    </div>
  );
}
