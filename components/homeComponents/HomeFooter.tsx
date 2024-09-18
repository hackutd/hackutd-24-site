import React, { useState } from 'react';
import Link from 'next/link';
import { RequestHelper } from '@/lib/request-helper';

export default function HomeFooter() {
  const [userEmail, setUserEmail] = useState<string>('');
  const handleSubmitEmail = async (userEmail: string) => {
    const res = await RequestHelper.post<{ userEmail: string }, unknown>(
      '/api/email',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      {
        userEmail,
      },
    );
    if (res.status === 200) {
      alert('Your email has been added to our mailing list');
    } else {
      alert('Something is wrong... please try again later');
    }
  };

  return (
    <section className="md:text-base text-xs bg-[#40B7BA] text-white py-10">
      <div className="container mx-auto flex flex-wrap justify-between items-start">
        {/* HackUTD Section */}
        <div className="flex-1 p-4">
          <h1 className="font-bold text-2xl">HackUTD</h1>
          <Link href="mailto:hello@hackutd.co">
            <p
              className="underline mt-1 font-medium"
              style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', textUnderlineOffset: '2px' }}
            >
              Contact Us
            </p>
          </Link>
        </div>

        {/* Other Hackathons Section */}
        <div className="flex-1 p-4">
          <h1 className="font-bold text-2xl">Other Hackathons</h1>
          <p
            className="underline mt-1 font-medium"
            style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', textUnderlineOffset: '2px' }}
          >
            <Link href="https://www.wehackutd.com" passHref>
              WEHack
            </Link>
          </p>
          <p
            className="underline mt-1 font-medium"
            style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', textUnderlineOffset: '2px' }}
          >
            <Link href="https://hacktx.com" passHref>
              HackTX
            </Link>
          </p>
          <p
            className="underline mt-1 font-medium"
            style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', textUnderlineOffset: '2px' }}
          >
            <Link href="https://tamuhack.org" passHref>
              TAMUHack
            </Link>
          </p>
          <p
            className="underline mt-1 font-medium"
            style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', textUnderlineOffset: '2px' }}
          >
            <Link href="https://www.hackuta.org" passHref>
              HackUTA
            </Link>
          </p>
          <p
            className="underline mt-1 font-medium"
            style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', textUnderlineOffset: '2px' }}
          >
            <Link href="https://www.unthackathon.com" passHref>
              HackUNT
            </Link>
          </p>
          <p
            className="underline mt-1 font-medium"
            style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', textUnderlineOffset: '2px' }}
          >
            <Link href="https://rowdyhacks.org" passHref>
              RowdyHacks
            </Link>
          </p>
        </div>

        {/* Learn More Section */}
        <div className="flex-1 p-4">
          <h1 className="font-semibold text-xl mb-3">Learn more</h1>
          <div className="font-light">
            <p
              className="mb-2"
              style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', textUnderlineOffset: '2px' }}
            >
              Check out HackUTD’s{' '}
              <span
                className="font-semibold cursor-pointer underline"
                style={{ textUnderlineOffset: '2px' }}
              >
                <Link href="https://hackutd.co/" target="_blank">
                  organizer website
                </Link>
              </span>
            </p>
            <p className="mb-2">
              Designed by{' '}
              <span
                className="font-semibold"
                style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', textUnderlineOffset: '2px' }}
              >
                HackUTD
              </span>
            </p>
            <p className="mb-2">
              HackPortal developed with {'<3'}{' '}
              <span
                className="font-semibold"
                style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', textUnderlineOffset: '2px' }}
              >
                HackUTD{' '}
              </span>
              and{' '}
              <span
                className="font-semibold"
                style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', textUnderlineOffset: '2px' }}
              >
                ACM Development
              </span>
            </p>
            <Link target="_blank" href="https://github.com/acmutd/hackportal">
              <p
                className="cursor-pointer mb-2 underline"
                style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', textUnderlineOffset: '2px' }}
              >
                Source Code
              </p>
            </Link>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="flex-1 p-4 max-w-sm">
          <h1 className="font-semibold text-xl mb-3">Follow our Newsletter</h1>
          {/* Wrap input and button in a container */}
          <div className="flex flex-col gap-4">
            <input
              style={{ backgroundColor: '#E2E2E2' }}
              className="border-0 rounded p-2"
              placeholder="Email"
              type="text"
              name="email"
              id="contact-us"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <button
              onClick={async () => {
                await handleSubmitEmail(userEmail);
              }}
              className="mb-10 md:mb-0 w-full rounded-lg text-white px-6 py-2 bg-complementary"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
