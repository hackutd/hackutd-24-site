import { Disclosure } from '@headlessui/react';
import { PlusIcon, MinusIcon } from '@heroicons/react/solid';
import Markdown from 'react-markdown';
import { useState, useRef, useEffect } from 'react';

/**
 *
 * Represents props used by FaqDisclosure component
 *
 * @param question a frequently asked question
 * @param answer answer to corresponding question
 * @param isOpen boolean variable used to determine whether the disclosure should be open or not
 * @param toggleDisclosure function to call when user wants to open/close disclosure
 *
 */
interface FaqDisclosureProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleDisclosure: () => void;
}

/**
 *
 * Component representing a FAQ question in /about/faq
 *
 */
export default function FaqDisclosure({
  question,
  answer,
  isOpen,
  toggleDisclosure,
}: FaqDisclosureProps) {
  const [maxHeight, setMaxHeight] = useState('0px');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMaxHeight(`${contentRef.current?.scrollHeight}px`);
    } else {
      setMaxHeight('0px');
    }
  }, [isOpen]);

  return (
    <Disclosure>
      <div
        style={{
          boxShadow: '0 5px 16px 0 rgb(8,52,15,0.06)',
        }}
        className="transition duration-500 ease-in-out bg-white rounded-md p-4 mx-5"
      >
        <Disclosure.Button as="div">
          <button
            className="w-full flex justify-between items-center p-2 text-[#6F6C90] font-medium"
            onClick={toggleDisclosure}
          >
            <h1 style={{ fontFamily: 'Fredoka', color: '#170F49' }} className="text-left text-xl">
              {question}
            </h1>

            <div
              style={{ backgroundColor: !isOpen ? '#F7F7FB' : '#54DDE8' }}
              className="p-3 rounded-md transition duration-500 ease-in-out"
            >
              {!isOpen ? (
                <PlusIcon className="transition transform duration-300 ease-in-out w-5 h-5" />
              ) : (
                <MinusIcon className="transition transform duration-300 ease-in-out w-5 h-5 text-white" />
              )}
            </div>
          </button>
        </Disclosure.Button>

        <div
          ref={contentRef}
          style={{
            maxHeight: maxHeight,
            transition: 'max-height 0.5s ease',
            overflow: 'hidden',
          }}
        >
          <Disclosure.Panel
            style={{ color: '#6F6C90' }}
            className="my-2 py-2 p-2 text-left text-sm"
            static
          >
            <Markdown
              components={{
                a(props) {
                  const { node, ...rest } = props;
                  return <a className="underline underline-offset-8" {...rest} />;
                },
              }}
            >
              {answer}
            </Markdown>
          </Disclosure.Panel>
        </div>
      </div>
    </Disclosure>
  );
}
