import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getGroupId } from './helpers';
import { useAuthContext } from '@/lib/user/AuthContext';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/solid';
import { ApplicationViewState } from '@/lib/util';
import { ApplicationEntry } from '@/lib/admin/group';

export const USERLIST_INFINITE_SCROLL_TARGET = 'userlist-infinite-scroll-target';

interface UserListProps {
  userGroups: ApplicationEntry[];
  // selectedUsers: string[];
  onUserGroupClick: (id: string) => void;
  // onUserSelect: (id: string) => void;
  appViewState: ApplicationViewState;
}

function HiddenInfo({ v, canUnlock, locked }: { v: string; canUnlock: boolean; locked: boolean }) {
  const [lock, setLock] = useState(locked);
  const lockOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canUnlock) setLock(!lock);
  };
  const lockClassName = 'ml-1 w-5 h-5 hover:scale-125 transition cursor-pointer';
  return (
    <div className="flex gap-x-3 my-4 items-center">
      <p className={`flex flex-row items-center font-bold text-black ${lock ? 'mx-auto' : ''}`}>
        {lock ? (
          <LockClosedIcon onClick={lockOnClick} className={lockClassName} />
        ) : (
          <LockOpenIcon onClick={lockOnClick} className={lockClassName} />
        )}
      </p>
      <p className="text-black">{lock ? '' : v}</p>
    </div>
  );
}

export default function UserList({
  userGroups,
  // selectedUsers,
  onUserGroupClick,
  appViewState,
}: // onUserSelect,
UserListProps) {
  const { user } = useAuthContext();
  const userList = useMemo(() => {
    const result: JSX.Element[] = [];

    userGroups.forEach((group, idx) => {
      const bgColor = idx % 2 == 0 ? 'bg-[rgba(227,227,227,0.8)]' : 'bg-[rgba(255,255,255,0.6)]';
      const blur = 'backdrop-blur-lg';

      result.push(
        <div
          key={group.index}
          className={`
          flex flex-row justify-between px-6
          cursor-pointer hover:bg-[rgb(255,255,255,0.2)] items-center transition
          ${bgColor}
          ${blur}
        `}
          onClick={() => onUserGroupClick(getGroupId(group.application))}
        >
          {/*
            Name
            Status
            University
            Major
            Year
          */}

          {/* <div
            className={`flex w-1/2 md:w-2/12 h-full py-3 justify-center items-center text-[rgb(19,19,19)] text-base`}
            onClick={(e) => {
              e.stopPropagation();
              // onUserSelect(user.id);
            }}
          >
            <div>
              <input
                onChange={(e) => {
                  e.stopPropagation();
                  onUserSelect(user.id);
                }}
                checked={user.selected}
                type="checkbox"
                className="w-4 h-4 mr-2 rounded-sm border-[1px] border-[rgb(19,19,19)] bg-transparent text-[rgb(19,19,19)] !ring-[rgb(19,19,19)]"
              />
            </div>

            <div
              className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[70%]"
              onClick={(e) => {
                e.stopPropagation();
                onUserClick(user.id);
              }}
            >
              {`${user.user.firstName} ${user.user.lastName}`}
            </div>
          </div> */}

          <div
            className={`
            flex items-center justify-center w-2/12 h-full py-3 
            whitespace-nowrap overflow-hidden text-ellipsis max-w-[100%]
          `}
          >
            <span
              className={`
              py-1 px-6 rounded-full 
              ${
                group.application[0].status === 'Accepted'
                  ? 'bg-[rgb(242,253,226)] text-[rgb(27,111,19)]'
                  : ''
              }
              ${
                group.application[0].status === 'Rejected'
                  ? 'bg-[rgb(255,233,218)] text-[rgb(122,15,39)]'
                  : ''
              }
              ${
                group.application[0].status === 'In Review'
                  ? 'bg-[rgb(213,244,255)] text-[rgb(9,45,122)]'
                  : ''
              }
              ${
                group.application[0].status.startsWith('Maybe')
                  ? 'bg-yellow-200 text-[rgb(9,45,122)]'
                  : ''
              }
            `}
            >
              {group.application[0].status}
            </span>
          </div>
          {user.permissions.includes('super_admin') && (
            <div
              className={`
            flex text-center items-center text-base text-[rgb(19,19,19)] w-2/12 h-full py-3j
          `}
            >
              <div
                className={`
            whitespace-nowrap overflow-hidden text-ellipsis w-[100%]
          `}
              >
                <HiddenInfo
                  locked={appViewState === ApplicationViewState.REVIEWABLE}
                  canUnlock={appViewState === ApplicationViewState.ALL}
                  v={Array.from(
                    new Set(
                      group.application.map(
                        (eachUser) => eachUser.user.firstName + ' ' + eachUser.user.lastName,
                      ),
                    ),
                  )
                    .sort((a, b) => a.localeCompare(b))
                    .join(', ')}
                />
              </div>
            </div>
          )}
          <div
            className={`
            flex text-center items-center text-base text-[rgb(19,19,19)] ${
              user.permissions.includes('super_admin') ? 'w-2/12' : 'w-4/12'
            } h-full py-3j
          `}
          >
            <p
              className={`
            whitespace-nowrap overflow-hidden text-ellipsis w-[100%]
          `}
            >
              <HiddenInfo
                locked={appViewState === ApplicationViewState.REVIEWABLE}
                v={Array.from(new Set(group.application.map((eachUser) => eachUser.university)))
                  .sort((a, b) => a.localeCompare(b))
                  .join(', ')}
                canUnlock={appViewState === ApplicationViewState.ALL}
              />
            </p>
          </div>

          <div
            className={`
            flex text-center items-center text-base text-[rgb(19,19,19)] w-2/12 h-full py-3
          `}
          >
            <p
              className={`
            whitespace-nowrap overflow-hidden text-ellipsis w-[100%]
          `}
            >
              {Array.from(new Set(group.application.map((eachUser) => eachUser.major)))
                .sort((a, b) => a.localeCompare(b))
                .join(', ')}
            </p>
          </div>

          <div
            className={`
            flex text-center items-center text-base text-[rgb(19,19,19)] w-2/12 h-full py-3
          `}
          >
            <p
              className={`
            whitespace-nowrap overflow-hidden text-ellipsis w-[100%]
          `}
            >
              {Array.from(new Set(group.application.map((eachUser) => eachUser.studyLevel)))
                .sort((a, b) => a.localeCompare(b))
                .join(', ')}
            </p>
          </div>
        </div>,
      );
    });

    return result;
  }, [onUserGroupClick, userGroups]);

  const pageSize = 20;
  const [userListSlice, setUserViewSlice] = React.useState<JSX.Element[]>(
    userList.slice(0, pageSize),
  );

  useEffect(() => {
    setUserViewSlice(userList.slice(0, pageSize));
  }, [userList, userGroups]);

  const nextPage = () => {
    setUserViewSlice(userList.slice(0, Math.min(userList.length, userListSlice.length + pageSize)));
  };

  return (
    <InfiniteScroll
      className="w-full"
      dataLength={userListSlice.length} // This is important field to render the next data
      next={nextPage}
      hasMore={userListSlice.length < userList.length}
      loader={<h4>Loading...</h4>}
      scrollThreshold={0.8}
      scrollableTarget={USERLIST_INFINITE_SCROLL_TARGET}
    >
      {userListSlice}
    </InfiniteScroll>
  );
}
