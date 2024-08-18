import React, { SVGProps, useState } from 'react';
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
    <section className="md:text-base text-xs relative bg-[#40B7BA] text-white">
      <div className="flex">
        <div className="z-10 grid grid-cols-1 lg:gap-36 lg:grid-cols-3">
          <div className="lg:text-white p-10">
            <h1 className="font-bold text-2xl">HackUTD</h1>
            {/* <p style={{ maxWidth: '300px' }} className="mt-1">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit
              officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud
              amet.
            </p> */}
            {/* social media here */}
          </div>
          <div className="p-10" style={{ minWidth: '400px', fontFamily: 'inter' }}>
            <h1 className="font-semibold text-xl mb-3">Learn more</h1>
            <div className="font-light">
              <p className="mb-2">
                Check out HackUTD’s{' '}
                <span className="font-semibold cursor-pointer">
                  <Link href="https://hackutd.co/" target="_blank">
                    organizer website
                  </Link>
                </span>
              </p>
              <p className="mb-2">
                Designed by <span className="font-semibold">HackUTD</span>
              </p>
              <p className="mb-2">
                HackPortal developed with {'<3'} <span className="font-semibold">HackUTD </span>
                and <span className="font-semibold">ACM Development</span>
              </p>
              <Link target="_blank" href="https://github.com/acmutd/hackportal">
                <p className="cursor-pointer mb-2">Source Code</p>
              </Link>
            </div>
          </div>
          <div className="p-10" style={{ maxWidth: '300px', fontFamily: 'inter' }}>
            <h1 className="font-semibold text-xl mb-3">Contact Us</h1>
            {/* input for email */}
            <input
              style={{ backgroundColor: '#E2E2E2' }}
              className="border-0 rounded"
              placeholder="Email"
              type="text"
              name="email"
              id="contact-us"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            {/* subscribe button */}
            <button
              onClick={async () => {
                await handleSubmitEmail(userEmail);
              }}
              className="rounded-lg text-white px-6 py-2 my-4 bg-complementary"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
