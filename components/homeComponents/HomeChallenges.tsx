import React, { useEffect, useState } from 'react';
import HomeChallengesCard from './HomeChallengeCard';
import $ from 'jquery';
import HomePrizes from './HomePrizes';
import { GetServerSideProps } from 'next';
import { RequestHelper } from '@/lib/request-helper';
import HomeChallengeTrackCard from './HomeChallengeTrackCard';

import Track1Image from '../../public/assets/track_1.png';
import Track2Image from '../../public/assets/track_2.png';
import Track3Image from '../../public/assets/track_3.png';
import wave from '../../public/assets/middle_wave.png';
import background from '../../public/assets/sea_bg.png';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import styles from './HomeChallenges.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
const CHALLENGE_TRACKS = [
  {
    title: 'First Place Software',
    subtitle: '1st place software',
    description: 'Short description of the speaker blah blah blah blah blah blah blah',
    imgSrc: Track1Image.src,
  },
  {
    title: 'Second Place Software',
    subtitle: '2nd place software',
    description: 'Short description of the speaker blah blah blah blah blah blah blah',
    imgSrc: Track2Image.src,
  },
  {
    title: 'Third Place Software',
    subtitle: '3rd place software',
    description: 'Short description of the speaker blah blah blah blah blah blah blah',
    imgSrc: Track3Image.src,
  },
];

export default function HomeChallengesComponent(props: { challenges: Challenge[] }) {
  return (
    props.challenges.length !== 0 && (
      <section
        // style={{
        //   backgroundColor: '#3CB8B9',
        //   zIndex: 1,
        //   position: 'relative',
        //   paddingTop: '10rem',
        //   backgroundImage: `url(${wave.src})`,
        //   backgroundSize: 'cover',
        // }}
        style={{
          zIndex: 9997,
          position: 'relative',
        }}
        className="md:py-12 py-6 m-auto"
      >
        <div
          className={styles.sea}
          style={{
            position: 'absolute',
            top: '30%',
            left: 0,
            backgroundImage: `url(${background.src})`,
            backgroundSize: 'cover',
            width: '100%',
            zIndex: -1,
          }}
        />
        {/* TODO: update font */}
        {/* TODO: update shadow */}
        <span className="font-fredoka font-bold md:text-4xl text-2xl text-center text-white">
          Challenge Tracks
        </span>
        {/* TODO: add drop shadow */}
        {/* TODO: change font family */}
        <div className="text-center text-5xl font-bold text-[#F7CE79] p-4 font-fredoka uppercase">
          Choose your track to get started
        </div>

        {/* Challenge Tracks */}
        {/* TODO: media query for challenge track card */}
        <div className="flex pt-14 px-16 flex-wrap">
          {/* <Swiper
            navigation={true}
            modules={[Navigation]}
            className="mySwiper"
            slidesPerView={1}
            spaceBetween={5}
            // Responsive breakpoints
            breakpoints={{
              // when window width is >= 320px
              320: {
                slidesPerView: 1,
                spaceBetween: 5,
              },
              // when window width is >= 480px
              480: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              620: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              // when window width is >= 640px
              840: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
            }}
          >
          </Swiper> */}
          {CHALLENGE_TRACKS.map((track, idx) => (
            <HomeChallengeTrackCard key={idx} challengeTrack={track} blockType={idx % 3} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:p-10 items-center gap-x-6 gap-y-6 mt-6 mx-auto">
          {props.challenges.map((challenge, idx) => (
            // TODO: update styling for challenge card
            <HomeChallengesCard key={idx} challenge={challenge} blockType={idx % 2} />
          ))}
        </div>
      </section>
    )
  );
}
