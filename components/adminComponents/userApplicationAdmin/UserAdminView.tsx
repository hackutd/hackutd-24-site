import { useEffect, useRef, useState } from 'react';
import { RequestHelper } from '../../../lib/request-helper';
import { useAuthContext } from '../../../lib/user/AuthContext';
import { LockClosedIcon, LockOpenIcon, XIcon } from '@heroicons/react/solid';

interface UserAdminViewProps {
  currentApplicant: UserIdentifier;
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

export default function UserAdminView({ currentApplicant }: UserAdminViewProps) {
  const { user } = useAuthContext();

  // Pagination
  const applicationNotesRef = useRef<HTMLTextAreaElement>(null);

  const [newRole, setNewRole] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  // Contains info of the user who is viewing the data
  const { user: organizer } = useAuthContext();

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
          userId: currentApplicant.id,
          newRole,
        },
      );
      if (!status || data.statusCode >= 400) {
        setErrors([...errors, data.msg]);
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => [...prev, 'Unexpected error. Please try again later']);
    }
  };

  // 208 px
  return (
    <div className="p-5 sm:p-10 text-complementary bg-[rgba(255,255,255,0.4)] mb-4">
      {/* Application Status */}
      <div className="flex-wrap gap-y-2 flex flex-row justify-between items-center">
        <p
          className={`
                font-bold py-1 px-6 rounded-full
                ${
                  currentApplicant.status === 'Accepted'
                    ? 'bg-[rgb(242,253,226)] text-[rgb(27,111,19)]'
                    : ''
                }
                ${
                  currentApplicant.status === 'Rejected'
                    ? 'bg-[rgb(255,233,218)] text-[rgb(122,15,39)]'
                    : ''
                }
                ${
                  currentApplicant.status === 'In Review'
                    ? 'bg-[rgb(213,244,255)] text-[rgb(9,45,122)]'
                    : ''
                }
              `}
        >
          {currentApplicant.status}
        </p>

        <div className="text-sm flex-wrap gap-y-2 flex flex-row justify-between items-start gap-x-3">
          <button
            className="rounded-full bg-transparent text-[rgba(66,184,187,1)] border-2 border-solid border-[rgba(66,184,187,1)] font-bold py-2 px-8 hover:border-red-500 hover:text-white hover:bg-red-500 transition"
            // onClick={() => onAcceptReject('Rejected', applicationNotesRef.current.value)}
          >
            REJECT
          </button>
          <button
            className="rounded-full bg-[rgba(66,184,187,1)] text-white border-2 border-solid border-[rgba(66,184,187,1)] font-bold py-2 px-8 hover:border-green-500 hover:bg-green-500 transition"
            // onClick={() => onAcceptReject('Accepted', applicationNotesRef.current.value)}
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
              v={currentApplicant.user.firstName + ' ' + currentApplicant.user.lastName}
              locked={true}
              canUnlock={organizer.permissions.includes('super_admin')}
            />
            <BasicInfo k="Major" v={currentApplicant.major} />
            <BasicInfo k="Level of Study" v={currentApplicant.studyLevel} />
          </div>

          <div className="flex flex-col basis-0 flex-grow">
            <BasicInfo
              k="School"
              v={currentApplicant.university ?? currentApplicant.universityManual}
              locked={true}
              canUnlock={organizer.permissions.includes('super_admin')}
            />
            <BasicInfo k="Software Experience" v={currentApplicant.softwareExperience} />
            {/* this should PROBABLY be currentUser.hackathonNumber, but I think the registration interface is populated incorrectly */}
            <BasicInfo k="Hackathons Attended" v={`${currentApplicant.hackathonExperience}`} />
          </div>
        </div>

        {/* Application Score */}
        <div className="flex flex-col items-center sm:w-2/5 text-black">
          <p className="font-bold text-xl text-black">Application Score</p>

          <p className="text-8xl font-dmSans">
            {currentApplicant.applicationScore.acceptCount -
              currentApplicant.applicationScore.rejectCount}
          </p>

          <p className="italic text-gray-600">
            <span className="text-green-500">
              {currentApplicant.applicationScore.acceptCount} accepted
            </span>{' '}
            /{' '}
            <span className="text-red-500">
              {currentApplicant.applicationScore.rejectCount} rejected
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
          v={currentApplicant.whyAttend}
        />
        <FRQInfo
          k={'How many hackathons have you submitted to and what did you learn from them?'}
          v={currentApplicant.hackathonNumber}
        />
        <FRQInfo
          k={
            "If you haven't been to a hackathon, what do you hope to learn from HackUTD Ripple Effect?"
          }
          v={currentApplicant.hackathonFirstTimer}
        />
        <FRQInfo
          k={'What are you looking forward to at HackUTD Ripple Effect?'}
          v={currentApplicant.lookingForward}
        />
      </div>
    </div>
  );
}
