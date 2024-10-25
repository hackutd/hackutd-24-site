import clsx from 'clsx';

interface TierTitleProps {
  tierName: string;
}

export default function TierTitle({ tierName }: TierTitleProps) {
  const linearGradients = {
    title: 'linear-gradient(to right, #FFFAEB 20%, #F7CE79 40%, #F5A3B6 60%, #54DDE8 99%)',
    platinum: 'linear-gradient(to bottom, #54DDE8 60%, #289B9E 100%)',
    gold: 'linear-gradient(to bottom, #FFF1D8 33%, #F6D498 66%, #D3A85B 99%)',
    silver: 'linear-gradient(to bottom, #EEEEEE 50%, #B9B9B9 100%)',
    bronze: 'linear-gradient(to bottom, #DEA267, #DEA267)',
  };

  const textStrokes = {
    title: '1px rgba(97, 65, 113, 1)',
    platinum: '2px rgba(22, 115, 138, 1)',
    gold: '1px rgba(201, 81, 6, 1)',
    silver: '2px rgba(120, 113, 113, 1)',
    bronze: '2px rgba(174, 86, 86, 1)',
  };

  const textShadows = {
    title: '0px 4px 4px rgba(97, 65, 113, 1)',
    platinum: '0px 10px 4px rgba(0, 0, 0, 0.25)',
    gold: '0px 10px 4px rgba(0, 0, 0, 0.25)',
    silver: '0px 10px 4px rgba(0, 0, 0, 0.25)',
    bronze: '0px 10px 4px rgba(0, 0, 0, 0.25)',
  };

  return (
    <div className="mx-auto">
      <div
        className={clsx('relative font-normal text-6xl font-fredokaOne', {
          ['text-8xl']: tierName === 'title',
        })}
      >
        {/* https://stackoverflow.com/questions/3802218/how-do-i-combine-css-text-shadow-and-background-image-webkit-gradient */}

        {/* Under layer for shadow */}
        <h1
          style={{
            textShadow: textShadows[tierName],
          }}
          className="text-transparent"
        >
          {tierName.toUpperCase()}
        </h1>

        {/* Upper layer for text and linear gradient */}
        <h1
          style={{
            backgroundImage: linearGradients[tierName],
            WebkitTextStroke: textStrokes[tierName],
          }}
          className="absolute top-0 w-full text-transparent bg-clip-text"
        >
          {tierName.toUpperCase()}
        </h1>
      </div>
    </div>
  );
}
