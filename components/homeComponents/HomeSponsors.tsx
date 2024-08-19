import { useEffect, useState } from 'react';
import SponsorCard from './SponsorCard';
import Wave2 from '../assets/Wave2';
import styles from './HomeSponsors.module.css';

import PlaceholderMascot1 from '../../public/assets/Mascot.gif';
import PlaceholderMascot2 from '../../public/assets/Corgi.gif';
import PlaceholderMascot3 from '../../public/assets/Capybara.gif';
import PlaceholderMascot4 from '../../public/assets/Duck.gif';
import PlaceholderMascot5 from '../../public/assets/Frog.gif';

import PlaceholderMascot from '../../public/assets/Reveal.gif';

import Image from 'next/image';

export default function HomeSponsors(props: { sponsorCard: Sponsor[] }) {
  const [sponsor, setSponsor] = useState<Sponsor[]>([]);

  useEffect(() => {
    setSponsor(props.sponsorCard);
  });

  return (
    sponsor.length != 0 && (
      <section className="relative pt-[10rem] bg-[#DAC397]">
        {/* TODO: will update styling better once get more assets and finalized content */}
        <div>
          <div className="text-center text-3xl text-white">
            <h1 className="uppercase">see you there!</h1>
          </div>
          <div className="flex flex-wrap w-full items-end justify-center mb-8">
            <div
              className={styles.placeholder}
              style={{
                position: 'relative',
                maxWidth: '100vw',
              }}
            >
              <Image src={PlaceholderMascot.src} layout="fill" alt="placeholder_5" />
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-grow">
          <h4 className="text-white font-semibold md:text-2xl text-xl my-4 text-center uppercase font-fredoka">
            Sponsorship
          </h4>
          <h2 className="uppercase text-center text-white font-bold text-4xl">
            interested in sponsoring?
          </h2>
          <h2 className="mt-1 text-center text-white">If you would like to sponsor HackUTD,</h2>
          <h2 className="text-center text-white">
            please reach out to us at&nbsp;
            <a
              href="mailto:hello@hackutd.co"
              rel="noopener noreferrer"
              target="_blank"
              className="underline"
            >
              hello@hackutd.co
            </a>
          </h2>
          {/* Sponsor Card */}
          <section className="flex flex-wrap justify-center p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {sponsor.map(({ link, reference }, idx) => (
                <SponsorCard key={idx} link={link} reference={reference} />
              ))}
            </div>
          </section>
        </div>
        <div className="mt-4">
  <p className="text-4xl text-center font-bold text-white">and more to come!</p>
</div>

      </section>
    )
  );
}
