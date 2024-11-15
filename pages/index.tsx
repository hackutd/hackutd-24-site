import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { RequestHelper } from '../lib/request-helper';
import HomeVideoStats from '../components/homeComponents/HomeVideoStats';
import HomeAboutText from '../components/homeComponents/HomeAboutText';
import HomeAboutPhotos from '../components/homeComponents/HomeAboutPhotos';
import HackCountdown from '../components/homeComponents/HackCountdown';
import HomeSponsors from '../components/homeComponents/HomeSponsors';
import HomeFooter from '../components/homeComponents/HomeFooter';
import HomeSchedule from '../components/homeComponents/HomeSchedule';
import HomeFaq from '../components/homeComponents/HomeFaq';
import HomeHero2 from '../components/homeComponents/HomeHero2';
import Wave from '../components/homeComponents/Wave';

import themedBackground from '../public/assets/hackutd-bg.png';
import countdownClouds from '../public/assets/countdown_clouds.png';
import cloud from '../public/assets/cloud.png';
import topBg from '../public/assets/topBg.png';

import Image from 'next/image';

export default function Home(props: {
  answeredQuestion: AnsweredQuestion[];
  sponsorCard: Sponsor[];
  scheduleCard: ScheduleEvent[];
  dateCard: Dates;
}) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
        <title>HackUTD 2024</title>
        <meta name="description" content="A default HackPortal instance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <HomeNotif /> */}
      <HomeHero2 />
      <HomeAboutText />
      <div style={{ position: 'relative', zIndex: 0 }}>
        {/* TODO: enable this when UI is finalized */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${themedBackground.src})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, overflowX: 'hidden' }}>
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              backgroundImage: `url(${countdownClouds.src}), url(${topBg.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 50px',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <Wave />
            <HomeAboutPhotos />
            <HomeVideoStats />
            <HackCountdown />
          </div>
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
          <HomeSchedule scheduleCard={props.scheduleCard} dateCard={props.dateCard} />
          {/* <HomeChallenges challenges={props.challenges} /> */}
          {/* include HomePrizes in HomeChallenges */}
          {/* <HomePrizes prizes={props.prizeData} /> */}
          <HomeFaq answeredQuestion={props.answeredQuestion} />
          <HomeSponsors />
          <HomeFooter />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data: answeredQuestion } = await RequestHelper.get<AnsweredQuestion[]>(
    `${protocol}://${context.req.headers.host}/api/questions/faq`,
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
      answeredQuestion: answeredQuestion,
      scheduleCard: scheduleData,
      dateCard: dateData,
    },
  };
};
