import React, { useEffect, useState, useRef } from 'react';
import { config } from '../../hackportal.config';
import styles from './HackCountdown.module.css';
import gsap from 'gsap';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 20,
    hours: 22,
    minutes: 56,
    seconds: 0, // Add seconds to the initial state
  });

  const countdownRef = useRef(null); // Reference to countdown container
  const cloudRef = useRef(null); // Reference to cloud
  const countdownTitleRef = useRef(null); // Reference to countdown title

  const cloudHoverStyle = {
    animation: 'moveUpDown 2s infinite alternate',
  };

  // Timer logic for countdown
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

  // GSAP animation and intersection observer
  useEffect(() => {
    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('Countdown in view'); // Debugging statement

          // Trigger GSAP animations when countdown is in view
          const tl = gsap.timeline({
            defaults: { duration: 1, ease: 'power3.out' },
          });
          // Cloud animation first
          tl.fromTo(cloudRef.current, { x: -200, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5 })
            // Countdown title animation next
            .fromTo(
              countdownTitleRef.current,
              { opacity: 0, y: -50 },
              { opacity: 1, y: 0 },
              '+=0.5', // Delay after cloud finishes
            )
            // Timer boxes last
            .fromTo(
              '.countdown-box',
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, stagger: 0.1 },
              '+=0.5', // Delay after title animation finishes
            );

          // Unobserve the element once the animation is triggered
          observer.unobserve(entry.target);
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

  const renderTimeBox = (value, label) => {
    const digits = value.toString().padStart(2, '0').split('');
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="flex space-x-1 p-2 rounded-md">
          {digits.map((digit, index) => (
            <div
              key={index}
              className={`font-fredoka bg-white rounded-md flex items-center justify-center ${styles['countdown-box']} countdown-box`}
              style={{ opacity: 0 }} // Initially hidden
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
        style={{ position: 'relative', minHeight: '150vh' }}
      >
        <div className="relative flex justify-center items-center w-full" style={cloudHoverStyle}>
          <div
            className="relative w-full flex justify-center items-center"
            style={{ height: 'auto' }} // Adjusted cloud width
          >
            <img
              src="/assets/bigCloud.png"
              alt="Cloud"
              ref={cloudRef} // Cloud ref for GSAP animation
              className={`${styles.cloud}`}
              style={{
                width: '800px',
                height: 'auto',
                opacity: 0, // Initially hidden, animated by GSAP
              }}
            />
            <div className="absolute flex flex-col items-center justify-center w-full h-full p-4 text-center">
              <h1
                ref={countdownTitleRef} // Title ref
                className="text-6xl md:text-6xl sm:text-md xs:text-small font-bold text-[#F7CE79] text-stroke countdown-title"
                style={{ opacity: 0 }} // Initially hidden
              >
                COUNTDOWN
              </h1>
              <div className="flex justify-center mt-2 space-x-2 text-3xl md:text-2xl sm:text-xl xs:text-lg font-poppins text-[#05149C]">
                {renderTimeBox(timeLeft.days, 'DAYS')}
                {renderTimeBox(timeLeft.hours, 'HOURS')}
                {renderTimeBox(timeLeft.minutes, 'MINUTES')}
                {renderTimeBox(timeLeft.seconds, 'SECONDS')} {/* Render the seconds */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Countdown;
