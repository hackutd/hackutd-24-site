import HomePrizesCard from './HomePrizesCard';

interface HomePrizesProps {
  prizes: Array<{
    rank: number;
    prizeName: string;
  }>;
}

export default function HomePrizes({ prizes }: HomePrizesProps) {
  return (
    <section id="prizes-section" className="w-full overflow-hidden py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[25px] gap-y-[25px] max-w-[1140px] mx-auto px-4 sm:px-8 lg:px-0">
        {prizes.map((prize, idx) => (
          <HomePrizesCard
            key={idx}
            prize={prize}
            blockType={idx % 3}
            sponsorTitle=""
            challengeTitle=""
          />
        ))}
      </div>
    </section>
  );
}
