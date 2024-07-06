import Faq from './Faq';

export default function HomeFaq(props: { answeredQuestion: AnsweredQuestion[] }) {
  return (
    props.answeredQuestion.length != 0 && (
      <section id="faq-section" style={{ backgroundColor: '#F7F7FB' }} className="p-1">
        <Faq fetchedFaqs={props.answeredQuestion}></Faq>
      </section>
    )
  );
}
