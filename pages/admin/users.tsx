// import { GetServerSideProps } from 'next';
// import AdminHeader from '../../components/adminComponents/AdminHeader';
// import FilterComponent from '../../components/adminComponents/FilterComponent';
// import UserList from '../../components/adminComponents/userApplicationAdmin/UserList';
// import { UserData } from '../api/users';
import { Dialog, Transition } from '@headlessui/react';
import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import { isAuthorized } from '.';
import AllUsersAdminView from '../../components/adminComponents/userApplicationAdmin/AllUsersAdminView';
import UserAdminGroupView from '../../components/adminComponents/userApplicationAdmin/UserAdminGroupView';
import { RequestHelper } from '../../lib/request-helper';
import { useAuthContext } from '../../lib/user/AuthContext';
import { RegistrationState } from '../../lib/util';
import { useUserGroup } from '@/lib/admin/group';

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
            registrationState={registrationStatus}
          />
        ) : (
          <UserAdminGroupView
            userGroups={userGroups}
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
