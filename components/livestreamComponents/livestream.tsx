import clsx from 'clsx';
import Image from 'next/image';
import lsHero from 'public/assets/lsHero.png';

const Livestream = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <Image
        src={lsHero.src}
        height={lsHero.height}
        width={lsHero.width}
        alt="lsHero.png"
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      <div className={clsx('relative z-[1]', 'w-[90%] max-w-7xl')}>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/60 shadow-lg">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Livestream;
