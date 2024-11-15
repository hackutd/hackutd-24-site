import Image from 'next/image';
import middleWave from 'public/assets/middle_wave.png';
import Track1Image from '../../public/assets/track_1.png';
import Track2Image from '../../public/assets/track_2.png';
import Track3Image from '../../public/assets/track_3.png';
import GrandPrize from '../../public/assets/mac.png';
import HomeChallengesCard from './HomeChallengeCard';
import styles from './HomeChallenges.module.css';
import HomeChallengeTrackCard from './HomeChallengeTrackCard';

const CHALLENGE_TRACKS = [
  {
    title: 'Grand Prize',
    subtitle: 'Grand Prize',
    description: 'Macbook Air',
    imgSrc: GrandPrize.src,
  },
  {
    title: 'First Place Software',
    subtitle: '1st place software',
    description: 'BenQ Monitor',
    imgSrc: Track1Image.src,
  },
  {
    title: 'Second Place Software',
    subtitle: '2nd place software',
    description: 'Oculus 3S',
    imgSrc: Track2Image.src,
  },
  {
    title: 'Third Place Software',
    subtitle: '3rd place software',
    description: 'Ninja Creami',
    imgSrc: Track3Image.src,
  },
];

export default function HomeChallengesComponent(props: { challenges: Challenge[] }) {
  return (
    props.challenges.length !== 0 && (
      <section className={`${styles.container} m-auto pb-[20rem] relative`}>
        <Image
          src={middleWave.src}
          height={middleWave.height}
          width={middleWave.width}
          alt="middle_wave.png"
          className="absolute top-0 left-0 w-full h-full z-0"
        />

        <div className={styles.content}>
          <div
            style={{ textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' }}
            className="font-montserrat font-bold md:text-4xl text-2xl text-center text-white"
          >
            Challenge Tracks
          </div>
          <div
            style={{ textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' }}
            className="text-center text-5xl font-bold text-[#F7CE79] p-4 font-fredoka uppercase"
          >
            Choose your track to get started
          </div>

          {/* Challenge Tracks */}
          <div className="flex pt-14 px-16 flex-wrap lg:flex-nowrap gap-4">
            {CHALLENGE_TRACKS.map((track, idx) => (
              <HomeChallengeTrackCard key={idx} challengeTrack={track} blockType={idx % 3} />
            ))}
          </div>

          {/* TODO: enable this after get challenge data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:p-10 items-center gap-x-6 gap-y-6 mt-6 mx-auto">
            {props.challenges.map((challenge, idx) => (
              <HomeChallengesCard key={idx} challenge={challenge} blockType={idx % 2} />
            ))}
          </div>
        </div>
      </section>
    )
  );
}
