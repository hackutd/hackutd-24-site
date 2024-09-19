interface Prize {
  rank: number;
  prizeName: string;
}

export default function HomePrizesCard(props: { prize: Prize; blockType: number }) {
  const borderConfiguration = ['rounded-tr-[100px]', 'rounded-br-[100px]', 'rounded-tl-[100px]'];
  const rankName = ['first', 'second', 'third'];
  return (
    <div className="w-full h-[200px] mb-[160px]">
      <div className="mx-auto w-4/5">
        {/* Block */}
        <div className={`bg-[#C1C8FF] ${borderConfiguration[props.blockType]} w-full h-[250px]`}>
          &nbsp;
        </div>
        {/* Prize rank */}
        {props.prize.rank < rankName.length && (
          <h1 className="text-center text-2xl font-medium mt-4">
            {rankName[props.prize.rank].toUpperCase()} PLACE
          </h1>
        )}
        {/* Prize name */}
        <h1 className="text-xl text-[#05149C] text-center">
          {props.prize.prizeName.toUpperCase()}
        </h1>
      </div>
    </div>
  );
}
