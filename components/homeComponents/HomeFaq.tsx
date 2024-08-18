import Faq from './Faq';
import styles from './HomeFaq.module.css';
import Wave2 from '../assets/Wave2';
import { SectionReferenceContext } from '@/lib/context/section';
import { useContext } from 'react';

export default function HomeFaq(props: { answeredQuestion: AnsweredQuestion[] }) {
  const { faqRef } = useContext(SectionReferenceContext);
  return (
    props.answeredQuestion.length != 0 && (
      <section
        ref={faqRef}
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
        <h1 className="text-6xl md:text-6xl sm:text-md xs:text-small font-bold text-[#F7CE79] text-stroke text-center py-10 uppercase">
          Schedule coming soon...
        </h1>

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
