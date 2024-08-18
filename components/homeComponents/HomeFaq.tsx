import Faq from './Faq';
import styles from './HomeFaq.module.css';
import Wave2 from '../assets/Wave2';
import { useContext } from 'react';
import { SectionReferenceContext } from '@/lib/context/section';

export default function HomeFaq(props: { answeredQuestion: AnsweredQuestion[] }) {
  const { scheduleRef } = useContext(SectionReferenceContext);
  return (
    props.answeredQuestion.length != 0 && (
      <section
        className={styles.container}
        style={{
          background: 'linear-gradient(#47c1ca 40%, #4fd4dd)',
          position: 'relative',
          // TODO: enable this when finalizing the UI
          // paddingTop: '30rem',
        }}
        id="faq-section"
      >
        {/* placeholder text */}
        {/* TODO: change the ref value once we un-comment the HomeSchedule section */}
        <div ref={scheduleRef}>
          <h1 className="text-6xl md:text-6xl sm:text-md xs:text-small font-bold text-[#F7CE79] text-stroke text-center pb-10 pt-[10rem] uppercase">
            Schedule coming soon...
          </h1>
        </div>

        {/* TODO: enable this when finalizing the UI */}
        {/* <Wave1
          className={styles.wave1}
          style={{
            position: 'absolute',
            top: '-9%',
            zIndex: 1,
            background: 'linear-gradient(to bottom, rgb(0,0,0,0), #48C2CB)',
          }}
        /> */}
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
