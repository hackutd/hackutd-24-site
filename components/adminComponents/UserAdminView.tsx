import { useEffect, useRef, useState } from 'react';
import { RequestHelper } from '../../lib/request-helper';
import Pagination from './UserAdminPagination';
import { useAuthContext } from '../../lib/user/AuthContext';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LockClosedIcon,
  LockOpenIcon,
  XIcon,
} from '@heroicons/react/solid';
import Link from 'next/link';

interface UserAdminViewProps {
  users: UserIdentifier[];
  currentUserId: string;
  goBack: () => void;
  // updateCurrentUser: (value: Omit<UserIdentifier, 'scans'>) => void;
  onUserClick: (id: string) => void;
  onAcceptReject: (status: string, notes: string) => void;
  onUpdateRole: (newRole: UserPermission) => void;
}

interface BasicInfoProps {
  k: string;
  v: string;
  locked?: boolean;
  canUnlock?: boolean;
}

function BasicInfo({ k, v, locked, canUnlock }: BasicInfoProps) {
  const [lock, setLock] = useState<boolean>(locked);
  const lockOnClick = () => {
    if (canUnlock) setLock(!lock);
  };
  const lockClassName = 'ml-1 w-5 h-5 hover:scale-125 transition cursor-pointer';
  return (
    <div className="flex flex-col my-4">
      <p className="flex flex-row items-center font-bold text-black">
        {k}
        {locked ? (
          lock ? (
            <LockClosedIcon onClick={lockOnClick} className={lockClassName} />
          ) : (
            <LockOpenIcon onClick={lockOnClick} className={lockClassName} />
          )
        ) : (
          <span />
        )}
      </p>
      <p className="text-black">{lock ? '' : v}</p>
    </div>
  );
}

function FRQInfo({ k, v }: BasicInfoProps) {
  return (
    <div className="flex flex-col my-4">
      <p className="text-2xl font-bold text-black mb-2">{k}</p>
      <p className=" text-black">{v}</p>
    </div>
  );
}

export default function UserAdminView({
  users,
  currentUserId,
  goBack,
  onUserClick,
  onAcceptReject,
  onUpdateRole,
}: UserAdminViewProps) {
  const { user } = useAuthContext();

  let currentUserIndex = 0;
  const currentUser = users.find((user, i) => {
    if (user.id === currentUserId) {
      currentUserIndex = i;
      return true;
    }
    return false;
  });

  const stringifyScore = (appScore: { acceptCount: number; rejectCount: number }) => {
    if (appScore.acceptCount >= 1000000000) return 'Auto-Accepted by HackPortal';
    return `${appScore.acceptCount - appScore.rejectCount} (${appScore.acceptCount} accepted, ${
      appScore.rejectCount
    } rejected)`;
  };

  const user_info = [
    ['Major', currentUser.major],
    ['Application Score', stringifyScore(currentUser.applicationScore)],
    ['University', currentUser.university],
    ['Current Level of Study', currentUser.studyLevel],
    ['Number of Hackathons Attended', currentUser.hackathonExperience],
    ['Software Experience', currentUser.softwareExperience],
    [
      'Resume',
      !currentUser.resume || currentUser.resume === '' ? (
        <p>No resume found</p>
      ) : (
        <Link passHref href={currentUser.resume} target="_blank" rel="noopener noreferrer">
          <button className="border-2 p-3 hover:bg-gray-200">Click here to download resume</button>
        </Link>
      ),
    ],
  ];

  // Pagination
  const ref = useRef(null);
  const applicationNotesRef = useRef<HTMLTextAreaElement>(null);

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [height, setHeight] = useState(60);
  const [currentPage, setCurrentPage] = useState(1);
  const [newRole, setNewRole] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isInEditMode, setIsInEditMode] = useState(false);

  // Contains info of the user who is viewing the data
  const { user: organizer } = useAuthContext();

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const h = Math.max(60, ref.current.offsetHeight);
    setHeight(h);
    setCurrentPage(Math.floor(currentUserIndex / Math.floor(h / 60) + 1));
  }, [windowHeight, currentUserIndex]);

  const updateRole = async () => {
    if (!organizer.permissions.includes('super_admin')) {
      alert('You do not have permission to perform this functionality');
      return;
    }

    try {
      const { status, data } = await RequestHelper.post<
        {
          userId: string;
          newRole: string;
        },
        any
      >(
        '/api/users/roles',
        {
          headers: {
            Authorization: organizer.token,
          },
        },
        {
          userId: currentUser.id,
          newRole,
        },
      );
      if (!status || data.statusCode >= 400) {
        setErrors([...errors, data.msg]);
      } else {
        alert(data.msg);
        onUpdateRole(newRole as UserPermission);
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => [...prev, 'Unexpected error. Please try again later']);
    }

    // TODO: Make request to backend to update user roles
  };

  //////////////// TODO: IMPLEMENT
  const openResume = () => {};

  const pageSize = Math.floor(height / 60);
  const startIndex = (currentPage - 1) * pageSize;

  // 208 px
  return (
    <div
      className={`
        lg:mx-14 flex flex-row h-full 
        bg-[rgba(255,255,255,0.6)] backdrop-blur
        rounded-2xl
      `}
    >
      {/* User List */}
      <div className="hidden md:block md:w-72 px-2 py-4">
        {/* Page */}
        <div className="overflow-y-hidden h-[calc(100%-40px)]" ref={ref}>
          {users.slice(startIndex, startIndex + pageSize).map((user) => (
            <div
              key={user.id}
              className={`
                flex flex-row justify-center items-center w-full py-2 rounded-xl mb-3 h-12 p-4
                bg-[rgba(255,255,255,0.6)]
                shadow-md ${user.id === currentUserId ? 'border-primaryDark border-[2px]' : ''}
                cursor-pointer
              `}
              onClick={() => onUserClick(user.id)}
            >
              {/* <div
                className={`
                  text-[rgba(19,19,19,1)] font-bold
                  whitespace-nowrap overflow-hidden text-ellipsis max-w-[50%]
                `}
              >
                {user.user.firstName}
              </div> */}
              <div
                className={`
                  py-1 px-6 text-sm font-bold rounded-full
                  flex-1 flex flex-row justify-center items-center
                  whitespace-nowrap overflow-hidden text-ellipsis
                  ${user.status === 'Accepted' ? 'bg-[rgb(242,253,226)] text-[rgb(27,111,19)]' : ''}
                  ${user.status === 'Rejected' ? 'bg-[rgb(255,233,218)] text-[rgb(122,15,39)]' : ''}
                  ${user.status === 'In Review' ? 'bg-[rgb(213,244,255)] text-[rgb(9,45,122)]' : ''}
                `}
              >
                {user.status}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalCount={users.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* User */}
      <div className="rounded-2xl h-full overflow-y-scroll w-full flex-1">
        {/* Header */}
        <div className="sticky top-0 bg-[rgba(255,255,255,0.8)] flex flex-row justify-between items-center text-secondary">
          <div className="flex items-center p-0">
            <ChevronLeftIcon
              className="h-12 w-12 text-sm font-extralight cursor-pointer"
              onClick={() => onUserClick(users[currentUserIndex - 1]?.id || '')}
            />
            <ChevronRightIcon
              className="h-12 w-12 text-sm font-extralight cursor-pointer"
              onClick={() => onUserClick(users[currentUserIndex + 1]?.id || '')}
            />
          </div>
          <div onClick={goBack} className="p-3">
            <XIcon className="h-12 w-12 cursor-pointer" />
          </div>
        </div>

        {/* Application */}
        <div className="p-5 sm:p-10 text-complementary bg-[rgba(255,255,255,0.4)]">
          {/* Application Status */}
          <div className="flex-wrap gap-y-2 flex flex-row justify-between items-center">
            <p
              className={`
                font-bold py-1 px-6 rounded-full
                ${
                  currentUser.status === 'Accepted'
                    ? 'bg-[rgb(242,253,226)] text-[rgb(27,111,19)]'
                    : ''
                }
                ${
                  currentUser.status === 'Rejected'
                    ? 'bg-[rgb(255,233,218)] text-[rgb(122,15,39)]'
                    : ''
                }
                ${
                  currentUser.status === 'In Review'
                    ? 'bg-[rgb(213,244,255)] text-[rgb(9,45,122)]'
                    : ''
                }
              `}
            >
              {currentUser.status}
            </p>

            <div className="text-sm flex-wrap gap-y-2 flex flex-row justify-between items-start gap-x-3">
              <button
                className="rounded-full bg-transparent text-[rgba(66,184,187,1)] border-2 border-solid border-[rgba(66,184,187,1)] font-bold py-2 px-8 hover:border-red-500 hover:text-white hover:bg-red-500 transition"
                onClick={() => onAcceptReject('Rejected', applicationNotesRef.current.value)}
              >
                REJECT
              </button>
              <button
                className="rounded-full bg-[rgba(66,184,187,1)] text-white border-2 border-solid border-[rgba(66,184,187,1)] font-bold py-2 px-8 hover:border-green-500 hover:bg-green-500 transition"
                onClick={() => onAcceptReject('Accepted', applicationNotesRef.current.value)}
              >
                ACCEPT
              </button>
            </div>
          </div>

          <div className="my-6 w-full border-2 border-gray-200 rounded-md" />

          {/* Basic Information */}
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            {/* Name, School, etc... */}
            <div className="flex flex-row gap-6 sm:w-3/5">
              <div className="flex flex-col basis-0 flex-grow">
                <BasicInfo
                  k="Name"
                  v={currentUser.user.firstName + ' ' + currentUser.user.lastName}
                  locked={true}
                  canUnlock={organizer.permissions.includes('super_admin')}
                />
                <BasicInfo k="Major" v={currentUser.major} />
                <BasicInfo k="Level of Study" v={currentUser.studyLevel} />
              </div>

              <div className="flex flex-col basis-0 flex-grow">
                <BasicInfo
                  k="School"
                  v={currentUser.university ?? currentUser.universityManual}
                  locked={true}
                  canUnlock={organizer.permissions.includes('super_admin')}
                />
                <BasicInfo k="Software Experience" v={currentUser.softwareExperience} />
                {/* this should PROBABLY be currentUser.hackathonNumber, but I think the registration interface is populated incorrectly */}
                <BasicInfo k="Hackathons Attended" v={`${currentUser.hackathonExperience}`} />
              </div>
            </div>

            {/* Application Score */}
            <div className="flex flex-col items-center sm:w-2/5 text-black">
              <p className="font-bold text-xl text-black">Application Score</p>

              <p className="text-8xl font-dmSans">
                {currentUser.applicationScore.acceptCount -
                  currentUser.applicationScore.rejectCount}
              </p>

              <p className="italic text-gray-600">
                <span className="text-green-500">
                  {currentUser.applicationScore.acceptCount} accepted
                </span>{' '}
                /{' '}
                <span className="text-red-500">
                  {currentUser.applicationScore.rejectCount} rejected
                </span>
              </p>

              {user.permissions.includes('super_admin') && (
                <div className="flex-wrap flex flex-row gap-2 p-3 w-full">
                  <select
                    value={newRole}
                    onChange={(e) => {
                      setNewRole(e.target.value);
                    }}
                    name="new_role"
                    className="flex-1 border-2 rounded-xl p-2"
                  >
                    <option value="">Choose a role</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="hacker">Hacker</option>
                  </select>

                  {newRole !== '' && (
                    <button
                      onClick={() => {
                        updateRole();
                      }}
                      className="flex-1 font-bold bg-[rgba(66,184,187,1)] text-white p-2 rounded-xl"
                    >
                      Update Role
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <textarea
              ref={applicationNotesRef}
              className="w-full h-52 border-gray-300 border-2 rounded-md text-black bg-gray-300/20"
            ></textarea>
          </div>
          <div className="my-6 w-full border-2 border-gray-200 rounded-md" />
          {/* FRQ */}
          <div className="flex flex-col w-full">
            <FRQInfo
              k={'Why do you want to attend HackUTD Ripple Effect?'}
              v={currentUser.whyAttend}
            />
            <FRQInfo
              k={'How many hackathons have you submitted to and what did you learn from them?'}
              v={currentUser.hackathonNumber}
            />
            <FRQInfo
              k={
                "If you haven't been to a hackathon, what do you hope to learn from HackUTD Ripple Effect?"
              }
              v={currentUser.hackathonFirstTimer}
            />
            <FRQInfo
              k={'What are you looking forward to at HackUTD Ripple Effect?'}
              v={currentUser.lookingForward}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
