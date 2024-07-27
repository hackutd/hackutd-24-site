import React, { SVGProps } from 'react';

export default function HomeFooter() {
  return (
    // TODO: update styling
    <section className="md:text-base text-xs relative bg-[#40B7BA] text-white">
      <div className="flex">
        <div className="z-10 grid grid-cols-1 lg:gap-36 lg:grid-cols-3">
          <div className="lg:text-white p-10">
            <h1 className="font-bold text-2xl mt-10">HackPortal</h1>
            <p style={{ maxWidth: '300px' }} className="mt-1">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit
              officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud
              amet.
            </p>
            {/* social media here */}
          </div>
          <div className="p-10" style={{ minWidth: '400px', fontFamily: 'inter' }}>
            <h1 className="font-semibold text-xl mb-3">Learn more</h1>
            <div className="font-light">
              <p className="mb-2">
                Check out HackUTD’s <span className="font-semibold">organizer website</span>
              </p>
              <p className="mb-2">
                Designed by <span className="font-semibold">HackUTD</span>
              </p>
              <p className="mb-2">
                HackPortal developed with {'<3'} <span className="font-semibold">HackUTD </span>
                and <span className="font-semibold">ACM Development</span>
              </p>
              <p className="mb-2">Source Code</p>
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
            />
            {/* subscribe button */}
            <button
              className="rounded-lg text-white px-6 py-2 my-4"
              style={{ backgroundColor: '#7B81FF' }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div
        // hardcoded background color for now, but will upgrade to tailwind later
        style={{ height: '37px', width: '100%', backgroundColor: '#7B81FF' }}
        className="absolute bottom-0 flex items-center justify-center"
      >
        <h2 className="text-center text-white">All Copyrights are reserved by HackUTD</h2>
      </div>
    </section>
  );
}
