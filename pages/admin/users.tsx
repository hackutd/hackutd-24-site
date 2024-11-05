// import { GetServerSideProps } from 'next';
// import AdminHeader from '../../components/adminComponents/AdminHeader';
// import FilterComponent from '../../components/adminComponents/FilterComponent';
// import UserList from '../../components/adminComponents/userApplicationAdmin/UserList';
// import { UserData } from '../api/users';
import { Dialog, Transition } from '@headlessui/react';
import Head from 'next/head';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { isAuthorized } from '.';
import AllUsersAdminView from '../../components/adminComponents/userApplicationAdmin/AllUsersAdminView';
import UserAdminGroupView from '../../components/adminComponents/userApplicationAdmin/UserAdminGroupView';
import { RequestHelper } from '../../lib/request-helper';
import { useAuthContext } from '../../lib/user/AuthContext';
import { ApplicationViewState, RegistrationState } from '../../lib/util';
import { useUserGroup } from '@/lib/admin/group';
import AdminStatsCard from '@/components/adminComponents/AdminStatsCard';
import { CheckIcon, XCircleIcon } from '@heroicons/react/solid';

/**
 *
 * The User Dashboard of Admin Console. Shows all users that are registered in the system.
 *
 * Route: /admin/users
 *
 */
export default function UserPage() {
  const { user } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const userGroups = useUserGroup((state) => state.groups);
  const setUserGroups = useUserGroup((state) => state.setUserGroup);
  const [currentUserGroup, setCurrentUserGroup] = useState('');

  // const [filter, setFilter] = useState({
  //   hacker: true,
  //   sponsor: true,
  //   organizer: true,
  //   admin: true,
  //   super_admin: true,
  // });
  const [filteredGroups, setFilteredGroups] = useState<UserIdentifier[][]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [registrationStatus, setRegistrationStatus] = useState(RegistrationState.UNINITIALIZED);
  const [appViewState, setAppViewState] = useState(ApplicationViewState.REVIEWABLE);
  const [nextRegistrationStatus, setNextRegistrationStatus] = useState(
    RegistrationState.UNINITIALIZED,
  );

  let timer: NodeJS.Timeout;

  async function fetchInitData() {
    setLoading(true);
    setNextRegistrationStatus(RegistrationState.UNINITIALIZED);
    if (!user) return;

    const allowRegistrationState = (
      await RequestHelper.get<{ allowRegistrations: boolean }>('/api/registrations/status', {
        headers: {
          Authorization: user.token,
        },
      })
    )['data'];

    setRegistrationStatus(
      allowRegistrationState.allowRegistrations ? RegistrationState.OPEN : RegistrationState.CLOSED,
    );

    const userGroupsData: UserIdentifier[][] = (
      await RequestHelper.get<UserIdentifier[][]>('/api/users', {
        headers: {
          Authorization: user.token,
        },
      })
    )['data'];
    setUserGroups(userGroupsData);
    setFilteredGroups(userGroupsData);
    setLoading(false);
  }

  useEffect(() => {
    fetchInitData();
  }, []);

  useEffect(() => {
    if (loading) return;
    timer = setTimeout(() => {
      if (searchQuery !== '') {
        const newFiltered = userGroups.filter(
          (users) =>
            users.filter(
              ({ user }) =>
                `${user.firstName.trim()} ${user.lastName.trim()}`
                  .toLowerCase()
                  .indexOf(searchQuery.toLowerCase()) !== -1,
            ).length > 0,
        );
        setFilteredGroups(newFiltered);
      } else {
        setFilteredGroups([...userGroups]);
      }
    }, 750);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, loading, userGroups]);

  // const updateFilter = (name: string) => {
  //   const filterCriteria = {
  //     ...filter,
  //     [name]: !filter[name],
  //   };
  //   const newFilteredUser = users.filter(({ user }) => {
  //     for (let category of Object.keys(filterCriteria) as UserPermission[]) {
  //       if (filterCriteria[category] && user.permissions.includes(category)) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   });
  //   setFilteredUsers(newFilteredUser);
  //   setFilter(filterCriteria);
  // };

  // const sortByName = () => {
  //   setFilteredUsers((prev) =>
  //     [...prev].sort((a, b) => {
  //       const nameA = a.user.firstName + ' ' + a.user.lastName;
  //       const nameB = b.user.firstName + ' ' + b.user.lastName;
  //       return nameA.localeCompare(nameB);
  //     }),
  //   );
  // };

  // const handleUserSelect = (id: string) => {
  //   setUsers((prev) =>
  //     prev.map((user) => (user.id === id ? { ...user, selected: !user.selected } : user)),
  //   );
  //   setFilteredUsers((prev) =>
  //     prev.map((user) => (user.id === id ? { ...user, selected: !user.selected } : user)),
  //   );
  //   if (selectedUsers.includes(id)) {
  //     setSelectedUsers([...selectedUsers.filter((v) => v != id)]);
  //     return;
  //   }
  //   setSelectedUsers([...selectedUsers, id]);
  // };

  // const postHackersStatus = (status: string, notes: string) => {
  //   if (selectedUsers.length === 0) return;
  //   fetch('/api/acceptreject', {
  //     method: 'post',
  //     body: JSON.stringify({
  //       adminId: user.id,
  //       selectedUsers,
  //       status,
  //       notes,
  //     }),
  //     headers: {
  //       Authorization: user.token,
  //     },
  //   })
  //     .then((res) => {
  //       if (res.status !== 200) {
  //         alert('Hackers update failed...');
  //       } else {
  //         setUsers((prev) =>
  //           prev.map((user) => ({
  //             ...user,
  //             status: selectedUsers.includes(user.id) ? status : user.status,
  //             selected: false,
  //           })),
  //         );
  //         setFilteredUsers((prev) =>
  //           prev.map((user) => ({
  //             ...user,
  //             selected: false,
  //             status: selectedUsers.includes(user.id) ? status : user.status,
  //           })),
  //         );
  //         alert('Hackers update success');
  //       }
  //     })
  //     .catch((err) => {
  //       alert(err);
  //     });
  // };
  //
  const numAppsReviewed = useMemo(() => {
    console.log(
      userGroups.filter((obj) => {
        return obj.every((applicant) =>
          applicant.scoring?.some((score) => score.reviewer === 'Super Admin'),
        );
      }),
    );
    return userGroups.reduce(
      (acc, curr) =>
        acc +
        (curr.every((applicant) =>
          applicant.scoring?.some((s) => s.reviewer === `${user.firstName} ${user.lastName}`),
        )
          ? 1
          : 0),
      0,
    );
  }, [userGroups]);

  const numAppsAccepted = useMemo(() => {
    return userGroups.reduce(
      (acc, curr) =>
        acc +
        (curr.every((applicant) =>
          applicant.scoring?.some(
            (s) => s.reviewer === `${user.firstName} ${user.lastName}` && s.score === 4,
          ),
        )
          ? 1
          : 0),
      0,
    );
  }, [userGroups]);
  const numAppsRejected = useMemo(() => {
    return userGroups.reduce(
      (acc, curr) =>
        acc +
        (curr.every((applicant) =>
          applicant.scoring?.some(
            (s) => s.reviewer === `${user.firstName} ${user.lastName}` && s.score === 1,
          ),
        )
          ? 1
          : 0),
      0,
    );
  }, [userGroups]);

  const numAppsMaybe = useMemo(() => {
    return userGroups.reduce(
      (acc, curr) =>
        acc +
        (curr.every((applicant) =>
          applicant.scoring?.some(
            (s) =>
              s.reviewer === `${user.firstName} ${user.lastName}` && s.score > 1 && s.score < 4,
          ),
        )
          ? 1
          : 0),
      0,
    );
  }, [userGroups]);

  const acceptanceRate = useMemo(
    () => `${((numAppsAccepted * 100) / userGroups.length).toFixed(2)}%`,
    [userGroups, numAppsAccepted],
  );

  if (!user || !isAuthorized(user))
    return <div className="text-2xl font-black text-center">Unauthorized</div>;

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow items-center">
      <Head>
        <title>HackUTD 2024 - Admin</title> {/* !change */}
        <meta name="description" content="HackPortal's Admin Page" />
      </Head>

      {/* <section id="subheader" className="p-2 md:p-4">
        <AdminHeader />
      </section> */}

      <div className="p-4 md:p-8" />

      <div className="w-full max-w-screen-2xl ">
        <div className="w-full flex-col gap-y-3 md:flex-row flex justify-around mb-6">
          <AdminStatsCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                />
              </svg>
            }
            title="Apps reviewed"
            value={numAppsReviewed}
          />
          <AdminStatsCard
            icon={<CheckIcon color="green" />}
            title="Apps accepted"
            value={numAppsAccepted}
          />
          <AdminStatsCard
            icon={<XCircleIcon color="red" />}
            title="Apps rejected"
            value={numAppsRejected}
          />
          <AdminStatsCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            }
            title="Acceptance Rate"
            value={acceptanceRate}
          />
        </div>
      </div>
      <div className="w-full max-w-screen-2xl mb-10" style={{ height: 'calc(100vh - 180px)' }}>
        {currentUserGroup === '' ? (
          <AllUsersAdminView
            userGroups={filteredGroups}
            // selectedUsers={selectedUsers}
            onUserGroupClick={(id) => {
              // setSelectedUsers([id]);
              setCurrentUserGroup(id);
            }}
            onUpdateRegistrationState={(newState) => {
              setNextRegistrationStatus(newState);
            }}
            // onUserSelect={(id) => handleUserSelect(id)}
            // onAcceptReject={(status) => postHackersStatus(status, '')}
            searchQuery={searchQuery}
            onSearchQueryUpdate={(searchQuery) => {
              setSearchQuery(searchQuery);
            }}
            onUpdateAppViewState={(newState) => {
              setAppViewState(newState);
            }}
            appViewState={appViewState}
            registrationState={registrationStatus}
          />
        ) : (
          <UserAdminGroupView
            userGroups={filteredGroups}
            currentUserGroupId={currentUserGroup}
            goBack={() => setCurrentUserGroup('')}
            onUserGroupClick={(id) => {
              // setSelectedUsers([id]);
              setCurrentUserGroup(id);
            }}
            // onAcceptReject={(status, notes) => postHackersStatus(status, notes)}
            // onUpdateRole={(newRole) => {
            //   setUsers((users) =>
            //     users.map((user) =>
            //       user.id !== currentUser
            //         ? { ...user }
            //         : { ...user, user: { ...user.user, permissions: [newRole] } },
            //     ),
            //   );
            //   setFilteredUsers((users) =>
            //     users.map((user) =>
            //       user.id !== currentUser
            //         ? { ...user }
            //         : { ...user, user: { ...user.user, permissions: [newRole] } },
            //     ),
            //   );
            // }}
          />
        )}
      </div>

      <Transition
        appear
        show={
          nextRegistrationStatus === RegistrationState.OPEN ||
          nextRegistrationStatus === RegistrationState.CLOSED
        }
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setNextRegistrationStatus(RegistrationState.UNINITIALIZED)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Update Registration Status
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {nextRegistrationStatus === RegistrationState.OPEN
                        ? 'Are you sure you want to allow registration?'
                        : 'Are you sure you want to disable registration?'}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={async () => {
                        try {
                          await RequestHelper.post<
                            { allowRegistrations: boolean },
                            { msg: string }
                          >(
                            '/api/registrations/toggle',
                            {
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: user.token,
                              },
                            },
                            {
                              allowRegistrations: nextRegistrationStatus === RegistrationState.OPEN,
                            },
                          );
                          alert(
                            'Registration state updated successfully. Please refresh the page to view application status',
                          );
                          setRegistrationStatus(nextRegistrationStatus);
                        } catch (error) {
                          alert(error);
                        } finally {
                          setNextRegistrationStatus(RegistrationState.UNINITIALIZED);
                        }
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setNextRegistrationStatus(RegistrationState.UNINITIALIZED)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
