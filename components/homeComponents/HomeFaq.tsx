import React, { useContext } from 'react';
import Faq from './Faq';
import styles from './HomeFaq.module.css';
import Wave2 from '../assets/Wave2';
import { SectionReferenceContext } from '@/lib/context/section';
import BoulderLeft from 'public/assets/boulderLeft.png';
import BoulderRight from 'public/assets/boulderRight.png';
import Image from 'next/image';
import corgi from 'public/assets/corgi_on_boat.png';

export default function HomeFaq(props: { answeredQuestion: AnsweredQuestion[] }) {
  const { scheduleRef } = useContext(SectionReferenceContext);

  return (
    props.answeredQuestion.length != 0 && (
      <section
        className={styles.container}
        style={{
          background: 'linear-gradient(#47c1ca 40%, #4fd4dd)',
          position: 'relative',
        }}
      >
        {/*****************Delete boulders and corgi once schedule page is back up*****************/}
        {/* Boulder Left */}
        <img src={BoulderLeft.src} className={styles.boulderLeft} />
        {/* Boulder Right */}
        <img src={BoulderRight.src} className={styles.boulderRight} />
        {/* Corgi Image with Bobbing Animation */}
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            animation: 'bobbing 3s ease-in-out infinite',
          }}
        >
          <Image src={corgi} alt="Corgi on boat" width={200} height={200} />
        </div>
        <style jsx>{`
          @keyframes bobbing {
            0%,
            100% {
              transform: translateX(-50%) translateY(0);
            }
            50% {
              transform: translateX(-50%) translateY(-10px);
            }
          }
          @keyframes waveAnimation {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }
          .wave-container {
            position: relative;
            bottom: -20px;
            margin-top: 10rem;
            z-index: 2;
            overflow: hidden;
          }
          .wave-animation {
            animation: waveAnimation 4s ease-in-out infinite;
          }
        `}</style>
        {/* placeholder text */}
        <div id="schedule-section" ref={scheduleRef}>
          <h1 className="text-stroke text-6xl md:text-6xl sm:text-md xs:text-small font-bold text-[#F7CE79] font-jua text-center pb-10 pt-[14rem] uppercase">
            Schedule coming soon...
          </h1>
        </div>
        <Faq fetchedFaqs={props.answeredQuestion}></Faq>
        {/* Wave2 with Vertical Animation */}
        <div className="wave-container">
          <div className="wave-animation">
            <Wave2
              className={styles.wave2}
              style={{
                background:
                  'linear-gradient(to bottom, rgb(218, 195, 151, 0) 55%, rgb(218, 195, 151) 45%)',
              }}
            />
          </div>
        </div>
      </section>
    )
  );
}
