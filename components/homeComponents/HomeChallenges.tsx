import { useEffect, useState } from 'react';
import HomeChallengesCard from './HomeChallengeCard';

export default function HomeChallengesComponent(props: { challenges: Challenge[] }) {
  return (
    props.challenges.length !== 0 && (
      <section className="md:py-12 py-6 xl:w-9/10 w-11/12 m-auto">
        <div className="flex items-center">
          <div className="flex-1 mr-6 border-t-4 border-black"></div>
          <span className="font-fredoka font-bold md:text-4xl text-2xl text-center text-[#05149C]">
            Challenge Tracks
          </span>
          <div className="flex-1 ml-6 border-t-4 border-black"></div>
        </div>
        <div className="w-full mb-2">
          <div className="md:w-2/5 w-full mx-auto p-4 text-balance">
            <p className="text-center">
              Hackathons are 24-hour gatherings where students collaborate to create innovative
              projects, forge new connections, and compete for prizes.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:p-10 items-center gap-x-6 mt-6 mx-auto">
          {props.challenges.map((challenge, idx) => (
            <HomeChallengesCard key={idx} challenge={challenge} blockType={idx % 3} />
          ))}
        </div>
      </section>
    )
  );
}
