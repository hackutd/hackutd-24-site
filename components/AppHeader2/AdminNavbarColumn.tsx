import { Menu } from '@headlessui/react';

interface AdminNavbarColumnProps {
  sectionTitle: string;
  options: Array<{
    optionName: string;
    onClick: () => void;
  }>;
}

export default function AdminNavbarColumn({ sectionTitle, options }: AdminNavbarColumnProps) {
  return (
    <div className="bg-gray-100 p-3 h-full">
      <h1 className="px-2 mb-5 text-lg text-[#5D5A88] font-medium">{sectionTitle}</h1>
      {options.map((option) => (
        <Menu.Item key={option.optionName}>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-[#5D5A88] text-white' : 'text-[#5D5A88]'
              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              onClick={() => option.onClick()}
            >
              {option.optionName}
            </button>
          )}
        </Menu.Item>
      ))}
    </div>
  );
}
