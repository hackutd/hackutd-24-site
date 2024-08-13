import { Menu } from '@headlessui/react';

interface AdminNavbarGridProps {
  numCols?: number;
  sectionTitle: string;
  options: Array<{
    optionName: string;
    onClick: () => void;
  }>;
}

export default function AdminNavbarGrid({
  sectionTitle,
  options,
  numCols = 3,
}: AdminNavbarGridProps) {
  return (
    <div className="bg-gray-100 p-3 h-full">
      <h1 className="px-2 mb-5 text-lg text-[#40B7BA] font-medium">{sectionTitle}</h1>
      <div className={`grid grid-cols-${numCols}`}>
        {options.map((option) => (
          <Menu.Item key={option.optionName}>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-[#40B7BA] text-white' : 'text-[#40B7BA]'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={() => option.onClick()}
              >
                {option.optionName}
              </button>
            )}
          </Menu.Item>
        ))}
      </div>
    </div>
  );
}