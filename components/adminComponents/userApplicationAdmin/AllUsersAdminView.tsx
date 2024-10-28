import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { RegistrationState } from '../../../lib/util';
import UserList, { USERLIST_INFINITE_SCROLL_TARGET } from './UserList';
import { SearchIcon } from '@heroicons/react/solid';

interface AllUsersAdminViewProps {
  userGroups: UserIdentifier[][];
  // selectedUsers: string[];
  searchQuery: string;
  registrationState: RegistrationState;
  onUpdateRegistrationState: (newState: RegistrationState) => void;
  onUserGroupClick: (id: string) => void;
  // onUserSelect: (id: string) => void;
  // onAcceptReject: (status: string) => void;
  onSearchQueryUpdate: (searchQuery: string) => void;
}

export default function AllUsersAdminView({
  userGroups,
  // selectedUsers,
  onUserGroupClick,
  // onUserSelect,
  // onAcceptReject,
  searchQuery,
  onSearchQueryUpdate,
  registrationState,
  onUpdateRegistrationState,
}: AllUsersAdminViewProps) {
  return (
    <div className={`h-full px-4 md:px-14 text-sm md:text-base`}>
      {/* Top Bar with Status, Search, and Filters */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-col lg:flex-row  justify-between items-center w-full">
          {/* Search User */}
          <div className="relative icon flex flex-row justify-center items-center w-full lg:w-1/2">
            <input
              type="text"
              className={`
                rounded-lg
                bg-[rgb(213,244,255)] text-[rgb(9,45,122)] placeholder:text-[rgba(9,45,122,0.7)]
                w-full border-none
              `}
              placeholder="Search Users"
              value={searchQuery}
              onChange={(e) => {
                onSearchQueryUpdate(e.target.value);
              }}
            />
            <div className="absolute right-4">
              <SearchIcon className="w-6 h-6 text-[rgb(9,45,122)]" />
            </div>
          </div>

          {/* Status (Close Registration / Live Registration) */}
          {/* <div className="flex flex-row justify-center items-center w-5/12">
            <div>Close Registration</div>
            <div>Live Registration</div>
          </div> */}

          <div className="flex flex-col md:flex-row justify-center items-center w-full mt-8 lg:mt-0">
            <Tab.Group
              selectedIndex={registrationState === RegistrationState.OPEN ? 1 : 0}
              // manual
              onChange={(idx) => {
                onUpdateRegistrationState(
                  idx === 0 ? RegistrationState.CLOSED : RegistrationState.OPEN,
                );
              }}
            >
              <Tab.List className="flex flex-row justify-center items-center w-full">
                <div className="bg-[#F1F8FC] rounded-full">
                  <Tab
                    className={`rounded-full font-bold ${
                      registrationState === RegistrationState.CLOSED
                        ? 'bg-[#163950] text-[#F1F8FC]'
                        : 'bg-[#F1F8FC] text-[#163950]'
                    } py-2 px-4`}
                  >
                    Close Registration
                  </Tab>
                  <Tab
                    className={`rounded-full font-bold ${
                      registrationState === RegistrationState.OPEN
                        ? 'bg-[#163950] text-[#F1F8FC]'
                        : 'bg-[#F1F8FC] text-[#163950]'
                    } py-2 px-4`}
                  >
                    Live Registration
                  </Tab>
                </div>
              </Tab.List>
            </Tab.Group>

            {/* Accept Reject buttons */}
            {/* <div className="flex flex-row w-full justify-around max-w-xs mt-4 lg:mt-0">
              <button
                className="flex flex-row bg-[#EA609C]/25 text-[#872852] text-lg font-bold py-2 px-8 rounded-md"
                onClick={() => onAcceptReject('Rejected')}
              >
                <XIcon className="w-6 h-6 mr-1 mt-0.5" /> Reject
              </button>
              <button
                className="flex flex-row bg-[#84DF58]/25 text-[#409019] text-lg font-bold py-2 px-8 rounded-md"
                onClick={() => onAcceptReject('Accepted')}
              >
                <CheckIcon className="w-6 h-6 mr-1 mt-0.5" /> Accept
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* User Table List */}
      <div
        id={USERLIST_INFINITE_SCROLL_TARGET}
        className={`
          overflow-auto
          mt-5 mb-10
          border-2 border-gray rounded-lg
        `}
        style={{ height: 'calc(100% - 100px)' }}
      >
        <div
          className={`
            min-w-[1024px]
            ${userGroups.length === 0 ? 'bg-[rgba(255,255,255,0.6)]' : ''}
            backdrop-blur
          `}
        >
          {/* Header */}
          <div
            className={clsx(
              `flex flex-row border-b-2 border-gray px-6 py-3 justify-between sticky z-10 top-0`,
              `text-[#40B7BA] bg-[rgba(255,255,255,0.8)]`,
            )}
          >
            {/* <div className="w-1/2 md:w-2/12 flex items-center justify-center">Name</div> */}
            <div className="w-2/12 flex items-center justify-center">Status</div>
            <div className="w-4/12 flex items-center justify-center">University</div>
            <div className="w-2/12 flex items-center justify-center">Major</div>
            <div className="w-2/12 flex items-center justify-center">Year</div>
          </div>

          {/* User List */}
          <UserList
            userGroups={userGroups}
            // selectedUsers={selectedUsers}
            onUserGroupClick={(id) => onUserGroupClick(id)}
            // onUserSelect={(id) => onUserSelect(id)}
          />
        </div>
      </div>
    </div>
  );
}
