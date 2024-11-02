import React, { useState, useEffect } from 'react';
import birds from '../../public/assets/birds.png';
import NumberTicker from '../NumberTicker';

const HomeAboutPhotos = () => {
  const [windowScroll, setWindowScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setWindowScroll(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const cloudStyle = {
    transition: 'transform 0.3s ease-out',
  };

  const cloudLeftScroll = {
    transform: `translateX(${windowScroll * (window.innerWidth <= 660 ? 0.2 : 0.42)}px)`,
  };

  const cloudRightScroll = {
    transform: `translateX(${-1 * windowScroll * (window.innerWidth <= 660 ? 0.2 : 0.42)}px)`,
  };

  const balloonHoverStyle = {
    animation: 'balloonBob 1.5s infinite alternate ease-in-out',
  };

  return (
    <div className="relative flex flex-col items-center justify-center font-jua">
      <style>
        {`
          @keyframes balloonBob {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-30px); /* Increased bobbing effect */
            }
          }

          .cloud-hover {
            animation: float 6s ease-in-out infinite;
          }

          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0px);
            }
          }
        `}
      </style>

      {/* About Section */}
      <div
        className="relative flex flex-col-reverse lg:flex-row items-center mb-5 font-fredoka z-10 space-y-8 lg:space-y-0 lg:space-x-15 mt-10"
        style={{
          backgroundImage: `url(${birds.src})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '75vh',
        }}
      >
        <div
          className="order-2 lg:order-1 flex justify-center items-center z-20 lg:justify-end lg:mr-8"
          style={balloonHoverStyle}
        >
          <img src="/assets/frog-balloon.png" alt="Balloon" className="w-80 h-auto object-cover" />
        </div>
        <div className="w-[600px] order-1 lg:order-2 text-center lg:text-left text-[#F7CE79] text-stroke lg:ml-8">
          <p className="text-5xl font-bold stroke-rose-700">
            <NumberTicker value={1000} />+ Hackers
          </p>
          <p className="text-5xl font-bold">
            <NumberTicker value={24} /> hours
          </p>
          <p className="text-5xl font-bold">
            $<NumberTicker value={50000} /> in prizes
          </p>
          <p className="text-5xl font-bold">
            <NumberTicker value={200} />+ projects
          </p>
        </div>
      </div>

      {/* Left Cloud */}
      <div
        className="absolute top-[70%] lg:top-[15%] left-[5%] lg:left-[30%] transform -translate-x-[30%] z-50"
        style={{ ...cloudStyle, ...cloudLeftScroll }}
      >
        <img
          src="/assets/cloud.png"
          alt="Cloud Background"
          className="w-[40rem] md:w-[45rem] lg:w-[50rem] cloud-hover"
        />
      </div>

      {/* Right Cloud */}
      <div
        className="absolute top-[70%] lg:top-[15%] right-[5%] lg:right-[30%] transform translate-x-[30%] z-50"
        style={{ ...cloudStyle, ...cloudRightScroll }}
      >
        <img
          src="/assets/cloud.png"
          alt="Cloud Background"
          className="w-[40rem] md:w-[45rem] lg:w-[50rem] cloud-hover"
        />
      </div>
    </div>
  );
};

export default HomeAboutPhotos;
