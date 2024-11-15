import React from 'react';
import Faq from './Faq';
import styles from './HomeFaq.module.css';
import Wave2 from '../assets/Wave2';

export default function HomeFaq(props: { answeredQuestion: AnsweredQuestion[] }) {
  return (
    props.answeredQuestion.length != 0 && (
      <section
        className={styles.container}
        style={{
          background: 'linear-gradient(#4bccd3 40%, #4fd4dd)',
          position: 'relative',
        }}
      >
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
