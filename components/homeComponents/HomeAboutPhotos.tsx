import React, { useState, useEffect } from 'react';
import birds from '../../public/assets/birds.png';

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
    transition: 'transform 0.01s ease-out',
  };

  const cloudLeftScroll = {
    transform: `translateX(${windowScroll * 0.6}px)`,
  };

  const cloudRightScroll = {
    transform: `translateX(${-1 * windowScroll * 0.6}px)`,
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
        <div className="order-1 lg:order-2 text-center lg:text-left text-[#F7CE79] text-stroke lg:ml-8">
          <p className="text-5xl font-bold stroke-rose-700">1000+ Hackers</p>
          <p className="text-5xl font-bold">24 hours</p>
          <p className="text-5xl font-bold">$50,000 in prizes</p>
          <p className="text-5xl font-bold">200+ projects</p>
        </div>
      </div>

      {/* Left Cloud */}
      <div
        className="absolute top-[50%] left-[20%] transform -translate-x-[50%] z-50"
        style={{ ...cloudStyle, ...cloudLeftScroll }}
      >
        <img
          src="/assets/cloud.png"
          alt="Cloud Background"
          className="w-48 sm:w-64 md:w-72 lg:w-80 cloud-hover"
        />
      </div>

      {/* Right Cloud */}
      <div
        className="absolute top-[50%] right-[20%] transform translate-x-[50%] z-50"
        style={{ ...cloudStyle, ...cloudRightScroll }}
      >
        <img
          src="/assets/cloud.png"
          alt="Cloud Background"
          className="w-48 sm:w-64 md:w-72 lg:w-80 cloud-hover"
        />
      </div>
    </div>
  );
};

export default HomeAboutPhotos;
