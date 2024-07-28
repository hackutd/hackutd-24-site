import Faq from './Faq';
import Image from 'next/image';
import Wave1 from '../assets/Wave1';
import styles from './HomeFaq.module.css';
import Wave2 from '../assets/Wave2';

export default function HomeFaq(props: { answeredQuestion: AnsweredQuestion[] }) {
  return (
    props.answeredQuestion.length != 0 && (
      <section
        className={styles.container}
        style={{
          background: 'linear-gradient(#47c1ca 40%, #4fd4dd)',
          position: 'relative',
          paddingTop: '30rem',
        }}
        id="faq-section"
      >
        {/* TODO: add fishes */}
        <Wave1
          className={styles.wave1}
          style={{
            position: 'absolute',
            top: '-9%',
            zIndex: 1,
            background: 'linear-gradient(to bottom, rgb(0,0,0,0), #48C2CB)',
          }}
        />
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
