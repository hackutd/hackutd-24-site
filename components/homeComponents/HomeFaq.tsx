import Faq from './Faq';
import wave from '../../public/assets/wave1.png';
import Image from 'next/image';
import Wave1 from './Wave1';

export default function HomeFaq(props: { answeredQuestion: AnsweredQuestion[] }) {
  return (
    props.answeredQuestion.length != 0 && (
      <section
        style={{
          // background: 'linear-gradient(to bottom, #3AB8BA, #43C0C5 10%, #68CBDB)',
          paddingTop: '40rem',
          position: 'relative',
          zIndex: 9997,
        }}
        id="faq-section"
      >
        <Wave1 style={{ position: 'absolute', top: '-200px', left: '-10px', zIndex: '9998' }} />
        <Faq fetchedFaqs={props.answeredQuestion}></Faq>
      </section>
    )
  );
}
