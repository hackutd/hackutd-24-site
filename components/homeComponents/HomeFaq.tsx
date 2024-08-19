import Faq from './Faq';
import styles from './HomeFaq.module.css';
import Wave2 from '../assets/Wave2';
import { useContext } from 'react';
import { SectionReferenceContext } from '@/lib/context/section';
import BoulderLeft from '../assets/BoulderLeft';
import BoulderRight from '../assets/BoulderRight';
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
        <BoulderLeft
          style={{
            position: 'absolute',
            top: '-75px', // Move the boulder higher up
            left: '0px', // Adjust from the left edge
            zIndex: 3,
            width: '600px', // Set the width to make the boulder less wide
          }}
        />

        {/* Boulder Right */}
        <BoulderRight
          style={{
            position: 'absolute',
            top: '-65px', // Move the boulder higher up
            right: '0px', // Adjust from the right edge
            zIndex: 3,
            width: '600px', // Set the width to make the boulder less wide
          }}
        />

        {/* Corgi Image with Bobbing Animation */}
        <div
          style={{
            position: 'absolute',
            top: '5px', // Adjust this value as needed to position the corgi below the boulders
            left: '50%',
            transform: 'translateX(-50%)', // Center the image horizontally
            zIndex: 4, // Ensure it is above the boulders and below the text
            animation: 'bobbing 3s ease-in-out infinite', // Bobbing animation
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
        `}</style>

        {/* placeholder text */}
        <div id="schedule-section" ref={scheduleRef}>
          <h1 className="text-6xl md:text-6xl sm:text-md xs:text-small font-bold text-[#F7CE79] text-stroke text-center pb-10 pt-[10rem] uppercase">
            Schedule coming soon...
          </h1>
        </div>

        <Faq fetchedFaqs={props.answeredQuestion}></Faq>

        <Wave2
          className={styles.wave2}
          style={{
            marginTop: '10rem',
            zIndex: 2,
            background:
              'linear-gradient(to bottom, rgb(218, 195, 151, 0) 55%, rgb(218, 195, 151) 45%)',
          }}
        />
      </section>
    )
  );
}
