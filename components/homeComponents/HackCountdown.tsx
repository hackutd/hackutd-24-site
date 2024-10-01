import React, { useEffect, useState, useRef } from 'react';
import { config } from '../../hackportal.config';
import styles from './HackCountdown.module.css';
import gsap from 'gsap';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 20,
    hours: 22,
    minutes: 56,
  });

  const countdownRef = useRef(null); // Reference to countdown container
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

      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger GSAP animations when countdown is in view
          const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } });
          tl.fromTo('.countdown-title', { opacity: 0, y: -50 }, { opacity: 1, y: 0, stagger: 0.2 })
            .fromTo('.countdown-box', { scale: 0 }, { scale: 1, stagger: 0.1 }, '-=0.5')
            .fromTo('.cloud', { x: -200, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5 });
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });
    if (countdownRef.current) {
      observer.observe(countdownRef.current);
    }

    return () => {
      if (countdownRef.current) {
        observer.unobserve(countdownRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Hover effect for cloud
    gsap.fromTo(
      '.cloud',
      { scale: 1 },
      {
        scale: 1.1,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: 'power1.inOut',
      },
    );
  }, []);

  const renderTimeBox = (value, label) => {
    const digits = value.toString().padStart(2, '0').split('');
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="flex space-x-1 p-2 rounded-md">
          {digits.map((digit, index) => (
            <div
              key={index}
              className={`font-fredoka bg-white rounded-md flex items-center justify-center ${styles['countdown-box']} countdown-box`}
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
        ref={countdownRef} // Apply the ref to the countdown container
        className="relative min-h-screen flex flex-col items-center justify-center font-jua"
        style={{ position: 'relative', minHeight: '100vh' }}
      >
        <div className="relative flex justify-center items-center w-full " style={cloudHoverStyle}>
          <div
            className="relative w-full flex justify-center items-center"
            style={{ maxWidth: '1000px', height: 'auto' }}
          >
            <img
              src="/assets/bigCloud.png"
              alt="Cloud"
              className={`w-full h-auto ${styles.cloud} cloud`}
            />
            <div className="absolute flex flex-col items-center justify-center w-full h-full p-4 text-center">
              <h1 className="text-6xl md:text-6xl sm:text-md xs:text-small font-bold text-[#F7CE79] text-stroke countdown-title">
                COUNTDOWN
              </h1>
              <div className="flex justify-center mt-2 space-x-2 text-3xl md:text-2xl sm:text-xl xs:text-lg font-poppins text-[#05149C]">
                {renderTimeBox(timeLeft.days, 'DAYS')}
                {renderTimeBox(timeLeft.hours, 'HOURS')}
                {renderTimeBox(timeLeft.minutes, 'MINUTES')}
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
