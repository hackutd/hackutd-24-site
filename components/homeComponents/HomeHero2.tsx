import clsx from 'clsx';
import { SectionReferenceContext } from '@/lib/context/section';
import Image from 'next/image';
import heroNoLilypads from 'public/assets/hero-no-lilypads.png';
import lilypads from 'public/assets/lilypads.png'; // Importing the lily pads image
import { useContext, useState } from 'react';
import HackUTDTitle from '../../public/assets/HackUTD 2024 Title.png';
import DuckMoving from '../../public/assets/duck-moving.gif';
import MascotMoving from '../../public/assets/mascot-moving.gif';
import MLH_Sticker from '../../public/assets/mlh-2025.png';

export default function HomeHero2() {
  const [isShort, setIsShort] = useState(false);
  const { aboutRef } = useContext(SectionReferenceContext);

  return (
    <section
      className={`min-h-screen bg-center relative bg-white flex flex-col-reverse md:flex-col`}
      style={{
        backgroundImage: `url(${lilypads.src}), url(${heroNoLilypads.src})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
      }}
    >
      {/* Under: Hero background */}
      <Image
        src={heroNoLilypads.src}
        height={heroNoLilypads.height}
        width={heroNoLilypads.width}
        alt="hero-no-lilypads.png"
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      {/* Above: Lilypads background */}
      <Image
        src={lilypads.src}
        height={lilypads.height}
        width={lilypads.width}
        alt="lilypads.png"
        className="absolute top-0 left-0 w-full h-full z-[1]"
      />

      {/* Top banner */}
      <div
        className={clsx(
          'absolute top-0 z-[2]',
          'flex sm:hidden justify-center overflow-hidden',
          'w-full h-[1.75rem]',
          'font-dmSans bg-[#40B7BA] text-white text-nowrap',
        )}
      >
        <p className="text-lg">
          HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 •
          HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24
        </p>
      </div>

      <div className={clsx('relative z-[2]', 'flex-grow flex h-full w-full')}>
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
            <div className="w-[10rem] absolute top-[20%] md:top-[10%] right-[25%] md:w-[15rem] lg:w-[20rem] mb-4">
              <Image
                src={DuckMoving.src}
                alt="Duck"
                layout="responsive"
                width={DuckMoving.width}
                height={DuckMoving.height}
              />
            </div>

            <div
              className="relative flex flex-col items-center gap-4"
              style={{ paddingTop: isShort ? '30vh' : '8vh' }}
            >
              {/* Title */}
              <div
                className="w-[80vw] md:w-[60vw] lg:w-[50vw]"
                style={{
                  maxWidth: '800px',
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
                  className="font-montserrat text-[#FFFFFF] text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl font-semibold mt-4"
                  style={{
                    lineHeight: '24.38px',
                    letterSpacing: '0.3em',
                  }}
                >
                  NOV 16 - 17
                </p>
              )}

              {/* {!isShort && (
                <div className="mt-4">
                  <Link href="/register">
                    <div className="rounded-[30px] text-white bg-[#F7CE79] font-jua md:py-2 px-3 text-xl lg:py-4 px-8 text-3xl hover:bg-[#f6b42b] duration-300">
                      Apply
                    </div>
                  </Link>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[20%] left-0 lg:left-[2%] lg:bottom-[25%] z-20">
        <div className="w-[10rem] md:w-[15rem] lg:w-[20rem]">
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
