import React, { useContext } from 'react';
import oceanBorder from '../../public/assets/ocean-border.png';
import styles from './HomeAboutText.module.css';
import { SectionReferenceContext } from '@/lib/context/section';

const HomeAboutText = () => {
  const fish1HoverStyle = {
    animation: 'moveLeft 100s linear infinite',
  };

  const fish2HoverStyle = {
    animation: 'moveRight 100s linear infinite',
  };

  const { aboutRef } = useContext(SectionReferenceContext);

  return (
    <div
      ref={aboutRef}
      className="relative py-12 flex flex-col items-center justify-center font-jua"
      style={{
        background: '#54DDE8',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      id="what-is-hackutd"
    >
      <style>
        {`
          @keyframes moveLeft {
            0% { transform: translate(0, 0) rotate(0deg); }
            13% { transform: translate(-25vw, -6vw) rotate(-20deg); }
            25% { transform: translate(-48vw, -6vw) rotate(-90deg); }
            38% { transform: translate(-55vw, 5vw) rotate(-120deg); }
            50% { transform: translate(-48vw, 13vw) rotate(-180deg); }
            63% { transform: translate(-25vw, 17vw) rotate(-210deg); }
            75% { transform: translate(-4vw, 16vw) rotate(-270deg); }
            88% { transform: translate(3vw, 5vw) rotate(-300deg); }
            100% { transform: translate(0, 0) rotate(-360deg); }
          }

          @keyframes moveRight {
            0% { transform: translate(0, 0) rotate(-180deg); }
            13% { transform: translate(25vw, 6vw) rotate(-210deg); }
            25% { transform: translate(50vw, 0) rotate(-270deg); }
            38% { transform: translate(55vw, -6vw) rotate(-300deg); }
            50% { transform: translate(50vw, -16vw) rotate(-360deg); }
            63% { transform: translate(15vw, -20vw) rotate(-380deg); }
            75% { transform: translate(5vw, -10vw) rotate(-450deg); }
            88% { transform: translate(-2vw, -5vw) rotate(-480deg); }
            100% { transform: translate(0, 0) rotate(-510deg); }
          }

        `}
      </style>
      <h1 className="text-5xl font-bold mb-3 text-center relative font-jua z-10  text-[#F7CE79] text-stroke">
        What is HackUTD?
      </h1>
      <div className="relative w-full flex justify-center items-center z-10">
        <p className="text-xl text-center text-[#616161] max-w-2xl mb-16 font-fredoka relative z-10">
          HackUTD, the largest university hackathon in Texas, is a weekend-long event where students
          build apps, hardware, and more. HackUTD provides a venue for self-expression and
          creativity through technology. People with varying technical backgrounds from universities
          all over the US come together, form teams around a problem or idea, and collaboratively
          build a unique solution from scratch. Whether you&apos;re a frequent hackathon attendee or
          just getting started, we&apos;d love to see what you can make!
        </p>
        <div className="absolute inset-0 z-9">
          <img
            src="/assets/fish.png"
            alt="Fish"
            className="absolute hidden md:block"
            style={{
              top: '-10vw',
              right: '12vw',
              width: '15vw',
              height: '15vw',
              ...fish1HoverStyle,
            }}
          />
          <img
            src="/assets/fish.png"
            alt="Fish"
            className="absolute transform rotate-180 hidden md:block"
            style={{
              bottom: '-5vw',
              left: '13vw',
              width: '15vw',
              height: '15vw',
              ...fish2HoverStyle,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeAboutText;
