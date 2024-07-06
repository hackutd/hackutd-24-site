import HomePrizesCard from './HomePrizesCard';

interface HomePrizesProps {
  prizes: Array<{
    rank: number;
    prizeName: string;
  }>;
}

export default function HomePrizes({ prizes }: HomePrizesProps) {
  return (
    <section className="w-full overflow-hidden">
      {/* Banner */}
      <div className="-mx-4 mt-[120px] -rotate-[7deg] bg-[#7B81FF] text-white py-[0.35rem] w-[2000px] overflow-hidden line-clamp-1">
        <p>
          {Array.apply(null, Array(200))
            .map(() => 'PRIZES')
            .join('  ')}
        </p>
      </div>
      {/* Component */}
      <div className="md:py-12 py-6 xl:w-9/10 w-11/12 m-auto">
        <h1 className="font-fredoka mt-[100px] text-3xl text-center font-bold text-[#05149C]">
          Prizes
        </h1>
        <p className="text-center">Potential prize that participants can win!</p>
        <div className="md:grid md:grid-cols-3 flex flex-col gap-x-6 gap-y-[140px] mt-6">
          {prizes.map((prize, idx) => (
            <HomePrizesCard key={idx} prize={prize} blockType={idx % 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
