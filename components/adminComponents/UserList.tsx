interface UserListProps {
  users: UserIdentifier[];
  selectedUsers: string[];

  onUserClick: (id: string) => void;
  onUserSelect: (id: string) => void;
}

export default function UserList({
  users,
  selectedUsers,
  onUserClick,
  onUserSelect,
}: UserListProps) {
  const userList = [];

  users.forEach((user, idx) => {
    const bgColor = idx % 2 == 0 ? 'bg-[rgba(227,227,227,0.8)]' : 'bg-[rgba(255,255,255,0.6)]';
    const blur = 'backdrop-blur-lg';

    userList.push(
      <div
        key={user.id}
        className={`
          flex flex-row justify-between px-6
          cursor-pointer hover:bg-[rgb(255,255,255,0.7)] items-center 
          ${bgColor}
          ${blur}
        `}
        onClick={() => onUserClick(user.id)}
      >
        {/*
          Name
          Status
          University
          Major
          Year
        */}

        <div
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

          {/* <div
            className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[70%]"
            onClick={(e) => {
              e.stopPropagation();
              onUserClick(user.id);
            }}
          >
            {`${user.user.firstName} ${user.user.lastName}`}
          </div> */}
        </div>

        <div className="flex items-center justify-center w-1/2 md:w-2/12 h-full py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100%]">
          <span
            className={`
              py-1 px-6 rounded-full 
              ${user.status === 'Accepted' ? 'bg-[rgb(242,253,226)] text-[rgb(27,111,19)]' : ''}
              ${user.status === 'Rejected' ? 'bg-[rgb(255,233,218)] text-[rgb(122,15,39)]' : ''}
              ${user.status === 'In Review' ? 'bg-[rgb(213,244,255)] text-[rgb(9,45,122)]' : ''}
            `}
          >
            {user.status}
          </span>
        </div>

        <div className="hidden md:flex items-center justify-center text-base text-[rgb(19,19,19)] w-4/12 h-full py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100%]">
          {user.university}
        </div>

        <div className="hidden md:flex items-center justify-center text-base text-[rgb(19,19,19)] w-2/12 h-full py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100%]">
          {user.major}
        </div>

        <div className="hidden md:flex items-center justify-center text-base text-[rgb(19,19,19)] w-2/12 h-full py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100%]">
          {user.studyLevel}
        </div>
      </div>,
    );
  });

  return <div className="w-full">{userList}</div>;
}
