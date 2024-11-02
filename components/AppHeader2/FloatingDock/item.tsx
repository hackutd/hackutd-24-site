import { motion, useSpring, useTransform } from 'framer-motion';
import { PropsWithChildren } from 'react';

type Props = {
  className?: string;

  originalHeight: number;
  originalWidth: number;

  widthScaleFactor: number;
  distanceMagnify: number;
  cursorFromCenter: number;
};

export default function BoxItem(props: PropsWithChildren<Props>) {
  const minWidth = props.originalWidth;
  const maxWidth = props.originalWidth + props.originalWidth * props.widthScaleFactor;

  const cursorFromCenterVal = useTransform(() => props.cursorFromCenter);

  const widthSync = useTransform(
    cursorFromCenterVal,
    [-props.distanceMagnify, 0, props.distanceMagnify],
    [minWidth, maxWidth, minWidth],
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      style={{ width, height: props.originalHeight }}
      className={props.className ?? 'shrink-0 flex justify-center items-center min-h-fit min-w-fit'}
    >
      {props.children}
    </motion.div>
  );
}
