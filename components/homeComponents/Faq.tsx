import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import FaqDisclosure from './FaqDisclosure';
import { RequestHelper } from '../../lib/request-helper';

import Fish1 from '../../public/assets/fish_1.png';
import Fish2 from '../../public/assets/fish_2.png';
import Image from 'next/image';
import { transform } from 'next/dist/build/swc';

/**
 * The FAQ page.
 *
 * This page contains frequently asked questions for the hackathon.
 *
 * Route: /about/faq
 */
export default function FaqPage({ fetchedFaqs }: { fetchedFaqs: AnsweredQuestion[] }) {
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState<AnsweredQuestion[]>([]);
  const [disclosuresStatus, setDisclosureStatus] = useState<boolean[]>();

  const fish1HoverStyle = {
    animation: 'moveLeftRight 2s infinite alternate',
  };

  const fish2HoverStyle = {
    animation: 'moveUpDownLeftRight 4s infinite alternate',
  };

  const fish3HoverStyle = {
    animation: 'moveUpDown 2s infinite alternate',
  };

  useEffect(() => {
    setFaqs(fetchedFaqs);
    setDisclosureStatus(fetchedFaqs.map(() => false));
    setLoading(false);
  }, [fetchedFaqs]);

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow relative">
      <style>
        {`
          @keyframes moveUpDown {
            0% { transform: translateY(0); }
            100% { transform: translateY(-8px); }
          }

          @keyframes moveUpDownLeftRight {
            0% { transform: translate(0, 0); }
            25% { transform: translate(4px, -4px); }
            50% { transform: translate(8px, 0); }
            75% { transform: translate(4px, 4px); }
            100% { transform: translate(0, 0); }
          }

          @keyframes moveLeftRight {
            0% { transform: translateX(0); }
            100% { transform: translateX(8px); }
          }
        `}
      </style>
      <Head>
        <title>HackUTD 2024</title>
        <meta name="description" content="HackPortal's Frequently Asked Questions" />
      </Head>
      <div className="top-6">
        <div className="flex flex-row justify-between items-center py-1">
          <div>
            <Image
              src={Fish2.src}
              alt="fish_2.png"
              width={200}
              height={200}
              style={fish1HoverStyle}
            />
            <Image
              src={Fish1.src}
              alt="fish_1.png"
              width={200}
              height={200}
              style={fish2HoverStyle}
            />
          </div>
          <Image
            src={Fish2.src}
            alt="fish_2.png"
            width={200}
            height={200}
            style={fish3HoverStyle}
          />
        </div>
        <div className="bg-white mx-10 p-10 rounded-lg flex justify-between font-fredoka">
          <div>
            <h1 className="text-3xl mb-4 font-bold text-[#54DDE8]">FAQ</h1>
            <p>Can’t find what you’re looking for? Connect with our team at hello@hackutd.co</p>
          </div>
          {/* <div className="flex items-center">
            <button className="bg-[#DFFEFF] text-[#40B7BA] p-3 rounded-2xl">
              Ask A Questions!
            </button>
          </div> */}
        </div>
        {/* FAQ for lg-md */}
        {/* Uses different section for mobile because using 2 columns is buggy when expanding FAQs */}
        <div className="md:flex hidden justify-between p-6">
          {/* TODO: add faq header card */}
          <div className="w-[49%] my-3 space-y-4 > * + *">
            {faqs.map(
              ({ question, answer }, idx) =>
                idx % 2 == 0 && (
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
          <div className="w-[49%] my-3 space-y-4 > * + *">
            {faqs.map(
              ({ question, answer }, idx) =>
                idx % 2 != 0 && (
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
        <div className="md:hidden">
          <div className="w-full my-3 space-y-4 > * + *">
            {faqs.map(({ question, answer }, idx) => (
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
  );
}

/**
 *
 * Fetch FAQ questions stored in the backend, which will be used as props by FaqPage component upon build time
 *
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data } = await RequestHelper.get<AnsweredQuestion[]>(
    `${protocol}://${context.req.headers.host}/api/questions/faq`,
    {},
  );
  return {
    props: {
      fetchedFaqs: data,
    },
  };
};
