import React, { useContext, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import Image from 'next/image';
import MLH_Sticker from '../../public/assets/mlh-2025.png';
import HackUTDTitle from '../../public/assets/HackUTD 2024 Title.png';
import DuckMoving from '../../public/assets/duck-moving.gif';
import MascotMoving from '../../public/assets/mascot-moving.gif';
import styles from './HomeHero2.module.css';
import { SectionReferenceContext } from '@/lib/context/section';
import SlingshotSimulation from './SlingshotSimulation'; // Import Slingshot component

// Preloader Component (unchanged)
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

    gsap.set([ripple1Ref.current, ripple2Ref.current, ripple3Ref.current], {
      scale: 0,
      opacity: 0,
    });

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

    const splitText = new SplitType(textRef.current.children, { types: 'words,chars' });
    tl.fromTo(
      splitText.chars.slice(0, 12),
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
    )
      .to({}, { duration: 1 })
      .fromTo(
        splitText.chars.slice(13),
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
      );

    createBubbles();

    tl.to(preloaderRef.current, {
      opacity: 0,
      duration: 1,
      delay: 2,
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

  const createBubbles = () => {
    const bubbleContainer = bubbleContainerRef.current;
    const totalBubbles = 30;

    for (let i = 0; i < totalBubbles; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');

      const size = Math.random() * 20 + 10;
      const left = Math.random() * 100;

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${left}%`;
      bubble.style.bottom = '-50px';
      bubble.style.position = 'absolute';
      bubble.style.borderRadius = '50%';
      bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';

      bubbleContainer.appendChild(bubble);

      gsap.to(bubble, {
        y: `-${window.innerHeight + 50}px`,
        x: `random(-50, 50)`,
        opacity: 0,
        duration: gsap.utils.random(4, 8),
        ease: 'power1.out',
        repeat: -1,
        delay: gsap.utils.random(0, 4),
        onRepeat: () => {
          gsap.set(bubble, {
            y: '100%',
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
      style={{ background: 'linear-gradient(to bottom, #A1F7F1, #54DDE8)' }}
    >
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

      <div
        ref={bubbleContainerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      ></div>

      <div ref={textRef} className="text-center relative z-10">
        <h2 className="font-fredoka text-white text-4xl font-bold mb-4 drop-shadow-lg">
          Start a ripple,
        </h2>
        <h2 className="font-fredoka text-white text-4xl font-bold drop-shadow-lg">
          shape the future
        </h2>
      </div>
    </div>
  );
}

// Hero Section
export default function HomeHero2() {
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [showSlingshot, setShowSlingshot] = useState(false); // Track if the slingshot is shown
  const { aboutRef } = useContext(SectionReferenceContext);
  const titleRef = useRef(null);
  const duckRef = useRef(null);
  const mascotRef = useRef(null);
  const welcomeTextRef = useRef(null);
  const dateTextRef = useRef(null);
  const slingshotRef = useRef(null); // Ref for slingshot element

  useEffect(() => {
    if (isHeroLoaded) {
      const tl = gsap.timeline({ delay: 0.5 });

      // Animating hero elements on initial load
      tl.fromTo(
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

  // Toggle between showing/hiding the welcome, title, and date when mascot or duck is clicked
  const handleMascotClick = () => {
    const tl = gsap.timeline();

    // If slingshot is showing, hide slingshot first and then bring the text back
    if (showSlingshot) {
      tl.to(slingshotRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: 'power3.inOut',
        onComplete: () => setShowSlingshot(false),
      }).to([welcomeTextRef.current, titleRef.current, dateTextRef.current], {
        opacity: 1,
        y: 0,
        duration: 1.5, // Smooth return of the text
        ease: 'power3.inOut',
      });
    } else {
      // Hide the text and show the slingshot
      tl.to([welcomeTextRef.current, titleRef.current, dateTextRef.current], {
        opacity: 0,
        y: -50,
        duration: 1.5, // Smooth hiding of the text
        ease: 'power3.inOut',
        onComplete: () => setShowSlingshot(true),
      });
    }
  };

  return (
    <>
      <Preloader setIsHeroLoaded={setIsHeroLoaded} />

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
            HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24 • HACKUTD 24
            • HACKUTD 24
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

            {/* Main Hero Section */}
            <div className="w-full flex flex-col gap-2 justify-center items-center h-full">
              {/* Duck image (Click event attached) */}
              <div
                ref={duckRef}
                onClick={handleMascotClick} // Click event added
                className="w-[10rem] absolute top-[20%] md:top-[10%] right-[25%] md:w-[20rem] lg:w-[25rem] mb-4 cursor-pointer"
              >
                <Image
                  src={DuckMoving.src}
                  alt="Duck"
                  layout="responsive"
                  width={DuckMoving.width}
                  height={DuckMoving.height}
                />
              </div>

              {/* Title and Welcome */}
              <div
                className="relative flex flex-col items-center gap-2"
                style={{ paddingTop: '8vh' }}
              >
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

                {/* Date */}
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
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[30%] left-0 lg:left-[2%] lg:bottom-[25%] z-20">
          {/* Mascot image (Click event attached) */}
          <div
            ref={mascotRef}
            onClick={handleMascotClick} // Click event added
            className="w-[10rem] md:w-[20rem] lg:w-[25rem] cursor-pointer"
          >
            <Image
              src={MascotMoving.src}
              alt="Mascot Moving"
              layout="responsive"
              width={MascotMoving.width}
              height={MascotMoving.height}
            />
          </div>
        </div>

        {/* Conditionally render the Slingshot Simulation centered */}
        {showSlingshot && (
          <div
            ref={slingshotRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto"
          >
            <SlingshotSimulation />
          </div>
        )}
      </section>
    </>
  );
}
