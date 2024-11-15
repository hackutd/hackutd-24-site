import { useMediaQuery } from '@mui/material';
import Image from 'next/image';
import heroDesktop from '../../public/assets/hero-desktop.png';
import heroXl from '../../public/assets/hero-xl.png';
import hero from '../../public/assets/hero.png';
import styles from './index.module.css';

export default function ParkingPage() {
  const isMediumScreen = useMediaQuery('(min-width:768px)'); // Example query
  const isLargeScreen = useMediaQuery('(min-width:1024px)'); // Example query

  return (
    <section
      className={`${styles.container} w-full min-h-screen relative bg-white flex flex-col-reverse md:flex-col`}
    >
      {/* Small screen background */}
      {!isMediumScreen && !isLargeScreen && (
        <Image
          src={hero.src}
          height={hero.height}
          width={hero.width}
          alt="hero.png"
          className="absolute top-0 left-0 w-full h-full z-0"
        />
      )}

      {/* Medium screen background */}
      {isMediumScreen && !isLargeScreen && (
        <Image
          src={heroDesktop.src}
          height={heroDesktop.height}
          width={heroDesktop.width}
          alt="hero-desktop.png"
          className="absolute top-0 left-0 w-full h-full z-0"
        />
      )}

      {/* Large screen background */}
      {isMediumScreen && isLargeScreen && (
        <Image
          src={heroXl.src}
          height={heroXl.height}
          width={heroXl.width}
          alt="hero-xl.png"
          className="absolute top-0 left-0 w-full h-full z-0"
        />
      )}

      <div className="relative z-[1] h-full w-full shrink-0 grow flex justify-center items-center">
        <div className="mx-auto w-full text-center">
          <h1 className="text-6xl font-poppins font-bold text-white md:w-[700px] mx-auto">
            Sorry, parking passes will be coming soon!
          </h1>
        </div>
      </div>
    </section>
  );
}
