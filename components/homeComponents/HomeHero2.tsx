import { useContext, useState } from 'react';
import Image from 'next/image';
import MLH_Sticker from '../../public/assets/mlh-2025.png';
import HackUTDTitle from '../../public/assets/HackUTD 2024 Title.png';
import DuckMoving from '../../public/assets/duck-moving.gif';
import MascotMoving from '../../public/assets/mascot-moving.gif';
import styles from './HomeHero2.module.css';
import { SectionReferenceContext } from '@/lib/context/section';

export default function HomeHero2() {
  const [isShort, setIsShort] = useState(false);
  const { aboutRef } = useContext(SectionReferenceContext);
  return (
    <section
      className={`bg-[url('/assets/hero.png')] md:bg-[url('/assets/hero-desktop.png')] lg:bg-[url('/assets/hero-xl.png')] ${styles.container} min-h-screen bg-center relative bg-white flex flex-col-reverse md:flex-col`}
      style={{
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
      }}
    >
      {/* Top banner */}
      <div className="font-dmSans w-full flex justify-center bg-[#40B7BA] text-white h-[1.75rem] text-nowrap overflow-hidden sm:hidden absolute top-0">
        <p className="text-lg">
          HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 •
          HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24
        </p>
      </div>

      <div className="flex-grow flex h-full w-full relative">
        <div className="relative z-10 shrink-0 w-full flex">
          {/* MLH sticker */}
          <div className="absolute top-[1.75rem] sm:top-0 right-4 z-20 transition-all">
            <Image
              src={MLH_Sticker.src}
              height={MLH_Sticker.height}
              width={MLH_Sticker.width / 7}
              alt="MLH sticker"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Big welcome */}
          <div className="w-full flex flex-col gap-2 justify-center items-center h-full">
            {/* Duck image */}
            <div className="w-[10rem] absolute top-[20%] md:top-[10%] right-[25%] md:w-[20rem] lg:w-[25rem] mb-4">
              <Image
                src={DuckMoving.src}
                alt="Duck"
                layout="responsive"
                width={DuckMoving.width}
                height={DuckMoving.height}
              />
            </div>

            {/* Container to manage the positioning of welcome, title, and date */}
            <div
              className="relative flex flex-col items-center gap-2"
              style={{ paddingTop: isShort ? '30vh' : '0' }}
            >
              {!isShort && (
                <p
                  className="font-montserrat mx-auto lg:ml-[5rem] text-[#FFFFFF] text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl font-semibold"
                  style={{
                    lineHeight: '24.38px',
                    letterSpacing: '0.3em',
                  }}
                >
                  WELCOME TO
                </p>
              )}

              {/* Title */}
              <div
                className="w-[60vw] md:w-[40vw] lg:w-[30vw]"
                style={{
                  maxWidth: '600px',
                }}
              >
                <Image
                  src={HackUTDTitle.src}
                  alt="HackUTD Title"
                  layout="responsive"
                  width={HackUTDTitle.width}
                  height={HackUTDTitle.height}
                />
              </div>

              {!isShort && (
                <p
                  className="font-montserrat text-[#FFFFFF] text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl font-semibold"
                  style={{
                    lineHeight: '24.38px',
                    letterSpacing: '0.3em',
                  }}
                >
                  NOV 16 - 17
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[35%] left-0 lg:left-[5%] lg:bottom-[30%] z-20">
        <div className="w-[10rem] md:w-[20rem] lg:w-[25rem]">
          <Image
            src={MascotMoving.src}
            alt="Mascot Moving"
            layout="responsive"
            width={MascotMoving.width}
            height={MascotMoving.height}
          />
        </div>
      </div>

      {/* Learn More Text and Arrow */}
      <button
        onClick={() => {
          const offset = -180; // Adjust this value as needed to control the scroll offset
          const elementPosition = aboutRef.current?.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset + offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }}
      >
        <div className="absolute bottom-5 w-full flex flex-col items-center z-20">
          <p className="font-montserrat text-white text-lg md:text-xl">Learn More</p>
          <div className="animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="white"
              className="w-6 h-6 md:w-8 md:h-8 mt-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
    </section>
  );
}
