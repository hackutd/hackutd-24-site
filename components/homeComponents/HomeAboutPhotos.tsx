import React from 'react';
import birds from '../../public/assets/birds.png';

const HomeAboutPhotos = () => {
  const cloudStyle = {
    transition: 'transform 0.3s ease-in-out',
  };

  const balloonHoverStyle = {
    animation: 'moveUpDown 2s infinite alternate',
  };

  return (
    <div className="relative flex flex-col items-center justify-center font-jua mt-20">
      <style>
        {`
          @keyframes moveUpDown {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
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
      <div
        className="relative flex flex-col md:flex-row items-center mb-5 font-fredoka z-10 space-y-8 md:space-y-0 md:space-x-15 mt-10"
        style={{
          backgroundImage: `url(${birds.src})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex justify-center items-center" style={balloonHoverStyle}>
          <img src="/assets/frog-balloon.png" alt="Balloon" className="w-80 h-auto object-cover" />
        </div>
        <div className="text-center md:text-left text-[#F7CE79] text-stroke">
          <p className="text-5xl font-bold">1000+ Hackers</p>
          <p className="text-5xl font-bold">24 hours</p>
          <p className="text-5xl font-bold">$50,000 in prizes</p>
          <p className="text-5xl font-bold">200+ projects</p>
        </div>
      </div>
      {/* <div className="relative w-full max-w-3xl h-96 bg-gray-300 flex items-center justify-center z-10">
        <div
          className="absolute left-0 top-[-25%] transform z-50 -ml-40 sm:-ml-60 md:-ml-80"
          style={cloudStyle}
        >
          <img
            src="/assets/cloud.png"
            alt="Cloud Background"
            className="w-32 sm:w-48 md:w-64 cloud-hover"
          />
        </div>
        <div
          className="absolute right-0 top-[-25%] transform z-50 -mr-20 sm:-mr-30 md:-mr-80"
          style={cloudStyle}
        >
          <img
            src="/assets/cloud.png"
            alt="Cloud Background"
            className="w-32 sm:w-48 md:w-64 cloud-hover"
          />
        </div>
        <p className="text-2xl font-bold text-gray-500">hype video</p>
      </div> */}
      <div className="absolute bottom-[-15%] left-[-10%] transform z-50" style={cloudStyle}>
        <img
          src="/assets/cloud.png"
          alt="Cloud Background"
          className="w-32 sm:w-48 md:w-64 cloud-hover"
        />
      </div>

      <div className="absolute bottom-[-20%] right-[-10%] transform z-50" style={cloudStyle}>
        <img
          src="/assets/cloud.png"
          alt="Cloud Background"
          className="w-32 sm:w-48 md:w-64 cloud-hover"
        />
      </div>
    </div>
  );
};

export default HomeAboutPhotos;
