interface TierTitleProps {
  tierName: string;
}

export default function TierTitle({ tierName }: TierTitleProps) {
  const tierMapping = {
    title: 'linear-gradient(to right, #FFFAEB 20%, #F7CE79 40%, #F5A3B6 60%, #54DDE8 99%)',
    platinum: 'linear-gradient(to bottom, #54DDE8 60%, #289B9E 100%)',
    gold: 'linear-gradient(to bottom, #FFF1D8 33%, #F6D498 66%, #D3A85B 99%)',
    silver: 'linear-gradient(to bottom, #EEEEEE 50%, #B9B9B9 100%)',
    bronze: 'linear-gradient(to bottom, #DEA267, #DEA267)',
  };
  return (
    <div className="mx-auto">
      <h1
        style={{
          backgroundImage: tierMapping[tierName],
        }}
        className="inline-block text-transparent bg-clip-text text-6xl"
      >
        {tierName.toUpperCase()}
      </h1>
    </div>
  );
}
