import Head from 'next/head';
import { GetStaticProps } from 'next';
import { RequestHelper } from '../lib/request-helper';
import HomeAboutText from '../components/homeComponents/HomeAboutText';
import HomeAboutPhotos from '../components/homeComponents/HomeAboutPhotos';
import HomeChallenges from '../components/homeComponents/HomeChallenges';
import HomeSponsors from '../components/homeComponents/HomeSponsors';
import HomeFooter from '../components/homeComponents/HomeFooter';
import HomeSchedule from '../components/homeComponents/HomeSchedule';
import HomeFaq from '../components/homeComponents/HomeFaq';
import HomeHero2 from '../components/homeComponents/HomeHero2';
import Wave from '../components/homeComponents/Wave';
import HackCountdown from '../components/homeComponents/HackCountdown';

import themedBackground from '../public/assets/hackutd-bg.png';
import countdownClouds from '../public/assets/countdown_clouds.png';
import cloud from '../public/assets/cloud.png';
import topBg from '../public/assets/topBg.png';

import Image from 'next/image';

export default function Home(props: {
  challenges: Challenge[];
  answeredQuestion: AnsweredQuestion[];
  scheduleCard: ScheduleEvent[];
  dateCard: Dates;
}) {
  return (
    <>
      {/* <HomeNotif /> */}
      {/* <HomeHero2 /> */}
      {/* <HomeAboutText /> */}
      <div style={{ position: 'relative', zIndex: 0 }}>
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
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* <div
            style={{
              position: 'relative',
              zIndex: 1,
              backgroundImage: `url(${countdownClouds.src}), url(${topBg.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 50px',
              backgroundRepeat: 'no-repeat',
            }}
          > */}
          {/* <Wave /> */}
          {/* <HomeAboutPhotos /> */}
          {/* <HomeVideoStats /> */}
          {/* <HackCountdown /> */}
          {/* </div> */}
          {/* <Image
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
          /> */}
          <HomeSchedule scheduleCard={props.scheduleCard} dateCard={props.dateCard} />
          <HomeChallenges challenges={props.challenges} />
          <HomeFaq answeredQuestion={props.answeredQuestion} />
          <HomeSponsors />
          <HomeFooter />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data: answeredQuestion } = await RequestHelper.get<AnsweredQuestion[]>(
    `${process.env.BASE_URL}/api/questions/faq`,
    {},
  );
  const { data: scheduleData } = await RequestHelper.get<ScheduleEvent[]>(
    `${process.env.BASE_URL}/api/schedule`,
    {},
  );
  const { data: dateData } = await RequestHelper.get<ScheduleEvent[]>(
    `${process.env.BASE_URL}/api/dates`,
    {},
  );
  const { data: challengeData } = await RequestHelper.get<Challenge[]>(
    `${process.env.BASE_URL}/api/challenges/`,
    {},
  );
  return {
    props: {
      // keynoteSpeakers: keynoteData,
      challenges: challengeData,
      answeredQuestion: answeredQuestion,
      // fetchedMembers: memberData,
      scheduleCard: scheduleData,
      dateCard: dateData,
      // prizeData: prizeData,
    },
  };
};
