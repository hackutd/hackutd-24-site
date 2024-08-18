import Image from 'next/image';

export default function HomeChallengeTrackCard(props: {
  challengeTrack: { title: string; subtitle: string; description: string; imgSrc: string };
  blockType: number;
}) {
  return (
    <div className="mx-auto bg-white rounded-lg w-[350px] m-8">
      <div
        className={`mx-auto bg-gradient-to-b from-[#F5A3B6] from-10% to-[#F7CE79] rounded-t-md flex justify-center relative h-[220px]`}
      >
        <Image
          className="absolute -top-11 left-1/2 -rotate-12 -translate-x-1/2"
          src={props.challengeTrack.imgSrc}
          alt="Track Image"
          width={250}
          height={200}
        />
      </div>
      <div className="w-5/6 mx-auto">
        {/* Challenge Name */}
        <h1 className="font-nunito text-xl font-bold mt-4">
          {props.challengeTrack.title.toUpperCase()}
        </h1>
        {/* Challenge subtittle */}
        <h1 className="font-nunito text-lg font-bold my-4">{props.challengeTrack.subtitle}</h1>
        {/* Description */}
        <div className="mb-8 max-w-fit">
          <p className="text-md line-clamp-5 text-balance">{props.challengeTrack.description}</p>
        </div>
      </div>
    </div>
  );
}
