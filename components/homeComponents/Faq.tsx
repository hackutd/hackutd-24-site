import React, { useState, useContext } from 'react';
import FaqDisclosure from './FaqDisclosure';

import { SectionReferenceContext } from '@/lib/context/section';
import Link from 'next/link';

/**
 * The FAQ page.
 *
 * This page contains frequently asked questions for the hackathon.
 *
 * Route: /about/faq
 */
export default function FaqPage({ fetchedFaqs }: { fetchedFaqs: AnsweredQuestion[] }) {
  const [disclosuresStatus, setDisclosureStatus] = useState<boolean[]>(
    fetchedFaqs.map(() => false),
  );
  const { faqRef } = useContext(SectionReferenceContext);

  return (
    <div ref={faqRef} id="faq-section" className="flex flex-col flex-grow relative">
      <div className="top-6">
        <div className="pt-[8rem]">
          <div className="bg-white mx-[8vw] p-10 rounded-lg flex justify-between font-fredoka">
            <div className="pt-3">
              <h1 className="text-3xl mb-4 font-bold text-[#54DDE8]">FAQ</h1>
              <p>Can’t find what you’re looking for? Connect with our team at hello@hackutd.co</p>
            </div>
            <div className="flex items-center">
              <Link
                href="mailto:hello@hackutd.co"
                className="bg-[#DFFEFF] text-[#40B7BA] p-3 rounded-2xl"
              >
                Ask A Question!
              </Link>
            </div>
          </div>
          {/* Uses different section for mobile because using 2 columns is buggy when expanding FAQs */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-4">
            <div className="w-full my-3 pl-[8vw] space-y-4">
              {fetchedFaqs.map(
                ({ question, answer }, idx) =>
                  idx % 2 === 0 && (
                    <FaqDisclosure
                      key={idx}
                      question={question}
                      answer={answer}
                      isOpen={disclosuresStatus[idx]}
                      toggleDisclosure={() => {
                        const currDisclosure = [...disclosuresStatus];
                        currDisclosure[idx] = !currDisclosure[idx];
                        setDisclosureStatus(currDisclosure);
                      }}
                    />
                  ),
              )}
            </div>
            {/* Right column for odd index FAQs */}
            <div className="w-full my-3 pr-[8vw] space-y-4">
              {fetchedFaqs.map(
                ({ question, answer }, idx) =>
                  idx % 2 !== 0 && (
                    <FaqDisclosure
                      key={idx}
                      question={question}
                      answer={answer}
                      isOpen={disclosuresStatus[idx]}
                      toggleDisclosure={() => {
                        const currDisclosure = [...disclosuresStatus];
                        currDisclosure[idx] = !currDisclosure[idx];
                        setDisclosureStatus(currDisclosure);
                      }}
                    />
                  ),
              )}
            </div>
          </div>
          {/* FAQ for mobile */}
          <div className="lg:hidden">
            <div className="mx-[8vw] my-3 space-y-4">
              {fetchedFaqs.map(({ question, answer }, idx) => (
                <FaqDisclosure
                  key={idx}
                  question={question}
                  answer={answer}
                  isOpen={disclosuresStatus[idx]}
                  toggleDisclosure={() => {
                    const currDisclosure = [...disclosuresStatus];
                    currDisclosure[idx] = !currDisclosure[idx];
                    setDisclosureStatus(currDisclosure);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
