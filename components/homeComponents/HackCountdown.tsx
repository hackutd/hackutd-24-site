import React, { useEffect, useState } from 'react';
import { config } from '../../hackportal.config';
import styles from './HackCountdown.module.css';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 20,
    hours: 22,
    minutes: 56,
    seconds: 0, // Add seconds to the initial state
  });

  const cloudHoverStyle = {
    animation: 'moveUpDown 2s infinite alternate',
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const eventDate = new Date(config.targetDate); // Using the date from config
      const timeDifference = eventDate.getTime() - now.getTime();

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000); // Calculate the seconds

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const renderTimeBox = (value, label) => {
    const digits = value.toString().padStart(2, '0').split('');
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="flex space-x-1 p-2 rounded-md">
          {digits.map((digit, index) => (
            <div
              key={index}
              className={`font-fredoka bg-white rounded-md flex items-center justify-center ${styles['countdown-box']}`}
            >
              {digit}
            </div>
          ))}
        </div>
        <span className={`text-lg md:text-md sm:text-sm xs:text-xs ${styles['countdown-label']}`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <>
      <div
        className="relative min-h-screen flex flex-col items-center justify-center font-jua"
        style={{ position: 'relative', minHeight: '150vh' }}
      >
        <div className="relative flex justify-center items-center w-full " style={cloudHoverStyle}>
          <div
            className="relative w-full flex justify-center items-center"
            style={{ maxWidth: '1000px', height: 'auto' }}
          >
            <img src="/assets/cloud.png" alt="Cloud" className={`w-full h-auto ${styles.cloud} `} />
            <div className="absolute flex flex-col items-center justify-center w-full h-full p-4 text-center">
              <h1 className="text-6xl md:text-6xl sm:text-md xs:text-small font-bold text-[#F7CE79] text-stroke">
                COUNTDOWN
              </h1>
              <div className="flex justify-center mt-2 space-x-2 text-3xl md:text-2xl sm:text-xl xs:text-lg font-poppins text-[#05149C]">
                {renderTimeBox(timeLeft.days, 'DAYS')}
                {renderTimeBox(timeLeft.hours, 'HOURS')}
                {renderTimeBox(timeLeft.minutes, 'MINUTES')}
                {renderTimeBox(timeLeft.seconds, 'SECONDS')} {/* Render the seconds */}
              </div>
              {/* <p className="mt-4 text-lg md:text-md sm:text-sm xs:text-xs text-[#05149C] font-poppins">
                We&apos;ll let you know when we are hatching
              </p>
              <button
                className={`mt-4 bg-[#F7CE79] text-white py-2 px-4 rounded-lg w-40 md:w-32 sm:w-28 xs:w-24 font-poppins opacity-90 text-base md:text-sm sm:text-xs ${styles['notify-button']}`}
              >
                Notify Me
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Countdown;
