import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { RequestHelper } from '../lib/request-helper';
import HomeNotif from '../components/homeComponents/HomeNotif';
import HomeVideoStats from '../components/homeComponents/HomeVideoStats';
import HomeAbout from '../components/homeComponents/HomeAbout';
import HackCountdown from '../components/homeComponents/HackCountdown';
import HomeSpeakers from '../components/homeComponents/HomeSpeakers';
import HomeChallenges from '../components/homeComponents/HomeChallenges';
import HomeTeam from '../components/homeComponents/HomeTeam';
import HomeSponsors from '../components/homeComponents/HomeSponsors';
import HomeFooter from '../components/homeComponents/HomeFooter';
import HomeSchedule from '../components/homeComponents/HomeSchedule';
import HomeFaq from '../components/homeComponents/HomeFaq';
import HomePrizes from '../components/homeComponents/HomePrizes';
import HomeHero2 from '../components/homeComponents/HomeHero2';

import themedBackground from '../public/assets/bg3.png';

import cloud from '../public/assets/cloud.png';

import Image from 'next/image';

/**
 * The home page.
 *
 * Landing: /
 *
 */
export default function Home(props: {
  keynoteSpeakers: KeynoteSpeaker[];
  challenges: Challenge[];
  answeredQuestion: AnsweredQuestion[];
  fetchedMembers: TeamMember[];
  sponsorCard: Sponsor[];
  scheduleCard: ScheduleEvent[];
  dateCard: Dates;
  prizeData: Array<{ rank: number; prizeName: string }>;
}) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Wait for all components to render before showing page
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>HackPortal</title> {/* !change */}
        <meta name="description" content="A default HackPortal instance" /> {/* !change */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeNotif />
      <HomeHero2 />
      {/* TODO: modify background dimension */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2600px',
            background: 'linear-gradient(to bottom, #3398D1 30%, #8BD1F0, #C6E9F4)',
            zIndex: 0,
          }}
        />
        <Image
          style={{
            position: 'absolute',
            top: '1100px',
            right: '-100px',
            filter: 'blur(8px)',
          }}
          src={cloud.src}
          width={300}
          height={300}
          alt="cloud.png"
        />

        <HomeAbout />
        <HomeVideoStats />
        <HackCountdown />
        <HomeSchedule scheduleCard={props.scheduleCard} dateCard={props.dateCard} />
        {/* <HomeSpeakers keynoteSpeakers={props.keynoteSpeakers} /> */}
        <HomeChallenges challenges={props.challenges} />
        {/* include HomePrizes in HomeChallenges */}
        {/* <HomePrizes prizes={props.prizeData} /> */}
        <HomeFaq answeredQuestion={props.answeredQuestion} />
        <HomeSponsors sponsorCard={props.sponsorCard} />
        <HomeFooter />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data: keynoteData } = await RequestHelper.get<KeynoteSpeaker[]>(
    `${protocol}://${context.req.headers.host}/api/keynotespeakers`,
    {},
  );
  const { data: challengeData } = await RequestHelper.get<Challenge[]>(
    `${protocol}://${context.req.headers.host}/api/challenges/`,
    {},
  );
  const { data: prizeData } = await RequestHelper.get<Array<{ rank: number; prizeName: string }>>(
    `${protocol}://${context.req.headers.host}/api/prizes`,
    {},
  );
  const { data: answeredQuestion } = await RequestHelper.get<AnsweredQuestion[]>(
    `${protocol}://${context.req.headers.host}/api/questions/faq`,
    {},
  );
  const { data: memberData } = await RequestHelper.get<TeamMember[]>(
    `${protocol}://${context.req.headers.host}/api/members`,
    {},
  );
  const { data: sponsorData } = await RequestHelper.get<Sponsor[]>(
    `${protocol}://${context.req.headers.host}/api/sponsor`,
    {},
  );
  const { data: scheduleData } = await RequestHelper.get<ScheduleEvent[]>(
    `${protocol}://${context.req.headers.host}/api/schedule`,
    {},
  );
  const { data: dateData } = await RequestHelper.get<ScheduleEvent[]>(
    `${protocol}://${context.req.headers.host}/api/dates`,
    {},
  );
  return {
    props: {
      keynoteSpeakers: keynoteData,
      challenges: challengeData,
      answeredQuestion: answeredQuestion,
      fetchedMembers: memberData,
      sponsorCard: sponsorData,
      scheduleCard: scheduleData,
      dateCard: dateData,
      prizeData: prizeData,
    },
  };
};
