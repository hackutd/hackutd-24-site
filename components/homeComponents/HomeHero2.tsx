import React, { useContext, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import Image from 'next/image';
import Link from 'next/link';
import MLH_Sticker from '../../public/assets/mlh-2025.png';
import HackUTDTitle from '../../public/assets/HackUTD 2024 Title.png';
import DuckMoving from '../../public/assets/duck-moving.gif';
import MascotMoving from '../../public/assets/mascot-moving.gif';
import styles from './HomeHero2.module.css';
import { SectionReferenceContext } from '@/lib/context/section';

// Preloader Component with Enhanced Pond Effects and Bubbles
function Preloader({ setIsHeroLoaded }) {
  const preloaderRef = useRef(null);
  const ripple1Ref = useRef(null);
  const ripple2Ref = useRef(null);
  const ripple3Ref = useRef(null);
  const textRef = useRef(null);
  const bubbleContainerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setIsHeroLoaded(true),
    });

    // Set initial state for ripples
    gsap.set([ripple1Ref.current, ripple2Ref.current, ripple3Ref.current], {
      scale: 0,
      opacity: 0,
    });

    // Animate the ripples with different timings and delays
    tl.to(ripple1Ref.current, {
      scale: 1.8,
      opacity: 0.6,
      duration: 2.5,
      ease: 'sine.out',
      repeat: -1,
      repeatDelay: 0.7,
    });

    tl.to(
      ripple2Ref.current,
      {
        scale: 1.6,
        opacity: 0.4,
        duration: 2.3,
        ease: 'sine.out',
        repeat: -1,
        repeatDelay: 0.9,
      },
      '-=2.2',
    );

    tl.to(
      ripple3Ref.current,
      {
        scale: 2.0,
        opacity: 0.5,
        duration: 3,
        ease: 'sine.out',
        repeat: -1,
        repeatDelay: 1.1,
      },
      '-=2.4',
    );

    // Text animation
    const splitText = new SplitType(textRef.current.children, { types: 'words,chars' });
    tl.fromTo(
      splitText.chars,
      {
        opacity: 0,
        y: 50,
        rotationX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.02,
        duration: 0.5,
        ease: 'power3.out',
      },
      0.5,
    );

    // Bubble animation
    createBubbles();

    // Fade out preloader after the animation, with 1 extra second
    tl.to(preloaderRef.current, {
      opacity: 0,
      duration: 1,
      delay: 2, // Increased delay by 1 second
      onComplete: () => {
        if (preloaderRef.current) {
          preloaderRef.current.style.display = 'none';
        }
      },
    });

    return () => {
      tl.kill();
      splitText.revert();
    };
  }, [setIsHeroLoaded]);

  // Function to create bubbles and animate them
  const createBubbles = () => {
    const bubbleContainer = bubbleContainerRef.current;
    const totalBubbles = 30; // Number of bubbles to create

    for (let i = 0; i < totalBubbles; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');

      // Randomize size and starting position
      const size = Math.random() * 20 + 10; // Between 10px and 30px
      const left = Math.random() * 100; // Random left position

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${left}%`;
      bubble.style.bottom = '-50px'; // Start off-screen
      bubble.style.position = 'absolute';
      bubble.style.borderRadius = '50%';
      bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';

      bubbleContainer.appendChild(bubble);

      // Animate bubble
      gsap.to(bubble, {
        y: `-${window.innerHeight + 50}px`, // Move upwards off the screen
        x: `random(-50, 50)`, // Slight horizontal variation
        opacity: 0,
        duration: gsap.utils.random(4, 8), // Random float duration
        ease: 'power1.out',
        repeat: -1, // Infinite repeat
        delay: gsap.utils.random(0, 4), // Random start delay
        onRepeat: () => {
          gsap.set(bubble, {
            y: '100%', // Reset to bottom
            x: 0,
            opacity: 0.8,
          });
        },
      });
    }
  };

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #66ccff, #3399ff)' }}
    >
      {/* Multiple ripple layers */}
      <div
        ref={ripple1Ref}
        className="absolute w-[150%] h-[150%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      <div
        ref={ripple2Ref}
        className="absolute w-[120%] h-[120%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      <div
        ref={ripple3Ref}
        className="absolute w-[180%] h-[180%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
        }}
      />

      {/* Floating Bubbles */}
      <div
        ref={bubbleContainerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      ></div>

      {/* Preloader text */}
      <div ref={textRef} className="text-center relative z-10">
        <h2 className="font-fredoka text-white text-4xl font-bold mb-4 drop-shadow-lg">
          To Bring Forth
        </h2>
        <h2 className="font-fredoka text-white text-4xl font-bold drop-shadow-lg">
          A Ripple of Change
        </h2>
      </div>
    </div>
  );
}
// Hero Section
export default function HomeHero2() {
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [isShort, setIsShort] = useState(false);
  const { aboutRef } = useContext(SectionReferenceContext);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const duckRef = useRef(null);
  const mascotRef = useRef(null);
  const welcomeTextRef = useRef(null);
  const dateTextRef = useRef(null);

  useEffect(() => {
    if (isHeroLoaded) {
      const tl = gsap.timeline({ delay: 0.5 });

      // Animate hero section's opacity and set visibility
      gsap.set(heroRef.current, { opacity: 0, visibility: 'hidden' });

      tl.to(heroRef.current, {
        opacity: 1,
        visibility: 'visible',
        duration: 1,
        ease: 'power2.inOut',
      })
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 50, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power4.out' },
        )
        .fromTo(
          duckRef.current,
          { opacity: 0, x: 100, scale: 0.8 },
          { opacity: 1, x: 0, scale: 1, duration: 1.5, ease: 'power4.out' },
          '-=1',
        )
        .fromTo(
          mascotRef.current,
          { opacity: 0, y: 100, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power4.out' },
          '-=1.2',
        );

      // Animate welcome text
      if (welcomeTextRef.current) {
        const welcomeSplit = new SplitType(welcomeTextRef.current, { types: 'words,chars' });
        tl.fromTo(
          welcomeSplit.chars,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.02, duration: 0.5, ease: 'power3.out' },
          '-=1',
        );
      }

      // Animate date text
      if (dateTextRef.current) {
        const dateSplit = new SplitType(dateTextRef.current, { types: 'words,chars' });
        tl.fromTo(
          dateSplit.chars,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.02, duration: 0.5, ease: 'power3.out' },
          '-=0.5',
        );
      }
    }
  }, [isHeroLoaded]);

  return (
    <>
      <Preloader setIsHeroLoaded={setIsHeroLoaded} />

      <section
        ref={heroRef}
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
            HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24
            • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24
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
              <div
                ref={duckRef}
                className="w-[10rem] absolute top-[20%] md:top-[10%] right-[25%] md:w-[20rem] lg:w-[25rem] mb-4"
              >
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
                style={{ paddingTop: isShort ? '30vh' : '8vh' }}
              >
                {!isShort && (
                  <p
                    ref={welcomeTextRef}
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
                  ref={titleRef}
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
                    ref={dateTextRef}
                    className="font-montserrat text-[#FFFFFF] text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl font-semibold"
                    style={{
                      lineHeight: '24.38px',
                      letterSpacing: '0.3em',
                    }}
                  >
                    NOV 16 - 17
                  </p>
                )}

                {!isShort && (
                  <div>
                    <Link href="/register">
                      <div className="py-2 px-4 rounded-[30px] text-white bg-[#F7CE79] font-jua text-xl">
                        Apply
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[30%] left-0 lg:left-[2%] lg:bottom-[25%] z-20">
          <div ref={mascotRef} className="w-[10rem] md:w-[20rem] lg:w-[25rem]">
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
            const offset = -180;
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
    </>
  );
}
