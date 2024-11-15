import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import HackCountdown from '../components/homeComponents/HackCountdown';
import HomeAboutPhotos from '../components/homeComponents/HomeAboutPhotos';
import HomeAboutText from '../components/homeComponents/HomeAboutText';
import HomeFaq from '../components/homeComponents/HomeFaq';
import HomeFooter from '../components/homeComponents/HomeFooter';
import HomeHero2 from '../components/homeComponents/HomeHero2';
import HomeSchedule from '../components/homeComponents/HomeSchedule';
import HomeSponsors from '../components/homeComponents/HomeSponsors';
import HomeVideoStats from '../components/homeComponents/HomeVideoStats';
import Wave from '../components/homeComponents/Wave';
import { RequestHelper } from '../lib/request-helper';
import cloud from '../public/assets/cloud.png';
import countdownClouds from '../public/assets/countdown_clouds.png';
import hackutdBg from '../public/assets/hackutd-bg.png';
import topBg from '../public/assets/topBg.png';

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
        {/* <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${hackutdBg.src})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        /> */}

        {/* Themed ocean background of HackUTD */}
        <Image
          src={hackutdBg.src}
          width={hackutdBg.width}
          height={hackutdBg.height}
          alt="hackutd-bg.png"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        <div style={{ position: 'relative', zIndex: 1, overflowX: 'hidden' }}>
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              // backgroundImage: `url(${countdownClouds.src}), url(${topBg.src})`,
              // backgroundSize: 'cover',
              // backgroundPosition: 'center 50px',
              // backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Bottom layer background */}
            <Image
              src={topBg.src}
              width={topBg.width}
              height={topBg.height}
              alt="topBg.png"
              className="absolute z-0 top-0 left-0 w-full h-full object-cover"
            />

            {/* Top layer background */}
            <Image
              src={countdownClouds.src}
              width={countdownClouds.width}
              height={countdownClouds.height}
              alt="countdown_clouds.png"
              className="absolute z-[1] top-0 left-0 w-full h-full object-cover"
            />

            <div className="relative z-[2]">
              <Wave />
              <HomeAboutPhotos />
              {screen.width >= 1000 && <HomeVideoStats />}
              <HackCountdown />
            </div>
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
          <HomeSponsors sponsorCard={props.sponsorCard} />
          <HomeFooter />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  // const { data: keynoteData } = await RequestHelper.get<KeynoteSpeaker[]>(
  //   `${protocol}://${context.req.headers.host}/api/keynotespeakers`,
  //   {},
  // );
  // const { data: challengeData } = await RequestHelper.get<Challenge[]>(
  //   `${protocol}://${context.req.headers.host}/api/challenges/`,
  //   {},
  // );
  // const { data: prizeData } = await RequestHelper.get<Array<{ rank: number; prizeName: string }>>(
  //   `${protocol}://${context.req.headers.host}/api/prizes`,
  //   {},
  // );
  const { data: answeredQuestion } = await RequestHelper.get<AnsweredQuestion[]>(
    `${protocol}://${context.req.headers.host}/api/questions/faq`,
    {},
  );
  // const { data: memberData } = await RequestHelper.get<TeamMember[]>(
  //   `${protocol}://${context.req.headers.host}/api/members`,
  //   {},
  // );
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
      // keynoteSpeakers: keynoteData,
      // challenges: challengeData,
      answeredQuestion: answeredQuestion,
      // fetchedMembers: memberData,
      sponsorCard: sponsorData,
      scheduleCard: scheduleData,
      dateCard: dateData,
      // prizeData: prizeData,
    },
  };
};
