import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

type NavItemProps = {
  text: string;
  href: string;
  diff: number;
  onClick: () => void;
};

const NavItem = ({ text, href, diff, onClick }: NavItemProps) => {
  const minWidth = 40;
  const maxWidth = 120;
  const distanceMagnify = 140;

  const diffMotionValue = useMotionValue(diff);

  const widthSync = useTransform(
    diffMotionValue,
    [-distanceMagnify, 0, distanceMagnify],
    [minWidth, maxWidth, minWidth],
  );

  const scaleSync = useTransform(
    diffMotionValue,
    [-distanceMagnify, 0, distanceMagnify],
    [1, 1.3, 1], // Adjust these values to control the scale effect
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const scale = useSpring(scaleSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  // Update the motion value whenever the diff changes
  diffMotionValue.set(diff);

  return (
    <motion.div style={{ width, scale }} className="shrink-0">
      <button onClick={onClick} className="p-2 text-[#40B7BA] cursor-pointer">
        {text}
      </button>
    </motion.div>
  );
};

export default NavItem;
