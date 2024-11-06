import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useState, useEffect, useContext } from 'react';
import FaqDisclosure from './FaqDisclosure';
import { RequestHelper } from '../../lib/request-helper';

import Fish from '../../public/assets/koi.gif';

import Image from 'next/image';
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
  const [faqs, setFaqs] = useState<AnsweredQuestion[]>(fetchedFaqs);
  const [disclosuresStatus, setDisclosureStatus] = useState<boolean[]>(
    fetchedFaqs.map(() => false),
  );
  const { faqRef } = useContext(SectionReferenceContext);

  // Updated fish movement styles to simulate more fluid fish-like swimming motions and add underwater effect
  const fish1HoverStyle = {
    animation: 'fishSwim1 5s infinite alternate ease-in-out',
    opacity: 0.6, // Lower opacity to simulate underwater look
    filter: 'brightness(0.8) contrast(0.9) blur(1px)', // Add slight blur and reduce brightness
  };

  const fish2HoverStyle = {
    animation: 'fishSwim2 7s infinite alternate ease-in-out',
    opacity: 0.6,
    filter: 'brightness(0.8) contrast(0.9) blur(1px)',
  };

  const fish3HoverStyle = {
    animation: 'fishSwim3 6s infinite alternate ease-in-out',
    opacity: 0.6,
    filter: 'brightness(0.8) contrast(0.9) blur(1px)',
  };

  return (
    <div ref={faqRef} id="faq-section" className="flex flex-col flex-grow relative">
      <style>
        {`
          @keyframes fishSwim1 {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(10px, -5px) rotate(5deg); }
            50% { transform: translate(20px, 0) rotate(0deg); }
            75% { transform: translate(10px, 5px) rotate(-5deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }

          @keyframes fishSwim2 {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-10px, 10px) rotate(-10deg); }
            50% { transform: translate(-20px, 0) rotate(0deg); }
            75% { transform: translate(-10px, -10px) rotate(10deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }

          @keyframes fishSwim3 {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(8px, -8px) rotate(8deg); }
            50% { transform: translate(16px, 0) rotate(0deg); }
            75% { transform: translate(8px, 8px) rotate(-8deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
        `}
      </style>
      <Head>
        <title>HackUTD 2024</title>
        <meta name="description" content="HackPortal's Frequently Asked Questions" />
      </Head>
      <div className="top-6">
        {/* <div className="flex flex-row justify-between items-center py-1"> */}
        {/*   <div> */}
        {/*     <Image */}
        {/*       src={Fish2.src} */}
        {/*       alt="fish_2.png" */}
        {/*       width={200} */}
        {/*       height={200} */}
        {/*       style={fish1HoverStyle} */}
        {/*     /> */}
        {/*     <Image */}
        {/*       src={Fish1.src} */}
        {/*       alt="fish_1.png" */}
        {/*       width={200} */}
        {/*       height={200} */}
        {/*       style={fish2HoverStyle} */}
        {/*     /> */}
        {/*   </div> */}
        {/*   <Image */}
        {/*     src={Fish2.src} */}
        {/*     alt="fish_2.png" */}
        {/*     width={200} */}
        {/*     height={200} */}
        {/*     style={fish3HoverStyle} */}
        {/*   /> */}
        {/* </div> */}
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
          {/* FAQ for lg-md */}
          {/* Uses different section for mobile because using 2 columns is buggy when expanding FAQs */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-4">
            {/* TODO: add faq header card */}
            <div className="w-full my-3 pl-[8vw] space-y-4">
              {faqs.map(
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
              {faqs.map(
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
