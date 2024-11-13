import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface AdminStatsCardProps {
  title: string;
  value: number | string;
  icon: any;
}

export default function AdminStatsCard({ title, value, icon }: AdminStatsCardProps) {
  return (
    <div className="border-2 p-5 flex flex-col rounded-xl bg-[rgba(255,255,255,0.6)]">
      <div className="flex items-center gap-x-6">
        {icon}
        <div className="flex flex-col">
          <h1 className="text-xl">{title}</h1>
          <h1 className="text-3xl font-bold">{value}</h1>
        </div>
      </div>
    </div>
  );
}
