export interface ScanTypeProps {
  /**
   * Raw JSON of the scan.
   */
  data: object;
  /**
   * Name of the scan.
   */
  name: string;
  /**
   * Click callback.
   */
  onClick: () => void;
}
export default function ScanType({ name, onClick }: ScanTypeProps) {
  return (
    <div
      className="hidden md:block md:p-4 p-2 cursor-pointer m-3 bg-[#40B7BA] rounded-lg text-white hover:bg-white hover:text-[#40B7BA] transition duration-300 ease-in-out h-min"
      onClick={onClick}
    >
      <div className="text-center md:text-lg font-bold">{name}</div>
    </div>
  );
}
