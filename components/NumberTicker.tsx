import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface NumberTickerProps {
  value: number;
  delay?: number;
}

export default function NumberTicker({ value, delay = 0 }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '0px' });
  useEffect(() => {
    isInView &&
      setTimeout(() => {
        motionValue.set(value);
      }, delay * 1000);
  }, [motionValue, isInView, delay, value]);
  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(Number(latest.toFixed(0)));
        }
      }),
    [springValue],
  );
  return <span className="inline-block tabular-nums text-[#F7CE79] tracking-wider" ref={ref} />;
}
