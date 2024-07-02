import Checkbox from '@mui/material/Checkbox';
import { blue } from '@mui/material/colors';

interface FilterComponentProps {
  title: string;
  checked: boolean;
  onCheck: () => void;
}

export default function FilterComponent({ title, checked, onCheck }: FilterComponentProps) {
  const CustomCheckbox = () => (
    <Checkbox
      checked={checked}
      onChange={() => {
        onCheck();
      }}
      color="default"
      sx={{
        color: blue[400],
        ':checked': {
          color: blue[600],
        },
      }}
    />
  );

  return (
    <div className="flex items-center text-sm md:text-base">
      <CustomCheckbox />
      <h4>{title}</h4>
    </div>
  );
}
