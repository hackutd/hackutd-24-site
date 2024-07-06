import { useEffect, useMemo, useRef, useState } from 'react';
import { Container, ISourceOptions, RotateDirection } from '@tsparticles/engine';
import Particles from './Particles';
import { useParticles } from './Particles/ParticlesProvider';

export default function BackgroundCircles() {
  const { state: particlesState } = useParticles();

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const timeoutSetWindowSize = useRef(-1);

  // tsparticles does not have documentation on size.value unit
  // after experimenting with it, the scaling factor to convert from pixels to size.value is to multiply pixels with 0.5
  const scaleFactor = 0.5;

  const particlesLoaded = (_container?: Container) => {
    return Promise.resolve();
  };

  useEffect(() => {
    const resizeHandler = () => {
      if (timeoutSetWindowSize.current) {
        window.clearTimeout(timeoutSetWindowSize.current);
      }

      timeoutSetWindowSize.current = window.setTimeout(() => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
      }, 200);
    };

    resizeHandler(); // Init
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  const options = useMemo<ISourceOptions>(
    () => ({
      fpsLimit: 120,
      fullScreen: {
        enable: false,
      },
      detectRetina: true,

      particles: {
        // https://github.com/tsparticles/tsparticles/blob/main/markdown/Options/Particles/Rotate.md
        rotate: {
          direction: RotateDirection.random,
          value: { min: 90, max: 270 },
          animation: {
            enable: true,
            speed: 2,
          },
        },
        move: {
          direction: 'none',
          enable: true,
          speed: 6,
          outModes: {
            default: 'bounce',
          },
          random: false,
          straight: false,
        },
        number: {
          value: 1,
        },
        opacity: {
          value: 1,
        },
        shape: {
          type: 'image',
          options: {
            image: {
              src: '/assets/circles.svg',
              replaceColor: false,
            },
          },
        },
        size: {
          value: Math.min(
            Math.min(windowWidth, windowHeight) * 0.75 * scaleFactor,
            600 * scaleFactor,
          ),
        },
      },
    }),
    [windowWidth, windowHeight],
  );

  if (particlesState.init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        className={'w-full h-full'}
      />
    );
  }

  return <></>;
}
