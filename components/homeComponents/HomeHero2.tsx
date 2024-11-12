import React, { useContext, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import Image from 'next/image';
import { X } from 'lucide-react';
import MLH_Sticker from '../../public/assets/mlh-2025.png';
import HackUTDTitle from '../../public/assets/HackUTD 2024 Title.png';
import DuckMoving from '../../public/assets/duck-moving.gif';
import MascotMoving from '../../public/assets/mascot-moving.gif';
import { SectionReferenceContext } from '@/lib/context/section';
import LilyPads from 'public/assets/lilypads.png';
import noLPHero from 'public/assets/hero-no-lilypads.png';
import SlingshotSimulation from './SlingshotSimulation';

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

export default function HomeHero2() {
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [showSlingshot, setShowSlingshot] = useState(false);
  const [rockColor, setRockColor] = useState('');
  const { aboutRef } = useContext(SectionReferenceContext);
  const titleRef = useRef(null);
  const duckRef = useRef(null);
  const mascotRef = useRef(null);
  const welcomeTextRef = useRef(null);
  const dateTextRef = useRef(null);
  const applyButtonRef = useRef(null);
  const slingshotRef = useRef(null);
  const lilyPadsRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    if (isHeroLoaded) {
      const tl = gsap.timeline({ delay: 0.5 });

      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 50, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power4.out' },
        );
      }

      if (duckRef.current) {
        tl.fromTo(
          duckRef.current,
          { opacity: 0, x: 100, scale: 0.8 },
          { opacity: 1, x: 0, scale: 1, duration: 1.5, ease: 'power4.out' },
          '-=1',
        );
      }

      if (mascotRef.current) {
        tl.fromTo(
          mascotRef.current,
          { opacity: 0, y: 100, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power4.out' },
          '-=1.2',
        );
      }

      if (welcomeTextRef.current) {
        const welcomeSplit = new SplitType(welcomeTextRef.current, { types: 'words,chars' });
        tl.fromTo(
          welcomeSplit.chars,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.02, duration: 0.5, ease: 'power3.out' },
          '-=1',
        );
      }

      if (dateTextRef.current) {
        const dateSplit = new SplitType(dateTextRef.current, { types: 'words,chars' });
        tl.fromTo(
          dateSplit.chars,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.02, duration: 0.5, ease: 'power3.out' },
          '-=0.5',
        );
      }

      if (applyButtonRef.current) {
        tl.fromTo(
          applyButtonRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' },
          '-=0.5',
        );
      }
    }
  }, [isHeroLoaded]);

  const handleMascotClick = (color) => {
    const tl = gsap.timeline();
    setRockColor(color);

    if (showSlingshot) {
      return;
    }

    if (backgroundRef.current) {
      backgroundRef.current.style.backgroundImage = `url(${noLPHero.src})`;
      backgroundRef.current.style.backgroundSize = 'cover';
      backgroundRef.current.style.backgroundPosition = 'center';
    }

    tl.to(
      [
        welcomeTextRef.current,
        titleRef.current,
        dateTextRef.current,
        applyButtonRef.current,
        duckRef.current,
        mascotRef.current,
        lilyPadsRef.current,
      ].filter(Boolean),
      {
        opacity: 0,
        y: -50,
        duration: 1.5,
        ease: 'power3.inOut',
        onComplete: () => setShowSlingshot(true),
      },
    );
  };

  const handleClose = () => {
    const tl = gsap.timeline();

    if (backgroundRef.current) {
      backgroundRef.current.style.backgroundImage = '';
    }

    tl.to(slingshotRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: 'power3.inOut',
      onComplete: () => setShowSlingshot(false),
    }).to(
      [
        welcomeTextRef.current,
        titleRef.current,
        dateTextRef.current,
        applyButtonRef.current,
        duckRef.current,
        mascotRef.current,
        lilyPadsRef.current,
      ].filter(Boolean),
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.inOut',
      },
    );
  };

  return (
    <>
      <Preloader setIsHeroLoaded={setIsHeroLoaded} />

      <section
        className="min-h-screen bg-center relative bg-white flex flex-col-reverse md:flex-col"
        ref={backgroundRef}
      >
        {!showSlingshot && (
          <div
            ref={lilyPadsRef}
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${LilyPads.src}), url(${noLPHero.src})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}

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
              {/* Duck image */}
              <div
                ref={duckRef}
                onClick={() => handleMascotClick('blue')}
                className="w-[10rem] absolute top-[20%] md:top-[10%] right-[25%] md:w-[15rem] lg:w-[20rem] mb-4 cursor-pointer z-30"
                style={{ cursor: 'pointer', zIndex: '30' }}
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
                {/* Title */}
                <div
                  ref={titleRef}
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

          <div className="absolute bottom-[20%] left-0 lg:left-[2%] lg:bottom-[25%] z-20">
            {/* Mascot image */}
            <div
              ref={mascotRef}
              onClick={() => handleMascotClick('red')}
              className="w-[10rem] md:w-[15rem] lg:w-[20rem] cursor-pointer z-30"
              style={{ cursor: 'pointer', zIndex: '30' }}
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

          {/* Close button for slingshot */}
          {showSlingshot && (
            <button
              onClick={handleClose}
              className="absolute top-12 left-8 z-[60] p-4 rounded-full bg-white/80 transition-opacity duration-200 pointer-events-auto shadow-lg border border-gray-200"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
          )}

          {showSlingshot && (
            <div
              ref={slingshotRef}
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto"
              style={{
                background: `url(${noLPHero.src})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                overflow: 'visible',
              }}
            >
              <SlingshotSimulation />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
