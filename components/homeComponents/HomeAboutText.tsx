import React from 'react';
import oceanBorder from '../../public/assets/ocean-border.png';

const HomeAboutText = () => {
  return (
    <div
      className="relative py-12 flex flex-col items-center justify-center font-jua"
      style={{
        background: '#7BEDE4',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className="text-5xl font-bold text-complementaryLight mb-3 text-center relative text-stroke font-jua z-10">
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
            className="absolute"
            style={{ top: '-10vw', right: '12vw', width: '20vw', height: '20vw' }}
          />
          <img
            src="/assets/fish.png"
            alt="Fish"
            className="absolute transform rotate-180"
            style={{ bottom: '-5vw', left: '13vw', width: '20vw', height: '20vw' }}
          />
        </div>
      </div>
      <img
        src={oceanBorder.src}
        alt="OB"
        className="absolute"
        style={{ top: '27.5vh', width: '100%', height: '180%', zIndex: '8' }}
      />
      <style jsx>{`
        @media (max-width: 1024px) {
          img[alt='Fish']:first-child {
            top: -10vw !important;
            right: 5vw !important;
          }
          img[alt='Fish']:nth-child(2) {
            bottom: 0vw !important;
            left: 5vw !important;
          }
        }
        @media (max-width: 768px) {
          img[alt='Fish']:first-child {
            top: -25vw !important;
            right: 0vw !important;
          }
          img[alt='Fish']:nth-child(2) {
            bottom: 0vw !important;
            left: 0vw !important;
          }
        }
        @media (max-width: 480px) {
          img[alt='Fish']:first-child {
            top: -25vw !important;
            right: 0vw !important;
          }
          img[alt='Fish']:nth-child(2) {
            bottom: 0vw !important;
            left: 0vw !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomeAboutText;
